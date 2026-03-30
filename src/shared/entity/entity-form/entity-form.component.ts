import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityConfig, EntityField, EntitySelectOption } from '../../../core/entity/entity.types';
import { unflattenObject } from '../../unflatten';
import { InputRendererComponent } from '../input-renderer/input-renderer.component';
import { EntityService } from '../../../core/entity/entity.service';
import { getEntityConfig } from '../../../core/entity/entities';

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputRendererComponent],
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.css'],
})
export class EntityFormComponent {

  @Input() entity!: EntityConfig;

  @Input() model: any = {};

  @Output() modelChange = new EventEmitter<any>();

  @Input() submitLabel = 'Save';
  @Input() errors: Record<string, string> = {};
  @Output() cancelEvent = new EventEmitter<void>();

  @Input() submitFn!: (data: any) => Promise<any>;

  loading = false;
  message = '';

  constructor(private entityService: EntityService) {}

  async ngOnInit() {
    await this.populateRelationOptions();
    
    // Initial calculation for existing data
    if (this.entity?.key === 'packages') {
      if (this.model.includedServices && !Array.isArray(this.model.includedServices)) {
        this.model.includedServices = [this.model.includedServices];
      }
      this.calculatePackagePrice();
    }

    if (this.entity?.key === 'quotations' || this.entity?.key === 'invoices') {
      if (this.model.services && !Array.isArray(this.model.services)) {
        this.model.services = [this.model.services];
      }
      if (this.model.packages && !Array.isArray(this.model.packages)) {
        this.model.packages = [this.model.packages];
      }
      
      // Only sync items on init if it's a NEW quotation. 
      // For existing ones, trust the items loaded from the database.
      if (this.entity.key === 'quotations' && !this.model._id) {
        this.syncQuotationItems();
      }
      this.calculateQuotationTotals();
    }
  }

  onFieldChange(field: string, value: any) {
    this.model[field] = value;

    // Auto-fill logic for linked entities
    const fieldConfig = this.entity.fields.find(f => f.name === field);
    if (fieldConfig?.type === 'relation' && value) {
      const selectedOption = fieldConfig.options?.find(o => o.value === value);
      const data = selectedOption?.data;

      if (data) {
        if (this.entity.key === 'invoices' && field === 'quotation') {
          // Auto-fill Invoice from Quotation
          if (data.customer) this.model.customer = data.customer._id || data.customer;
          if (data.items) {
            // Extract only IDs for services to ensure they match dropdown options (identity check)
            this.model.items = data.items.map((item: any) => ({
              ...item,
              service: item.service?._id || item.service
            }));
          }
          if (data.discount !== undefined) this.model.discount = data.discount;
          if (data.taxRate !== undefined) this.model.taxRate = data.taxRate;
          if (data.tax !== undefined) this.model.tax = data.tax;
          if (data.notes) this.model.notes = data.notes;
          if (data.event) this.model.event = data.event._id || data.event;
        } else if (this.entity.key === 'bookings' && field === 'invoice') {
          // Auto-fill Booking from Invoice
          if (data.customer) this.model.customer = data.customer._id || data.customer;
          if (data.grandTotal !== undefined || data.totalAmount !== undefined) {
            this.model.totalAmount = data.grandTotal || data.totalAmount;
          }
        } else if (this.entity.key === 'payments' && field === 'invoice') {
          // Auto-fill Payment from Invoice
          if (data.customer) this.model.party = data.customer._id || data.customer;
          if (data.grandTotal !== undefined) {
            const grandTotal = data.grandTotal || 0;
            const paidAmount = data.paidAmount || 0;
            const pending = grandTotal - paidAmount;
            this.model.amount = pending > 0 ? pending : grandTotal;
          }
        }

        // Explicitly sync items when packages or services are changed
        if (this.entity.key === 'quotations' && (field === 'packages' || field === 'services')) {
          this.syncQuotationItems();
        }
      }
    }

    this.onFormChange();
  }

  onFormChange() {
    if (this.entity?.key === 'packages') {
      this.calculatePackagePrice();
    }
    
    if (this.entity?.key === 'quotations' || this.entity?.key === 'invoices') {
      this.calculateQuotationTotals();
    }

    this.modelChange.emit(this.model);
  }

  private syncQuotationItems() {
    if (!this.model.items) this.model.items = [];
    
    // 1. Identify all "Desired" items from current selections [serviceId, sourceName]
    const desired: { service: string, source: string }[] = [];
    
    // Individual services
    if (Array.isArray(this.model.services)) {
      this.model.services.forEach((id: string) => desired.push({ service: id, source: 'Individual' }));
    }
    
    // Services from selected packages
    const packageField = this.entity.fields.find(f => f.name === 'packages');
    if (packageField && packageField.options && Array.isArray(this.model.packages)) {
      this.model.packages.forEach((pkgId: string) => {
        const pkgOpt = packageField.options!.find(o => o.value === pkgId);
        if (pkgOpt && pkgOpt.data && Array.isArray(pkgOpt.data.includedServices)) {
          pkgOpt.data.includedServices.forEach((s: any) => {
            const sId = typeof s === 'string' ? s : s._id;
            if (sId) desired.push({ service: sId, source: pkgOpt.label });
          });
        }
      });
    }

    // 2. Map existing items by a "service|source" key to preserve manual edits
    const existingItemsMap = new Map<string, any[]>();
    this.model.items.forEach((item: any) => {
      const key = `${item.service}|${item.source || 'Individual'}`;
      if (!existingItemsMap.has(key)) existingItemsMap.set(key, []);
      existingItemsMap.get(key)!.push(item);
    });

    // 3. Build the new items list by matching desired vs existing
    const newItems: any[] = [];
    const serviceField = this.entity.fields.find(f => f.name === 'services');

    desired.forEach(d => {
      const key = `${d.service}|${d.source}`;
      const existingPool = existingItemsMap.get(key) || [];
      
      if (existingPool.length > 0) {
        // Reuse existing item to preserve edits
        newItems.push(existingPool.shift());
      } else {
        // Create new item with defaults
        const sOpt = serviceField?.options?.find(o => o.value === d.service);
        const basePrice = sOpt?.data?.pricePerDay || 0;
        newItems.push({
          service: d.service,
          source: d.source,
          days: 1,
          basePrice: basePrice, // Store for reference
          pricePerDay: basePrice,
          total: basePrice
        });
      }
    });

    this.model.items = newItems;
  }

  private calculateQuotationTotals() {
    const items = this.model.items || [];
    const total = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
    this.model.totalAmount = Math.round(total);
    this.model.finalAmount = Math.max(0, Math.round(total - (this.model.discount || 0)));
    
    const rate = (this.model.taxRate !== undefined && this.model.taxRate !== null) ? this.model.taxRate : 0;
    this.model.tax = Math.round(this.model.finalAmount * (rate / 100));
    
    const extra = (this.model.extraCharges || 0);
    this.model.grandTotal = Math.round(this.model.finalAmount + (this.model.tax || 0) + extra);
  }

  private calculatePackagePrice() {
    let total = 0;
    
    // 1. Sum up included services
    const serviceField = this.entity.fields.find(f => f.name === 'includedServices');
    if (serviceField && serviceField.options && Array.isArray(this.model.includedServices)) {
      this.model.includedServices.forEach((id: string) => {
        const opt = serviceField.options!.find(o => o.value === id);
        if (opt && opt.data && typeof opt.data.pricePerDay === 'number') {
          total += opt.data.pricePerDay;
        }
      });
    }

    // 2. Sum up custom items
    if (Array.isArray(this.model.customItems)) {
      this.model.customItems.forEach((item: any) => {
        if (item.price && !isNaN(item.price)) {
          total += Number(item.price);
        }
      });
    }

    this.model.price = total;
  }

  private async populateRelationOptions() {
    if (!this.entity?.fields?.length) return;

    const updatedFields = await Promise.all(
      this.entity.fields.map(async (field) => {

        if ((field.type !== 'relation' && field.type !== 'line-items') || !field.relation) return field;

        const relatedEntityConfig = getEntityConfig(field.relation.entity);
        if (!relatedEntityConfig) return field;

        try {

          const response = await this.entityService.list(relatedEntityConfig);

          const records = Array.isArray(response)
            ? response
            : (response?.data ?? []);

          const valueKey =
            field.relation.valueKey ??
            relatedEntityConfig.idKey ??
            '_id';

          const labelKey =
            field.relation.labelKey ??
            'name';

          const options: EntitySelectOption[] = records.map((record: any) => ({
            value: record?.[valueKey],
            label: String(record?.[labelKey] ?? record?.[valueKey] ?? ''),
            data: record
          }));

          return { ...field, options };

        } catch {
          return field;
        }

      })
    );

    this.entity = { ...this.entity, fields: updatedFields as EntityField[] };
  }

  async submit(formIsValid: boolean) {

    if (!formIsValid) return;

    try {

      this.loading = true;
      this.message = '';

      const normalizedModel = unflattenObject(this.model);

      await this.submitFn(normalizedModel);

      this.message = '✅ Saved successfully';

    } catch (error: any) {

      this.message =
        error?.error?.message ||
        error?.message ||
        '❌ Failed';

    } finally {

      this.loading = false;

    }

  }

  cancel() {
    this.cancelEvent.emit();
  }
}
