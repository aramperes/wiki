import multiprocessing
import sys

import requests

from ingest import work

# BASE_URL = "https://dumps.wikimedia.org/enwiki/"
BASE_URL = "https://dumps.wikimedia.your.org/enwiki/"  # Canadian mirror
POOL_SIZE = 8  # Note: if you use the official WikiMedia mirror, you will get rate-limited past 2 processes

if len(sys.argv) < 2:
    print("Error: Provide a date for the dump, e.g. 20200301.")
    print(f"A list of Wikipedia's dumps can be found at {BASE_URL}")
    exit(1)

dump_date = sys.argv[1]
if dump_date == "latest":
    print("Error: Cannot use 'latest', please specify the date.")
    exit(1)

dump_status_url = f"{BASE_URL}{dump_date}/dumpstatus.json"
dump_status_resp = requests.get(dump_status_url)
if not dump_status_resp.ok:
    print("Error: failed to fetch dump status:", dump_status_resp.status_code)
    exit(1)

dump_status_json = dump_status_resp.json()
dump_status = dump_status_json["jobs"]["articlesdump"]["status"]
if dump_status != "done":
    print("Error: cannot use incomplete dump:", dump_status)
    exit(1)

dump_files = dump_status_json["jobs"]["articlesdump"]["files"].keys()

args = []

for url in dump_files:
    args.append(f"{BASE_URL}{dump_date}/{url}")

with multiprocessing.Pool(10) as pool:
    pool.map(work, args)
