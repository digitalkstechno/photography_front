import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  // ✅ OPTIONAL (backward compatible)
  @Input() addRoute?: string;
  @Input() updateRoute?: (row: any) => string;

  data: any[] = [];
  total = 0;

  page = 1;
  limit = 10;
  search = '';
  sortBy = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  private requestId = 0; // 🔒 race-condition guard

  constructor(private router: Router) {}

  ngOnInit() {
    if (!this.fetchFn) {
      throw new Error('TableComponent: fetchFn is required');
    }
    this.loadData();
  }

  loadData() {
    const currentRequest = ++this.requestId;

    this.fetchFn({
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    }).then((res) => {
      if (currentRequest !== this.requestId) return; // ignore stale response

      if (Array.isArray(res)) {
        this.data = res;
        this.total = res.length;
      } else {
        this.data = res.data ?? [];
        this.total = res.total ?? this.data.length;
      }
    });
  }

  getValue(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row) ?? '';
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.page = 1;
    this.loadData();
  }

  sort(column: string) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
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

  // ✅ OPTIONAL ACTIONS
  goToAdd() {
    if (this.addRoute) {
      this.router.navigateByUrl(this.addRoute);
    }
  }

  goToUpdate(row: any) {
    if (this.updateRoute) {
      const route = this.updateRoute(row);
      if (route) {
        this.router.navigateByUrl(route);
      }
    }
  }
}
