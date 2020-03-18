import bz2
import os
import queue
import shutil
import sys
import time
import traceback
from uuid import uuid4

import mwparserfromhell
import requests
from elasticsearch import Elasticsearch
from lxml import etree
from lxml.etree import Element


class Page:
    def __init__(self, element: Element):
        self.ignored = False

        for child in element.getchildren():
            if child.tag == "{http://www.mediawiki.org/xml/export-0.10/}redirect":
                self.ignored = True
                return
            if child.tag == "{http://www.mediawiki.org/xml/export-0.10/}ns" and child.text != "0":
                self.ignored = True
                return
            if child.tag == "{http://www.mediawiki.org/xml/export-0.10/}title":
                self.title = child.text
            if child.tag == "{http://www.mediawiki.org/xml/export-0.10/}id":
                self.id = child.text
            if child.tag == "{http://www.mediawiki.org/xml/export-0.10/}revision":
                for revision in child.getchildren():
                    if revision.tag == "{http://www.mediawiki.org/xml/export-0.10/}text":
                        self.body = mwparserfromhell.parse(revision.text).strip_code()
                        break

        element.clear()


def index(page: Page, client: Elasticsearch, index_queue: queue.Queue):
    index_queue.put(page)

    if index_queue.full():
        bulk(index_queue, client)


def bulk(index_queue: queue.Queue, client: Elasticsearch):
    payload = []
    while not index_queue.empty():
        page = index_queue.get()
        payload.append({"index": {"_index": "wiki", "_id": page.id}})
        payload.append({"title": page.title, "body": page.body})
    client.bulk(payload)


def create_index(client: Elasticsearch):
    client.indices.create("wiki", ignore=400, body={
        "settings": {
            "number_of_shards": 1,
        },
        "mappings": {
            "properties": {
                "title": {"type": "text"},
                "body": {"type": "text"}
            }
        }
    })


def work(path: str):
    es_host = os.getenv("ES_HOST")
    es_user = os.getenv("ES_USER")
    es_pass = os.getenv("ES_PASS")

    if not es_host:
        print("No ES_HOST specified")
        exit(1)

    es = Elasticsearch(
        hosts=[es_host],
        http_auth=((es_user, es_pass) if es_user else None)
    )

    try:

        create_index(es)
        index_queue = queue.Queue(maxsize=100)

        if path.startswith("https://"):
            local = "dumps/piece-" + str(uuid4())
            print("Downloading", path, "to", local)
            req = requests.get(path, stream=True)
            req.raise_for_status()
            with open(local, 'wb') as f:
                shutil.copyfileobj(req.raw, f)
            print("Download of", local, "complete")
            path = local

        with bz2.open(path, "r") as f:
            parser = etree.iterparse(f, tag="{http://www.mediawiki.org/xml/export-0.10/}page")
            for event, elem in parser:
                page = Page(elem)
                if not page.ignored and page.body and page.title and page.id:
                    index(page, es, index_queue)

        # Index the rest of the queue
        if not index_queue.empty():
            bulk(index_queue, es)

    except Exception as e:
        print("Error while processing path", path, ":", str(e))
        traceback.print_exc(file=sys.stdout)

        # Wait and retry
        time.sleep(10)
        work(path)

    print("Index of", path, "complete")
    os.remove(path)
    return "done"
