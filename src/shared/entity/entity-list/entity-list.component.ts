import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../table/table.component';
import { EntityConfig } from '../../../core/entity/entity.types';
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

  columns: { key: string; label: string }[] = [];

  constructor(private entityService: EntityService) {}

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
    return await this.entityService.list(this.entity, params);
  };

  get addRoute() {
    return `${this.baseRoute}/new`;
  }

  getUpdateRoute = (row: any) => {
    const idKey = this.entity?.idKey ?? '_id';
    const id = row?.[idKey];
    return id ? `${this.baseRoute}/edit/${id}` : this.baseRoute;
  };
}

