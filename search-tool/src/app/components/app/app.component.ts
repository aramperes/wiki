import {Component, OnInit} from '@angular/core';
import {SearchService} from "../../services/search.service";
import {ColDef, GridApi} from "ag-grid-community";
import {SearchResult} from "../../models/search-result.model";
import {of} from "rxjs";
import {delay, filter, flatMap} from "rxjs/operators";

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
  loading: boolean;

  private api: GridApi;

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
      this.loading = false;
    } else {
      this.rowData = null;
    }
    this.term = query;
    if (query.length > 0) {
      this.loading = true;
      of(query).pipe(
        delay(100),
        filter(q => this.term === q),
        flatMap(query => this.searchService.search(query))
      ).subscribe(results => {
        if (query === this.term) {
          this.rowData = results;
          this.loading = false;
          this.api.sizeColumnsToFit();
        }
      });
    }
  }

  onRowClick($event: any) {
    window.open($event.data.url, "_blank");
  }
}
