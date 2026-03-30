import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/http/api.service';

@Component({
  selector: 'app-job-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-receipt.component.html',
  styleUrls: ['./job-receipt.component.css']
})
export class JobReceiptComponent implements OnInit {

  job: any = null;
  invoice: any = null;
  loading = false;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  get receiptNo(): string {
    return this.job ? ('JOB-' + (this.job._id || '').slice(-6).toUpperCase()) : '';
  }

  get booking() { return this.job?.event || {}; }
  get customer() { return this.booking?.customer || {}; }
  get assignedTeam(): any[] { return this.job?.assignedUsers || []; }
  get invoiceItems(): any[] { return this.invoice?.items || []; }

  get balanceDue(): number {
    if (!this.invoice) return 0;
    return Math.max(0, (this.invoice.grandTotal || 0) - (this.invoice.paidAmount || 0));
  }

  getItemRate(item: any): number {
    return item.fixedPrice ?? item.quotedPrice ?? item.pricePerDay ?? 0;
  }

  getMemberName(m: any): string {
    return m.user?.name || m.freelancer?.name || 'Unknown';
  }

  getMemberType(m: any): string {
    return m.user ? 'Staff' : 'Freelancer';
  }

  normalizeInvoice(raw: any) {
    return {
      ...raw,
      subtotal: raw.totalAmount || 0,
      discount: raw.discountAmount || 0,
      extraCharges: raw.extraCharges || 0,
      tax: raw.taxAmount || 0,
      taxRate: raw.taxPercent || 0,
      grandTotal: raw.grandTotal || 0,
      paidAmount: raw.paidAmount || 0,
      dueAmount: raw.dueAmount || 0,
      items: (raw.items || []).map((item: any, i: number) => ({
        ...item,
        description: item.description || item.name || item.service?.name || `Service ${i + 1}`,
        rate: item.pricePerDay || item.fixedPrice || item.quotedPrice || 0,
        days: item.days || 1,
        total: item.total || 0
      }))
    };
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) await this.loadJob(id);
  }

  async loadJob(id: string) {
    this.loading = true;

    try {
      const res: any = await firstValueFrom(this.api.get(`/jobs/${id}`));
      this.job = res.data || res;

      const invoiceId = this.booking?.invoice?._id || this.booking?.invoice;

      if (invoiceId) {
        try {
          const invRes: any = await firstValueFrom(this.api.get(`/invoices/${invoiceId}`));
          const raw = invRes.data || invRes;
          this.invoice = this.normalizeInvoice(raw);
        } catch (err) {
          console.error('Error loading invoice', err);
          this.invoice = null;
        }
      }

    } catch (err) {
      console.error('Error loading job receipt', err);
    } finally {
      this.loading = false;
    }
  }

  print() {
    window.print();
  }
}