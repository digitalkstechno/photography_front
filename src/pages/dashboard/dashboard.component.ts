import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public stats = {
    totalEvents: 0,
    confirmedEvents: 0,
    pendingEvents: 0,
    completedEvents: 0,
    totalParties: 0,
    totalQuotations: 0,
    totalInvoices: 0,
    invoicesBilled: 0,
    invoicesPaid: 0,
    invoicesOutstanding: 0,
    paymentsIn: 0,
    paymentsOut: 0,
    netBalance: 0
  };

  public upcomingEvents: any[] = [];
  public isLoading = true;
  public error: string | null = null;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  async loadDashboard(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      const res = await firstValueFrom(this.api.get<any>('/dashboard/summary'));
      const data = res?.data || res || {};

      // Events
      const events = data.events || {};
      this.stats.totalEvents = events.total || 0;
      this.stats.confirmedEvents = events.confirmed || 0;
      this.stats.pendingEvents = events.pending || 0;
      this.stats.completedEvents = events.completed || 0;

      // Parties
      this.stats.totalParties = data.parties || 0;

      // Quotations
      const quotations = data.quotations || {};
      this.stats.totalQuotations = quotations.total || 0;

      // Invoices
      const invoices = data.invoices || {};
      this.stats.totalInvoices = invoices.total || 0;
      this.stats.invoicesBilled = invoices.totalBilled || 0;
      this.stats.invoicesPaid = invoices.totalPaid || 0;
      this.stats.invoicesOutstanding = invoices.outstanding || 0;

      // Payments
      const payments = data.payments || {};
      this.stats.paymentsIn = payments.totalIn || 0;
      this.stats.paymentsOut = payments.totalOut || 0;
      this.stats.netBalance = payments.netBalance || 0;

      // Upcoming events
      this.upcomingEvents = data.upcomingEvents || [];

    } catch (err) {
      console.error(err);
      this.error = 'Failed to load dashboard';
    } finally {
      this.isLoading = false;
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  refresh(): void {
    this.loadDashboard();
  }
}
