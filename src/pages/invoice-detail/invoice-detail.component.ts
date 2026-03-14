import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/http/api.service';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent implements OnInit {
  loading = true;
  error = '';
  invoice: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid invoice.';
      this.loading = false;
      return;
    }

    try {
      this.invoice = await this.api.get<any>(`/transactions/${id}`).toPromise();
    } catch {
      this.error = 'Unable to load invoice.';
    } finally {
      this.loading = false;
    }
  }

  get totalPaid(): number {
    if (!this.invoice?.payments) return 0;
    return this.invoice.payments.reduce(
      (acc: number, p: any) => acc + (p.amount || 0),
      0
    );
  }

  get balance(): number {
    const total = this.invoice?.total || 0;
    return total - this.totalPaid;
  }

  addPayment() {
    if (!this.invoice?.id) return;
    this.router.navigate(['/admin/payment/new'], {
      queryParams: { transactionId: this.invoice.id },
    });
  }
}

