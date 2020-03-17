import {Component, OnInit} from '@angular/core';
import {SearchService} from "../../services/search.service";
import {ColDef} from "ag-grid-community";
import {SearchResult} from "../../models/search-result.model";
import {of} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  columnDefs: ColDef[] = [
    {headerName: 'Title', field: 'title', width: 400, suppressSizeToFit: true},
    {headerName: 'Score', field: 'score', width: 150, suppressSizeToFit: true},
    {headerName: 'Text', field: 'excerpt', width: 600}
  ];

  rowData: SearchResult[];
  term: string;

  private api: any;

  constructor(private searchService: SearchService) {
  }

  ngOnInit(): void {
  }

  onGridReady($event: any) {
    this.api = $event.api;

    this.rowData = [];
  }

  onInput($event: InputEvent) {
    const target = $event.target as HTMLInputElement;
    const query = target.value.trim();
    if (query.length === 0) {
      this.rowData = [];
    } else {
      this.rowData = null;
    }
    this.term = query;
    if (query.length > 0) {
      of(query).pipe(
        switchMap(query => this.searchService.search(query))
      ).subscribe(results => {
        if (query === this.term) {
          this.rowData = results;
          this.api.sizeColumnsToFit();
        }
      });
    }
  }

  onRowClick($event: any) {
    window.open($event.data.url, "_blank");
  }
}
