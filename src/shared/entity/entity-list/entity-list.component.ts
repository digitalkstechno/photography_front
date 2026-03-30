import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TableComponent } from '../../table/table.component';
import { EntityConfig, EntityColumn } from '../../../core/entity/entity.types';
import { EntityService } from '../../../core/entity/entity.service';

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './entity-list.component.html',
})
export class EntityListComponent implements OnChanges {
  @Input() entity!: EntityConfig;
  @Input() baseRoute!: string; // e.g. "/admin/client"
  @Input() reloadTrigger?: any;
  @Input() extraParams: Record<string, any> = {};
  
  @Output() toggleFilters = new EventEmitter<void>();

  columns: EntityColumn[] = [];

  constructor(
    private entityService: EntityService,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']) {
      if (this.entity?.columns?.length) {
        this.columns = this.entity.columns;
      } else {
        this.columns = (this.entity?.fields ?? [])
          .filter((f) => f.type !== 'textarea')
          .map((f) => ({ key: f.name, label: f.label || f.name }));
      }
    }
  }

  fetchRows = async (params: any) => {
    // Merge URL query params (like partyId) into fetch params
    const mergedParams = { 
      ...this.route.snapshot.queryParams, 
      ...params,
      ...this.extraParams 
    };
    return await this.entityService.list(this.entity, mergedParams);
  };

  get addRoute() {
    return this.entity?.customAddRoute || `${this.baseRoute}/new`;
  }

  getUpdateRoute = (row: any) => {
    if (this.entity?.ui?.updateRoute) return this.entity.ui.updateRoute(row);
    const idKey = this.entity?.idKey ?? '_id';
    const id = row?.[idKey];
    return id ? `${this.baseRoute}/edit/${id}` : this.baseRoute;
  };

  get rowActions() {
    return this.entity?.ui?.rowActions || [];
  }
}

