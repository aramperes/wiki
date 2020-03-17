import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SearchResult} from "../models/search-result.model";
import {Observable} from "rxjs";

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {
  }

  search(term: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>("http://localhost:8080/search", {params: {"term": term}});
  }
}
