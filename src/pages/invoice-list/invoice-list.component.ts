import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './invoice-list.component.html'
})
export class InvoiceComponent implements OnInit {

  invoices: any[] = [];
  loading = false;
  searchQuery = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 10;

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    this.load();
  }

  async load() {
    this.loading = true;

    try {
      const params: any = {
        page: this.currentPage,
        limit: this.pageSize
      };
      if (this.searchQuery) params.search = this.searchQuery;

      const res: any = await firstValueFrom(
        this.api.get('/invoices', params)
      );

      // Handle different response formats
      const payload = res.data;
      
      if (payload && typeof payload === 'object') {
        if (Array.isArray(payload.data)) {
          // Format: { data: [...], total: 10 } OR { data: [...], pagination: { total: 10 } }
          this.invoices = payload.data;
          this.totalItems = payload.pagination?.total || payload.total || this.invoices.length;
        } else if (Array.isArray(payload)) {
          // Format: { data: [...] }
          this.invoices = payload;
          this.totalItems = payload.length;
        } else {
          this.invoices = [];
          this.totalItems = 0;
        }
      } else if (Array.isArray(res)) {
        // Format: [...] (raw array)
        this.invoices = res;
        this.totalItems = res.length;
      } else {
        this.invoices = [];
        this.totalItems = 0;
      }

      this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;

    } catch (err) {
      console.error('Error loading invoices', err);
    } finally {
      this.loading = false;
    }
  }

  onSearchChange() {
    this.currentPage = 1;
    this.load();
  }

  async delete(id: string) {
    if (!confirm('Delete this invoice?')) return;

    try {
      await firstValueFrom(this.api.delete(`/invoices/${id}`));
      this.load();
    } catch (err) {
      alert('Error deleting invoice');
    }
  }
}
