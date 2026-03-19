import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityField } from '../../../core/entity/entity.types';

@Component({
  selector: 'app-input-renderer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-renderer.component.html',
  styleUrls: ['./input-renderer.component.css'],
})
export class InputRendererComponent {
  @Input() field!: EntityField;
  @Input() model: any = {};
  @Output() modelChange = new EventEmitter<any>();

  get key() {
    return this.field?.name;
  }

  onModelChange() {
    this.modelChange.emit(this.model);
  }

  addArrayItem() {
    if (!this.model[this.field.name]) {
      this.model[this.field.name] = [];
    }
    this.model[this.field.name].push({ name: '', price: 0 });
    this.onModelChange();
  }

  removeArrayItem(index: number) {
    if (this.model[this.field.name]) {
      this.model[this.field.name].splice(index, 1);
      this.onModelChange();
    }
  }

  // --- Line Items (Quotations) ---
  addLineItem() {
    if (!this.model[this.field.name]) {
      this.model[this.field.name] = [];
    }
    this.model[this.field.name].push({ service: '', days: 1, pricePerDay: 0, total: 0 });
    this.onModelChange();
  }

  removeLineItem(index: number) {
    if (this.model[this.field.name]) {
      this.model[this.field.name].splice(index, 1);
      this.onModelChange();
    }
  }

  onLineItemChange(item: any) {
    // Auto-fill price if service is selected and price is 0
    if (item.service && item.pricePerDay === 0) {
      const opt = this.field.options?.find(o => o.value === item.service);
      if (opt && opt.data && opt.data.pricePerDay) {
        item.pricePerDay = opt.data.pricePerDay;
      }
    }
    
    // Calculate row total
    item.total = (item.days || 0) * (item.pricePerDay || 0);
    this.onModelChange();
  }

  getOptionLabel(value: any): string {
    const opt = this.field.options?.find(o => o.value === value || (o.value?._id === value));
    return opt ? opt.label : value || 'Unknown';
  }

  // --- Better Multi-Select ---
  isItemSelected(value: any): boolean {
    const arr = this.model[this.field.name];
    return Array.isArray(arr) && arr.includes(value);
  }

  removeItemSelected(value: any) {
    const arr = this.model[this.field.name];
    if (Array.isArray(arr)) {
      const index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
        this.onModelChange();
      }
    }
  }

  onMultiSelectChange(event: any) {
    const val = event.target.value;
    if (!val) return;
    
    if (!this.model[this.field.name]) {
      this.model[this.field.name] = [];
    }
    
    if (!this.isItemSelected(val)) {
      this.model[this.field.name].push(val);
      this.onModelChange();
    }
    
    // Reset select
    event.target.value = '';
  }
}

