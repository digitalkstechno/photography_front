import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/http/api.service';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {

  invoice: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInvoice(id);
    }
  }

  async loadInvoice(id: string) {
    this.loading = true;
    try {
      const res: any = await firstValueFrom(
        this.api.get(`/invoices/${id}`)
      );
      this.invoice = res.data;
    } catch (err) {
      console.error('Error loading invoice', err);
    } finally {
      this.loading = false;
    }
  }

  print() {
    window.print();
  }
}
