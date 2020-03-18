import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SearchResult} from "../models/search-result.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {IndexStats} from "../models/index-stats.model";

@Injectable()
export class SearchService {
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = environment.production ? "https://wikipedia-api.momoperes.ca" : "http://localhost:8080";
  }

  search(term: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(this.host + "/search", {params: {"term": term}});
  }

  stats(): Observable<IndexStats> {
    return this.http.get<IndexStats>(this.host + "/stats");
  }
}
