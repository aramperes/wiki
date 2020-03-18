# momothereal/wiki

This is a small side-project to index the entirety of Wikipedia in ElasticSearch, and to search it in a web page.

Temporarily hosted on: https://wikipedia.momoperes.ca (using a free-trial of Elastic Cloud, so it will stop working by April 2020).

## Structure

* **api**: A Spring Boot REST service to query ElasticSearch
* **ingest**: A multiprocessing Python app to download and index a dump of English Wikipedia
* **search-tool**: An Angular 9 Material web app to search the index using the REST API

## Getting Started

* Dependencies
  * Maven 3.x, JDK 11+
  * Python 3.7+
  * Pipenv
  * Node.js 12+ and Yarn

* Ingest some documents. In the `ingest` directory:
  * Create a file named `.env` and add the following config:
    ```
    ES_HOST=http://my-elasticsearch-instance:9243
    ES_USER=elastic
    ES_PASS=*******
    ```
  * Run `pipenv install`
  * Make a directory named `dumps`
  * Look in the `master.py` file. Adjust the `BASE_URL` and `POOL_SIZE` for a better mirror depending on your location, and CPU count
  * Find a suitable dump date on https://dumps.wikimedia.org/enwiki/, e.g. 20200301
  * Start ingesting with `pipenv run python master.py 20200301`

* Run the API. In the `api` directory:
  * Set your terminal's environment variables like in the .env file above
  * Run `mvn spring-boot:run`

* Run the front-end app. In the `search-tool` directory:
  * Run `yarn`
  * Run `yarn start`
  * Open `http://localhost:4200`. You should be able to search for stuff.

## Using Docker

* Run `docker-compose pull`
* Run `docker-compose up -d`
* Open `http://localhost:8081`. Note that the API may take a few minutes to start up, as the image first compiles the program.
