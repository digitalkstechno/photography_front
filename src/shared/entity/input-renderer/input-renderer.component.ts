import { Component, EventEmitter, Input, Output, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityField } from '../../../core/entity/entity.types';
import { ApiService } from '../../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-input-renderer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-renderer.component.html',
  styleUrls: ['./input-renderer.component.css'],
})
export class InputRendererComponent implements DoCheck {
  @Input() field!: EntityField;
  @Input() model: any = {};
  @Output() modelChange = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<{ field: string, value: any }>();

  // --- Team Assignments State ---
  lastStartDate = '';
  lastEndDate = '';
  availableUsers: any[] = [];
  availableFreelancers: any[] = [];
  availableEquipments: any[] = [];
  availabilityLoading = false;
  roles = [
    'Primary Photographer', 'Candid Photographer', 'Traditional Video',
    'Cinematographer', 'Drone Pilot', 'Assistant', 'Other'
  ];

  constructor(private api: ApiService) {}

  ngDoCheck() {
    if (this.field.type === 'team-assignments') {
      this.checkTeamAvailability();
    }
  }

  async checkTeamAvailability() {
    const s = this.model.startDate;
    const e = this.model.endDate;
    if (!s || !e) return;
    if (s === this.lastStartDate && e === this.lastEndDate) return;
    
    this.lastStartDate = s;
    this.lastEndDate = e;
    this.availabilityLoading = true;
    try {
      let url = `/events/availability/team?startDate=${s}&endDate=${e}`;
      if (this.model._id) url += `&excludeEventId=${this.model._id}`;
      const res = await firstValueFrom(this.api.get<any>(url));
      if (res?.success) {
        this.availableUsers = res.data.users || [];
        this.availableFreelancers = res.data.freelancers || [];
        this.availableEquipments = res.data.equipments || [];
      }
    } catch(err) {
      console.error(err);
    } finally {
      this.availabilityLoading = false;
    }
  }

  addAssignment() {
    if (!this.model[this.field.name]) this.model[this.field.name] = [];
    this.model[this.field.name].push({ memberType: '', personId: '', role: '', equipmentIds: [] });
    this.onModelChange();
  }

  removeAssignment(index: number) {
    if (this.model[this.field.name]) {
      this.model[this.field.name].splice(index, 1);
      this.onModelChange();
    }
  }

  toggleEquipment(assignmentIndex: number, eqId: string) {
    const assignment = this.model[this.field.name][assignmentIndex];
    if (!assignment) return;
    if (!assignment.equipmentIds) assignment.equipmentIds = [];
    
    const idx = assignment.equipmentIds.indexOf(eqId);
    if (idx > -1) {
      assignment.equipmentIds.splice(idx, 1);
    } else {
      assignment.equipmentIds.push(eqId);
    }
    this.onModelChange();
  }

  isEquipmentSelected(assignmentIndex: number, eqId: string): boolean {
    const assignment = this.model[this.field.name]?.[assignmentIndex];
    return assignment?.equipmentIds?.includes(eqId) || false;
  }

  getPersonName(type: string, id: string): string {
    if (type === 'USER') {
      return this.availableUsers.find(u => u._id === id)?.name || 'Unknown';
    } else if (type === 'FREELANCER') {
      return this.availableFreelancers.find(f => f._id === id)?.name || 'Unknown';
    }
    return '';
  }

  getAvailablePeople(type: string): any[] {
    return type === 'USER' ? this.availableUsers : this.availableFreelancers;
  }

  get key() {
    return this.field?.name;
  }

  onModelChange() {
    this.modelChange.emit(this.model);
    this.valueChange.emit({ field: this.field.name, value: this.model[this.field.name] });
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

