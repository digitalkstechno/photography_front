import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EntityFormComponent } from '../../shared/entity/entity-form/entity-form.component';
import { EntityService } from '../../core/entity/entity.service';
import { ModalService } from '../../shared/modal/modal.service';
import { getEntityConfig } from '../../core/entity/entities';
import { EntityConfig } from '../../core/entity/entity.types';
import { flattenObject } from '../../shared/flatten';

@Component({
  selector: 'app-entity-form-page',
  standalone: true,
  imports: [CommonModule, EntityFormComponent],
  templateUrl: './entity-form-page.component.html',
  styleUrls: ['./entity-form-page.component.css']
})
export class EntityFormPageComponent implements OnInit {

  entity!: EntityConfig;
  model: any = {};
  entityName!: string;
  editId: string | null = null;
  loading = false;
  isEdit = false;
  fieldErrors: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    @Inject(ModalService) private modal: ModalService
  ) { }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('entity');
    if (!name) throw new Error('Entity name missing in route');

    this.entityName = name;

    const config = getEntityConfig(name);
    if (!config) throw new Error('Entity config not found');

    this.entity = config;

    // Check if editing an existing record
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.isEdit = true;
      this.loadRecord(id);
    } else {
      // Auto-populate form from query params (e.g. ?invoice=xxx&party=xxx)
      this.applyQueryParams();
    }
  }

  /**
   * Read query params and pre-fill matching form fields.
   * Also fetches linked records (e.g. Invoice) to auto-fill related data (e.g. Customer)
   */
  private async applyQueryParams() {
    const params = this.route.snapshot.queryParams;
    if (!params || Object.keys(params).length === 0) return;

    const model: any = {};
    for (const [key, value] of Object.entries(params)) {
      const field = this.entity.fields.find(f => f.name === key);
      if (field && value) {
        model[key] = value;

        // AUTOMATION: If it's a relation (like invoice or quotation), fetch details to fill other fields
        if (field.type === 'relation' && field.relation) {
          try {
            const config = getEntityConfig(field.relation.entity);
            if (config) {
              const relatedData = await this.entityService.getOne(config, value as string);
              if (relatedData) {
                // Auto-map common fields to the target entity
                this.autoMapFields(relatedData, key);
              }
            }
          } catch (err) {
            console.warn(`Failed to auto-populate from ${key}:`, err);
          }
        }
      }
    }

    this.model = { ...this.model, ...model };
  }

  /**
   * Intelligently maps fields from a source (e.g. Invoice) to the target (e.g. Event)
   */
  private autoMapFields(source: any, sourceKey: string) {
    const mapping: Record<string, string[]> = {
      // If we carry over a customer, it usually maps directly
      'customer': ['customer'],
      // If source was an Invoice/Quotation, fill event's customer and amount
      'invoice': ['customer', 'totalAmount:grandTotal'],
      'quotation': ['customer', 'totalAmount:grandTotal'],
      'event': ['customer']
    };

    const rules = mapping[sourceKey] || [];
    const updates: any = {};

    rules.forEach(rule => {
      const [targetKey, sourceAttr] = rule.split(':');
      const attrToFetch = sourceAttr || targetKey;
      
      // Only update if target exists in our current entity fields
      if (this.entity.fields.find(f => f.name === targetKey)) {
        const val = source[attrToFetch];
        if (val) updates[targetKey] = val?._id || val;
      }
    });

    this.model = { ...this.model, ...updates };
  }

  private async loadRecord(id: string) {
    try {
      this.loading = true;
      let record = await this.entityService.getOne(this.entity, id);
      
      // Sanitization: Ensure all relation fields (and line-item services) are ID strings
      // This prevents identity mismatch issues in dropdowns when editing existing records
      record = this.sanitizeRecord(record);
      
      // Flatten nested object for form binding (e.g. items[0].price)
      this.model = flattenObject(record);
    } catch (err) {
      console.error('Failed to load record:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Converts populated relation objects (e.g. { _id: '...', name: '...' })
   * into simple ID strings for form binding.
   */
  private sanitizeRecord(record: any): any {
    const sanitized = { ...record };
    
    this.entity.fields.forEach(field => {
      // 1. Relations (Single and Multiple)
      if (field.type === 'relation' && sanitized[field.name]) {
        if (field.relation?.multiple && Array.isArray(sanitized[field.name])) {
          sanitized[field.name] = sanitized[field.name].map((val: any) => val?._id || val);
        } else if (typeof sanitized[field.name] === 'object') {
          sanitized[field.name] = sanitized[field.name]._id || sanitized[field.name];
        }
      }
      
      // 2. Line items relations (e.g. service inside items array)
      if (field.type === 'line-items' && Array.isArray(sanitized[field.name])) {
        sanitized[field.name] = sanitized[field.name].map((item: any) => ({
          ...item,
          service: (item.service && typeof item.service === 'object') 
            ? item.service._id 
            : item.service
        }));
      }
    });
    
    return sanitized;
  }

  save = async (data: any) => {
    this.loading = true;
    this.fieldErrors = {}; // Clear previous errors
    try {
      if (this.isEdit && this.editId) {
        await this.entityService.update(this.entity, this.editId, data);
      } else {
        await this.entityService.create(this.entity, data);
      }

      // Show success modal before redirect
      this.modal.success('Record Saved', `${this.entity.label} has been stored successfully.`);
      this.router.navigate([`/admin/${this.entityName}`]);

    } catch (err: any) {
      console.error('Save failed:', err);
      
      // Capture detailed field errors from backend (spread creates new reference for change detection)
      this.fieldErrors = { ...(err.error?.errors || {}) };

      // Extract high-precision summary message
      const errorMsg = err.error?.message || err.message || 'Check your internet connection and try again.';
      this.modal.error('Save Failed', errorMsg);

      // CRITICAL: Re-throw so the form component stays in error state
      throw err;
    } finally {
      this.loading = false;
    }
  };

  onCancel() {
    this.router.navigate([`/admin/${this.entityName}`]);
  }
}
