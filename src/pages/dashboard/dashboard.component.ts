import { Component } from '@angular/core';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  upcomingEvents = 0;
  pendingQuotes = 0;
  outstandingBalance = 0;

  constructor(private api: ApiService) {
    this.loadSummary();
  }

  async loadSummary() {
    try {

      const clients = await firstValueFrom(this.api.get<any[]>('clients'));
      this.upcomingEvents = clients?.length || 0;

      const quotes = await firstValueFrom(this.api.get<any[]>('quotes'));
      this.pendingQuotes = quotes?.length || 0;

      const invoices = await firstValueFrom(this.api.get<any[]>('invoices'));

      this.outstandingBalance = (invoices || []).reduce((acc, inv: any) => {
        const paid = (inv.payments || []).reduce(
          (pAcc: number, p: any) => pAcc + (p.amount || 0),
          0
        );

        return acc + Math.max((inv.total || 0) - paid, 0);

      }, 0);

    } catch (err) {
      console.error(err);
    }
  }
}
