import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() fetchFn!: (params: any) => Promise<any>;

  data: any[] = [];
  total = 0;

  page = 1;
  limit = 10;
  search = '';
  sortBy = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.fetchFn({
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    }).then((res) => {
      this.data = res;
      this.total = res.total;
    });
  }
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search = value;
    this.page = 1;
    this.loadData();
  }

  sort(column: string) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortBy = column;
    this.loadData();
  }

  next() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadData();
    }
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }
}
