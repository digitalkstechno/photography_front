import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EntityColumn, EntityTableFilter } from '../../core/entity/entity.types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns: EntityColumn[] = [];
  @Input() filters?: EntityTableFilter[] = [];
  @Input() fetchFn!: (params: any) => Promise<any>;
  @Input() reloadTrigger?: any;

  // ✅ OPTIONAL (backward compatible)
  @Input() addRoute?: string;
  @Input() updateRoute?: (row: any) => string;
  @Input() rowActions?: any[];

  data: any[] = [];
  total = 0;

  page = 1;
  limit = 10;
  search = '';
  sortBy = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  activeFilters: Record<string, any> = {};

  private requestId = 0; // 🔒 race-condition guard

  constructor(private router: Router) { }

  ngOnInit() {
    if (!this.fetchFn) {
      throw new Error('TableComponent: fetchFn is required');
    }
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reloadTrigger'] && !changes['reloadTrigger'].isFirstChange()) {
      this.page = 1;
      this.search = '';
      this.sortBy = '';
      this.sortOrder = 'asc';
      this.loadData();
    }
  }

  loadData() {
    const currentRequest = ++this.requestId;

    this.fetchFn({
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      ...this.activeFilters
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
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }

  displayValue(row: any, col: any): any {
    if (col.render) {
      return col.render(row);
    }
    const val = this.getValue(row, col.key);
    if (val === undefined || val === null) return '';

    if (col.format === 'date') {
      return new Date(val).toLocaleDateString();
    }
    if (col.format === 'currency') {
      return '₹ ' + Number(val).toLocaleString();
    }
    if (col.format === 'boolean') {
        return val ? 'Yes' : 'No';
    }
    return val;
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.page = 1;
    this.loadData();
  }

  onLimitChange() {
    this.page = 1;
    this.loadData();
  }

  onFilterChange() {
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

  handleAction(action: any, row: any) {
    if (action.onClick) {
      // Pass reload function as 3rd parameter
      action.onClick(row, this.router, () => this.loadData());
    }
  }

  isActionVisible(action: any, row: any): boolean {
    return action.isVisible ? action.isVisible(row) : true;
  }
}
