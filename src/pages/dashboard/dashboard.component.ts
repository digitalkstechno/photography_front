import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

interface LedgerSummary {
  totalCredit: number;
  totalDebit: number;
  netBalance: number;
}

interface DashboardSummary {
  totalInvoices: number;
  totalPaid: number;
  totalOutstanding: number;
  ledgerSummary: LedgerSummary;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public summary: DashboardSummary = {
    totalInvoices: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    ledgerSummary: {
      totalCredit: 0,
      totalDebit: 0,
      netBalance: 0
    }
  };

  public isLoading = true;
  public error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  async loadSummary(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      const data = await firstValueFrom(
        this.api.get<any>('/dashboard/summary')
      );

      this.summary = this.mapSummary(data);

    } catch (err) {
      console.error(err);
      this.error = 'Failed to load dashboard';
    } finally {
      this.isLoading = false;
    }
  }

  private mapSummary(data: any): DashboardSummary {
    return {
      totalInvoices: data?.totalSaleInvoices ?? 0,
      totalPaid: data?.totalPaid ?? 0,
      totalOutstanding: data?.totalOutstanding ?? 0,
      ledgerSummary: {
        totalCredit: data?.ledger?.totalCredit ?? 0,
        totalDebit: data?.ledger?.totalDebit ?? 0,
        netBalance: data?.ledger?.netBalance ?? 0
      }
    };
  }

  get collectionRate(): number {
    if (!this.summary.totalInvoices || !this.summary.totalPaid) return 0;
    return (this.summary.totalPaid / this.summary.totalInvoices) / 100;
  }

  refresh(): void {
    this.loadSummary();
  }
}
