import multiprocessing

from ingest import work

args = []

with open("sources.txt") as f:
    for url in f.read().splitlines():
        if url:
            args.append(url)

with multiprocessing.Pool(2) as pool:
    pool.map(work, args)
