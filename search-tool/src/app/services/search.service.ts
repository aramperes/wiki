import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SearchResult} from "../models/search-result.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {
  }

  search(term: string): Observable<SearchResult[]> {
    const host = environment.production ? "https://wikipedia-api.momoperes.ca" : "http://localhost:8080";
    return this.http.get<SearchResult[]>(host + "/search", {params: {"term": term}});
  }
}
