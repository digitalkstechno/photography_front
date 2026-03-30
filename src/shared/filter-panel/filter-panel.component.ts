import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityTableFilter } from '../../core/entity/entity.types';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.css'
})
export class FilterPanelComponent {
  @Input() filters: EntityTableFilter[] = [];
  @Input() isOpen = false;
  
  @Output() filterChange = new EventEmitter<Record<string, any>>();
  @Output() close = new EventEmitter<void>();

  activeFilters: Record<string, any> = {};

  setFilter(name: string, value: any) {
    if (value === undefined) {
      delete this.activeFilters[name];
    } else {
      this.activeFilters[name] = value;
    }
    this.apply();
  }

  apply() {
    this.filterChange.emit({ ...this.activeFilters });
  }

  clearAll() {
    this.activeFilters = {};
    this.apply();
  }

  onClose() {
    this.close.emit();
  }

  getSoftClass(label: string): string {
    const l = label?.toLowerCase() || '';
    if (l.includes('paid') || l.includes('success')) return 'bg-soft-green';
    if (l.includes('pending') || l.includes('partial')) return 'bg-soft-yellow';
    if (l.includes('cancel') || l.includes('failed')) return 'bg-soft-red';
    return 'bg-soft-gray';
  }
}
