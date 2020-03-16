# CLI mode
from ingest import work


def run():
    import sys

    if len(sys.argv) == 1:
        print("Usage:", sys.argv[0], " <path to xml.bz2>")
        exit(1)

    work(sys.argv[1])


if __name__ == '__main__':
    run()
