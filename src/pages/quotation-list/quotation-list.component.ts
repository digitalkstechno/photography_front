import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  // Re-expose Date for Template
  Date = Date;

  private apiUrl = `${environment.apiUrl}/quotations`;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchQuotations();
  }

  fetchQuotations(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.limit
    };
    if (this.searchQuery) params.search = this.searchQuery;

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (res) => {
        // Handle paginated response structure
        const result = res.data?.data || res.data || [];
        this.quotations = Array.isArray(result) ? result : [];
        
        // Update pagination meta if available
        if (res.data?.pagination) {
          this.totalPages = res.data.pagination.pages;
          this.totalItems = res.data.pagination.total;
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

  printPdf(id: string): void {
    window.open(`${this.apiUrl}/${id}/pdf`, '_blank');
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
