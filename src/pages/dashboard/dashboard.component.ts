import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  totalInvoices = 0;
  totalPaid = 0;
  totalOutstanding = 0;

  totalIncome = 0;
  totalExpenses = 0;
  netBalance = 0;

  loading = true;

  constructor(private api: ApiService) {
    this.loadSummary();
  }

  async loadSummary() {
    try {
      const summary = await firstValueFrom(
        this.api.get<any>('/dashboard/summary')
      );

      this.totalInvoices = summary.totalSaleInvoices ?? 0;
      this.totalPaid = summary.totalPaid ?? 0;
      this.totalOutstanding = summary.totalOutstanding ?? 0;

      if (summary.ledger) {
        this.totalIncome = summary.ledger.totalIncome ?? 0;
        this.totalExpenses = summary.ledger.totalExpenses ?? 0;
        this.netBalance = summary.ledger.netBalance ?? 0;
      }

    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      this.loading = false;
    }
  }
}
