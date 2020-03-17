import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SearchResult} from "../models/search-result.model";
import {Observable} from "rxjs";

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {
  }

  search(term: string): Observable<SearchResult[]> {
    const host = location.protocol + "//" + location.hostname + ":8080";
    return this.http.get<SearchResult[]>(host + "/search", {params: {"term": term}});
  }
}
