import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EntityFormComponent } from '../../shared/entity/entity-form/entity-form.component';
import { EntityService } from '../../core/entity/entity.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService
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
    }
  }

  private async loadRecord(id: string) {
    try {
      this.loading = true;
      const record = await this.entityService.getOne(this.entity, id);
      // Flatten nested object for form binding (e.g. items[0].price)
      this.model = flattenObject(record);
    } catch (err) {
      console.error('Failed to load record:', err);
    } finally {
      this.loading = false;
    }
  }

  save = async (data: any) => {
    if (this.isEdit && this.editId) {
      await this.entityService.update(this.entity, this.editId, data);
    } else {
      await this.entityService.create(this.entity, data);
    }

    // Redirect back to list page
    this.router.navigate([`/admin/${this.entityName}`]);
  };
}
