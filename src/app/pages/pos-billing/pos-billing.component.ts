import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/http/api.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

interface POSItem {
  serviceId: string;
  name: string;
  qty: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-pos-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-billing.component.html',
  styleUrl: './pos-billing.component.css'
})
export class PosBillingComponent implements OnInit {
  
  // Search & Catalog
  searchQuery = '';
  services: any[] = [];
  filteredServices: any[] = [];
  
  // Cart
  items: POSItem[] = [];
  
  // Customer & Payment
  parties: any[] = [];
  selectedParty: any = null;
  accounts: any[] = [];
  selectedAccount: any = null;
  
  // Stats
  subTotal = 0;
  taxPercent = 18; // Default 18% GST
  taxAmount = 0;
  discount = 0;
  grandTotal = 0;

  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const [servicesRes, partiesRes, accountsRes] = await Promise.all([
        firstValueFrom(this.api.get('/services')),
        firstValueFrom(this.api.get('/party')),
        firstValueFrom(this.api.get('/accounts'))
      ]) as [any, any, any];

      this.services = servicesRes.data || servicesRes;
      this.parties = partiesRes.data || partiesRes;
      this.accounts = accountsRes.data || accountsRes;

      // Default to Cash Sale if exists
      this.selectedParty = this.parties.find((p: any) => p.name.toLowerCase().includes('cash sale')) || this.parties[0];
      this.selectedAccount = this.accounts.find((a: any) => a.type === 'CASH') || this.accounts[0];
    } catch (err) {
      console.error('Failed to load POS data', err);
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredServices = [];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredServices = this.services.filter(s => 
      s.name.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)
    ).slice(0, 5);
  }

  addItem(service: any) {
    const existing = this.items.find(i => i.serviceId === service._id);
    if (existing) {
      existing.qty++;
      existing.total = existing.qty * existing.price;
    } else {
      this.items.push({
        serviceId: service._id,
        name: service.name,
        qty: 1,
        price: service.price || 0,
        total: service.price || 0
      });
    }
    this.searchQuery = '';
    this.filteredServices = [];
    this.calculateTotals();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subTotal = this.items.reduce((sum, i) => sum + i.total, 0);
    this.taxAmount = (this.subTotal * this.taxPercent) / 100;
    this.grandTotal = (this.subTotal + this.taxAmount) - this.discount;
  }

  async saveAndPrint() {
    if (this.items.length === 0) {
      alert('Add at least one item');
      return;
    }
    if (!this.selectedAccount) {
      alert('Select a payment account');
      return;
    }

    this.loading = true;
    try {
      const invoiceData = {
        customer: this.selectedParty._id,
        items: this.items.map(i => ({
          service: i.serviceId,
          description: i.name,
          days: 1,
          quotedPrice: i.price,
          qty: i.qty
        })),
        taxPercent: this.taxPercent,
        discount: this.discount,
        status: 'PAID',
        paidAmount: this.grandTotal,
        paymentAccount: this.selectedAccount._id
      };

      const res: any = await firstValueFrom(this.api.post('/invoices', invoiceData));
      
      // Navigate to receipt or trigger print
      this.router.navigate(['/admin/invoices', res._id]);
    } catch (err) {
      alert('Failed to save invoice');
    } finally {
      this.loading = false;
    }
  }
}
