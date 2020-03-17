# momothereal/wiki

This is a small side-project to index the entirety of Wikipedia in ElasticSearch, and to search it in a web page.

## Structure

* **api**: A Spring Boot REST service to query ElasticSearch
* **ingest**: A multiprocessing Python app to download and index a dump of English Wikipedia
* **search-tool**: An Angular 9 Material web app to search the index using the REST API
