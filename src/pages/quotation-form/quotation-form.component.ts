import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/http/api.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * SMART QUOTATION FORM
 * Matches the UI from screenshot: left/right 2-column layout using existing style system.
 * Services & Packages show as chips; auto-populates Quotation Items table.
 */
@Component({
  selector: 'app-quotation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './quotation-form.component.html'
})
export class QuotationFormComponent implements OnInit {
  quotationForm: FormGroup;
  loading = false;
  isEditMode = false;
  quotationId: string | null = null;

  // Master Data
  customers: any[] = [];
  services: any[] = [];
  packages: any[] = [];

  // Chip tracking: selected service/package IDs shown as chips
  selectedServiceIds: string[] = [];
  selectedPackageIds: string[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.quotationForm = this.fb.group({
      quotationNumber: [{ value: '', disabled: true }],
      customer: ['', Validators.required],
      status: ['DRAFT'],
      items: this.fb.array([]),
      discount: [0],
      discountType: ['flat'],
      taxPercent: [18],
      validUntil: [''],
      notes: [''],
      terms: [''],
      subtotal: [{ value: 0, disabled: true }],
      discountAmount: [{ value: 0, disabled: true }],
      taxAmount: [{ value: 0, disabled: true }],
      totalAmount: [{ value: 0, disabled: true }],
      finalAmount: [{ value: 0, disabled: true }],
      grandTotal: [{ value: 0, disabled: true }]
    });
  }

  get items(): FormArray {
    return this.quotationForm.get('items') as FormArray;
  }

  get selectedServices(): any[] {
    return this.selectedServiceIds
      .map(id => this.services.find(s => s._id === id))
      .filter(Boolean);
  }

  get selectedPackages(): any[] {
    return this.selectedPackageIds
      .map(id => this.packages.find(p => p._id === id))
      .filter(Boolean);
  }

  async ngOnInit() {
    this.loading = true;
    await Promise.all([
      this.fetchCustomers(),
      this.fetchServices(),
      this.fetchPackages()
    ]);

    this.quotationId = this.route.snapshot.paramMap.get('id');
    if (this.quotationId) {
      this.isEditMode = true;
      await this.loadQuotation(this.quotationId);
    }

    // Live recalculation on every change
    this.quotationForm.valueChanges.subscribe(() => this.calculateTotals());

    this.loading = false;
  }

  // ── DATA FETCHING ───────────────────────────────────────────────

  async fetchCustomers() {
    try {
      // Use the specific customers endpoint which returns a flat array in data
      const res: any = await firstValueFrom(this.api.get('/parties/customers'));
      this.customers = res.data || [];
    } catch { this.customers = []; }
  }

  async fetchServices() {
    try {
      const res: any = await firstValueFrom(this.api.get('/services'));
      // Generic unwrap: handles both {success, data:[...]} and {success, data:{data:[...]}}
      const all = res.data?.data || res.data || res || [];
      this.services = Array.isArray(all) ? all : [];
    } catch { this.services = []; }
  }

  async fetchPackages() {
    try {
      const res: any = await firstValueFrom(this.api.get('/packages'));
      const all = res.data?.data || res.data || res || [];
      this.packages = Array.isArray(all) ? all : [];
    } catch { this.packages = []; }
  }

  async loadQuotation(id: string) {
    const res: any = await firstValueFrom(this.api.get(`/quotations/${id}`));
    const data = res.data || res;

    // 1. PATCH FORM
    this.quotationForm.patchValue({
      quotationNumber: data.quotationNumber || '',
      customer: data.customer?._id || data.customer,
      status: data.status,
      discount: data.discount,
      discountType: data.discountType || 'flat',
      taxPercent: data.taxPercent,
      validUntil: data.validUntil ? data.validUntil.substring(0, 10) : '',
      notes: data.notes,
      terms: data.terms
    });

    // 2. RESET ITEMS
    this.items.clear();

    // 3. RESET CHIPS (IMPORTANT)
    this.selectedServiceIds = [];
    this.selectedPackageIds = [];

    // 4. ADD ITEMS + SYNC CHIPS
    if (data.items?.length) {
      data.items.forEach((item: any) => {

        const serviceId = item.service?._id || item.service;

        // 👉 sync service chips
        if (item.source === 'Individual' && serviceId) {
          if (!this.selectedServiceIds.includes(serviceId)) {
            this.selectedServiceIds.push(serviceId);
          }
        }

        // 👉 sync package chips
        if (item.source === 'Package' && item.packageId) {
          if (!this.selectedPackageIds.includes(item.packageId)) {
            this.selectedPackageIds.push(item.packageId);
          }
        }

        this.addItem({
          source: item.source || 'Individual',
          service: serviceId,
          packageId: item.packageId || null,
          name: item.service?.name || item.name || '',
          days: item.days || 1,
          pricePerDay: item.pricePerDay || null,
          fixedPrice: item.fixedPrice || null,
          quotedPrice: item.quotedPrice || null,
          total: item.total || 0
        }, false);

      });
    }

    // 5. FORCE CALCULATION (CRITICAL)
    setTimeout(() => {
      this.calculateTotals();
    }, 0);
  }

  // ── CHIP MANAGEMENT ─────────────────────────────────────────────

  onServiceSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    select.value = '';
    if (!id || this.selectedServiceIds.includes(id)) return;
    this.selectedServiceIds.push(id);
    this.addServiceToItems(id);
  }

  onPackageSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    select.value = '';
    if (!id || this.selectedPackageIds.includes(id)) return;
    this.selectedPackageIds.push(id);
    this.addPackageToItems(id);
  }

  removeServiceChip(id: string) {
    this.selectedServiceIds = this.selectedServiceIds.filter(s => s !== id);
    // Remove matching rows from items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items.at(i);
      if (item.get('source')?.value === 'Individual' && item.get('service')?.value === id) {
        this.items.removeAt(i);
      }
    }
    this.calculateTotals();
  }

  removePackageChip(id: string) {
    const pkg = this.packages.find(p => p._id === id);
    this.selectedPackageIds = this.selectedPackageIds.filter(p => p !== id);
    // Remove matching rows
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items.at(i);
      if (item.get('source')?.value === 'Package' && item.get('packageId')?.value === id) {
        this.items.removeAt(i);
      }
    }
    this.calculateTotals();
  }

  // ── LINE ITEM ACTIONS ────────────────────────────────────────────

  addServiceToItems(serviceId: string) {
    const service = this.services.find(s => s._id === serviceId);
    if (!service) return;
    this.addItem({
      source: 'Individual',
      service: service._id,
      packageId: null,
      name: service.name,
      days: 1,
      pricePerDay: service.pricePerDay,
      fixedPrice: null,
      quotedPrice: null,
      total: service.pricePerDay
    });
  }

  addPackageToItems(packageId: string) {
    const pkg = this.packages.find(p => p._id === packageId);
    if (!pkg) return;

    // Expand included services
    if (pkg.includedServices?.length) {
      pkg.includedServices.forEach((sObj: any) => {
        const sId = sObj._id || sObj;
        const service = this.services.find(s => s._id === sId);
        if (service) {
          this.addItem({
            source: 'Package',
            service: service._id,
            packageId: pkg._id,
            name: service.name,
            days: 1,
            pricePerDay: service.pricePerDay,
            fixedPrice: null,
            quotedPrice: null,
            total: service.pricePerDay
          });
        }
      });
    }

    // Expand custom items inside package
    if (pkg.customItems?.length) {
      pkg.customItems.forEach((ci: any) => {
        this.addItem({
          source: 'Package',
          service: null,
          packageId: pkg._id,
          name: ci.name,
          days: 1,
          pricePerDay: null,
          fixedPrice: ci.price,
          quotedPrice: null,
          total: ci.price
        });
      });
    }
  }

  addCustomItem() {
    this.addItem({
      source: 'Custom',
      service: null,
      packageId: null,
      name: '',
      days: 1,
      pricePerDay: null,
      fixedPrice: 0,
      quotedPrice: null,
      total: 0
    });
  }

  private addItem(data: any, emit = true) {
    const group = this.fb.group({
      source: [data.source || 'Individual'],
      service: [data.service],
      packageId: [data.packageId],
      name: [data.name, Validators.required],
      days: [data.days || 1, [Validators.required, Validators.min(1)]],
      pricePerDay: [data.pricePerDay],
      fixedPrice: [data.fixedPrice],
      quotedPrice: [data.quotedPrice],
      total: [{ value: data.total || 0, disabled: true }]
    });
    this.items.push(group, { emitEvent: emit });
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  // ── CALCULATIONS ─────────────────────────────────────────────────

  calculateTotals() {
    let subtotal = 0;

    this.items.controls.forEach((ctrl: any) => {
      const g = ctrl.controls;
      const days = parseFloat(g.days.value) || 1;
      const pricePerDay = parseFloat(g.pricePerDay.value);
      const fixedPrice = parseFloat(g.fixedPrice.value);
      const quotedPrice = parseFloat(g.quotedPrice.value);

      let itemTotal = 0;
      if (!isNaN(quotedPrice)) {
        itemTotal = quotedPrice;
      } else if (!isNaN(pricePerDay)) {
        itemTotal = days * pricePerDay;
      } else if (!isNaN(fixedPrice)) {
        itemTotal = fixedPrice;
      }

      g.total.setValue(itemTotal, { emitEvent: false });
      subtotal += itemTotal;
    });

    const discount = parseFloat(this.quotationForm.get('discount')?.value) || 0;
    const discountType = this.quotationForm.get('discountType')?.value;
    const taxPercent = parseFloat(this.quotationForm.get('taxPercent')?.value) || 0;

    let discountAmount = discountType === 'percent'
      ? subtotal * (discount / 100)
      : discount;

    if (discountAmount > subtotal) discountAmount = subtotal;
    if (discountAmount < 0) discountAmount = 0;

    const finalAmount = subtotal - discountAmount;
    const taxAmount = (finalAmount * taxPercent) / 100;
    const grandTotal = finalAmount + taxAmount;

    this.quotationForm.patchValue({
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount: subtotal,
      finalAmount,
      grandTotal
    }, { emitEvent: false });
  }

  // ── SAVE ─────────────────────────────────────────────────────────

  async save() {
    if (this.quotationForm.get('customer')?.invalid) {
      alert('Please select a customer.');
      return;
    }

    const raw = this.quotationForm.getRawValue();
    const payload = {
      customer: raw.customer,
      status: raw.status,
      discount: raw.discount,
      discountType: raw.discountType,
      taxPercent: raw.taxPercent,
      validUntil: raw.validUntil || undefined,
      notes: raw.notes,
      terms: raw.terms,
      items: raw.items.map((it: any) => ({
        source: it.source,
        service: it.service || undefined,
        name: it.name,
        days: it.days,
        pricePerDay: it.pricePerDay,
        fixedPrice: it.fixedPrice,
        quotedPrice: it.quotedPrice,
        total: it.total
      }))
    };

    try {
      this.loading = true;
      if (this.isEditMode) {
        await firstValueFrom(this.api.put(`/quotations/${this.quotationId}`, payload));
      } else {
        await firstValueFrom(this.api.post('/quotations', payload));
      }
      this.router.navigate(['/admin/quotations']);
    } catch (err: any) {
      alert('Error saving: ' + (err?.error?.message || 'Unknown error'));
    } finally {
      this.loading = false;
    }
  }

  // ── WORKFLOW ACTIONS ───────────────────────────────────────────

  async printPdf() {
    if (!this.quotationId) return;

    const token = localStorage.getItem('token');

    const res = await fetch(
      `${environment.apiUrl}/quotations/${this.quotationId}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `QT_${this.quotationForm.get('quotationNumber')?.value || this.quotationId}.pdf`; 
    document.body.appendChild(a);
    a.click();

    // cleanup
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  }

  async changeStatus(newStatus: string) {
    if (!this.quotationId) return;
    const labels: Record<string, string> = { SENT: 'Mark as Sent', ACCEPTED: 'Mark as Accepted' };
    if (!confirm(`${labels[newStatus] || newStatus}? This action follows the workflow order.`)) return;

    try {
      this.loading = true;
      await firstValueFrom(this.api.put(`/quotations/${this.quotationId}`, { status: newStatus }));
      this.quotationForm.patchValue({ status: newStatus }, { emitEvent: false });
    } catch (err: any) {
      alert('Error: ' + (err?.error?.message || 'Unknown error'));
    } finally {
      this.loading = false;
    }
  }

  async convertToInvoice() {
    if (!this.quotationId) return;
    if (!confirm('Convert this quotation to a professional Invoice?')) return;

    try {
      this.loading = true;
      const res: any = await firstValueFrom(this.api.post(`/quotations/${this.quotationId}/convert`, {}));
      alert('Successfully converted to Invoice!');
      if (res.data?._id) {
        this.router.navigate(['/admin/invoices/edit', res.data._id]);
      } else {
        this.router.navigate(['/admin/invoices']);
      }
    } catch (err: any) {
      alert('Error converting: ' + (err?.error?.message || 'Unknown error'));
    } finally {
      this.loading = false;
    }
  }
}
