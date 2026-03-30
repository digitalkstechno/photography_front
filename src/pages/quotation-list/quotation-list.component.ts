import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { EntityConfig } from '../../core/entity/entity.types';
import { getEntityConfig } from '../../core/entity/entities';
import { FilterPanelComponent } from '../../shared/filter-panel/filter-panel.component';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterPanelComponent],
  templateUrl: './quotation-list.component.html'
})
export class QuotationListComponent implements OnInit {
  quotations: any[] = [];
  loading = false;
  searchQuery = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  limit = 10;
  
  // Advanced Filtering
  isFilterOpen = false;
  activeFilters: any = {};
  entity?: EntityConfig;

  // Re-expose Date for Template
  Date = Date;

  private apiUrl = `${environment.apiUrl}/quotations`;

  constructor(private http: HttpClient, private router: Router) {
    this.entity = getEntityConfig('quotations') || undefined;
  }

  ngOnInit(): void {
    this.fetchQuotations();
  }

  fetchQuotations(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.limit,
      ...this.activeFilters
    };
    if (this.searchQuery) params.search = this.searchQuery;

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (res) => {
        // API returns { success, data: { data: [...], total, page, limit } }
        const payload = res.data;
        if (payload && Array.isArray(payload.data)) {
          this.quotations = payload.data;
          this.totalItems = payload.total || 0;
          this.totalPages = Math.ceil(this.totalItems / this.limit) || 1;
        } else if (Array.isArray(payload)) {
          this.quotations = payload;
          this.totalPages = 1;
        } else {
          this.quotations = [];
          this.totalPages = 1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching quotations:', err);
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.fetchQuotations();
  }

  onToggleFilters(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onFilterChange(filters: any): void {
    this.activeFilters = filters;
    this.currentPage = 1;
    this.fetchQuotations();
  }

  deleteQuotation(id: string): void {
    if (!confirm('Are you sure you want to delete this quotation? This cannot be undone.')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.quotations = this.quotations.filter(q => q._id !== id);
      },
      error: (err) => {
        alert(err.error?.message || 'Error deleting quotation');
      }
    });
  }

  async printPdf(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${this.apiUrl}/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) { alert('PDF generation failed'); return; }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `Quotation_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      alert('Error generating PDF');
    }
  }

  convertToInvoice(id: string): void {
    if (!confirm('Convert this quotation to a professional Invoice?')) return;

    this.http.post(`${this.apiUrl}/${id}/convert`, {}).subscribe({
      next: (res: any) => {
        alert('Successfully converted to Invoice!');
        if (res.data?._id) {
          this.router.navigate(['/admin/invoices/edit', res.data._id]);
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Error converting to invoice');
      }
    });
  }
}
