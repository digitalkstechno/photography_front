import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/http/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './invoiceform.component.html'
})
export class InvoiceFormComponent implements OnInit {

  invoiceForm: FormGroup;
  isEditMode = false;
  invoiceId: string | null = null;
  loading = false;

  // Master Data
  customers: any[] = [];
  services: any[] = [];
  packages: any[] = [];

  // Chip tracking
  selectedServiceIds: string[] = [];
  selectedPackageIds: string[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.invoiceForm = this.fb.group({
      invoiceNumber: [{ value: '', disabled: true }],
      customer: ['', Validators.required],
      status: ['PENDING'],
      items: this.fb.array([]),
      
      discount: [0],
      discountType: ['flat'],
      taxPercent: [18],
      extraCharges: [0],
      paidAmount: [0],
      dueDate: [''],
      notes: [''],

      // UI Only
      subtotal: [{ value: 0, disabled: true }],
      discountAmount: [{ value: 0, disabled: true }],
      taxAmount: [{ value: 0, disabled: true }],
      grandTotal: [{ value: 0, disabled: true }],
      dueAmount: [{ value: 0, disabled: true }]
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
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

    this.invoiceId = this.route.snapshot.paramMap.get('id');

    if (this.invoiceId) {
      this.isEditMode = true;
      await this.loadInvoice(this.invoiceId);
    } else {
      // Direct invoice - start with empty items or one row
      // this.addCustomItem(); 
    }

    this.invoiceForm.valueChanges.subscribe(() => this.calculateTotals());
    this.loading = false;
  }

  // ── DATA FETCHING ───────────────────────────────────────────────

  async fetchCustomers() {
    try {
      const res: any = await firstValueFrom(this.api.get('/parties/customers'));
      this.customers = res.data || [];
    } catch { this.customers = []; }
  }

  async fetchServices() {
    try {
      const res: any = await firstValueFrom(this.api.get('/services'));
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

  async loadInvoice(id: string) {
    try {
      const res: any = await firstValueFrom(this.api.get(`/invoices/${id}`));
      const data = res.data || res;

      this.invoiceForm.patchValue({
        invoiceNumber: data.invoiceNumber || '',
        customer: data.customer?._id || data.customer,
        status: data.status,
        discount: data.discount,
        discountType: data.discountType || 'flat',
        taxPercent: data.taxPercent,
        extraCharges: data.extraCharges || 0,
        paidAmount: data.paidAmount || 0,
        dueDate: data.dueDate ? data.dueDate.substring(0, 10) : '',
        notes: data.notes
      });

      this.items.clear();
      if (data.items?.length) {
        data.items.forEach((item: any) => {
          this.addItem({
            name: item.name || item.description || '',
            service: item.service?._id || item.service,
            days: item.days || 1,
            pricePerDay: item.pricePerDay || null,
            quotedPrice: item.quotedPrice || null,
            total: item.total || 0
          }, false);
        });
      }

      setTimeout(() => this.calculateTotals(), 0);
    } catch (err) {
      console.error('Error loading invoice', err);
    }
  }

  // ── CHIP MANAGEMENT ─────────────────────────────────────────────

  onServiceSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    select.value = '';
    if (!id || this.selectedServiceIds.includes(id)) return;
    
    const service = this.services.find(s => s._id === id);
    if (!service) return;

    this.selectedServiceIds.push(id);
    this.addItem({
      name: service.name,
      service: service._id,
      days: 1,
      pricePerDay: service.pricePerDay,
      total: service.pricePerDay
    });
  }

  onPackageSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    select.value = '';
    if (!id || this.selectedPackageIds.includes(id)) return;

    const pkg = this.packages.find(p => p._id === id);
    if (!pkg) return;

    this.selectedPackageIds.push(id);
    
    // Expand services
    if (pkg.includedServices?.length) {
      pkg.includedServices.forEach((s: any) => {
        const service = this.services.find(srv => srv._id === (s._id || s));
        if (service) {
          this.addItem({
            name: service.name,
            service: service._id,
            days: 1,
            pricePerDay: service.pricePerDay,
            total: service.pricePerDay
          });
        }
      });
    }

    // Expand custom items
    if (pkg.customItems?.length) {
      pkg.customItems.forEach((ci: any) => {
        this.addItem({
          name: ci.name,
          service: null,
          days: 1,
          pricePerDay: null,
          quotedPrice: ci.price,
          total: ci.price
        });
      });
    }
  }

  removeServiceChip(id: string) {
    this.selectedServiceIds = this.selectedServiceIds.filter(s => s !== id);
    // Note: We don't auto-remove items here to give user control, 
    // but we could if needed for perfect sync.
  }

  removePackageChip(id: string) {
    this.selectedPackageIds = this.selectedPackageIds.filter(p => p !== id);
  }

  // ── LINE ITEM ACTIONS ────────────────────────────────────────────

  addCustomItem() {
    this.addItem({
      name: '',
      service: null,
      days: 1,
      pricePerDay: null,
      quotedPrice: 0,
      total: 0
    });
  }

  private addItem(data: any, emit = true) {
    const group = this.fb.group({
      name: [data.name, Validators.required],
      service: [data.service],
      days: [data.days || 1, [Validators.required, Validators.min(1)]],
      pricePerDay: [data.pricePerDay],
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
      const quotedPrice = parseFloat(g.quotedPrice.value);

      let itemTotal = 0;
      if (!isNaN(quotedPrice) && g.quotedPrice.value !== null && g.quotedPrice.value !== '') {
        itemTotal = quotedPrice;
      } else if (!isNaN(pricePerDay)) {
        itemTotal = days * pricePerDay;
      }

      g.total.setValue(itemTotal, { emitEvent: false });
      subtotal += itemTotal;
    });

    const discount = parseFloat(this.invoiceForm.get('discount')?.value) || 0;
    const discountType = this.invoiceForm.get('discountType')?.value;
    const taxPercent = parseFloat(this.invoiceForm.get('taxPercent')?.value) || 0;
    const extraCharges = parseFloat(this.invoiceForm.get('extraCharges')?.value) || 0;
    const paidAmount = parseFloat(this.invoiceForm.get('paidAmount')?.value) || 0;

    let discountAmount = discountType === 'percent'
      ? subtotal * (discount / 100)
      : discount;

    if (discountAmount > subtotal) discountAmount = subtotal;

    const finalAmount = subtotal - discountAmount + extraCharges;
    const taxAmount = (finalAmount * taxPercent) / 100;
    const grandTotal = finalAmount + taxAmount;
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    this.invoiceForm.patchValue({
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
      dueAmount
    }, { emitEvent: false });
  }

  // ── SAVE ─────────────────────────────────────────────────────────

  async save() {
    if (this.invoiceForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const raw = this.invoiceForm.getRawValue();
    const payload = {
      ...raw,
      items: raw.items.map((it: any) => ({
        description: it.name,
        service: it.service || undefined,
        days: it.days,
        pricePerDay: it.pricePerDay,
        quotedPrice: it.quotedPrice,
        total: it.total
      }))
    };

    this.loading = true;

    try {
      let res: any;
      if (this.isEditMode) {
        res = await firstValueFrom(this.api.put(`/invoices/${this.invoiceId}`, payload));
      } else {
        res = await firstValueFrom(this.api.post(`/invoices`, payload));
      }

      const savedId = res.data?._id || this.invoiceId;
      this.router.navigate(['/admin/invoices', savedId]);

    } catch (err: any) {
      alert('Error saving invoice: ' + (err.error?.message || 'Unknown error'));
    } finally {
      this.loading = false;
    }
  }
}
