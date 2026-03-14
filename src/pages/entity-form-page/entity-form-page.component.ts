import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EntityFormComponent } from '../../shared/entity/entity-form/entity-form.component';
import { EntityService } from '../../core/entity/entity.service';
import { getEntityConfig } from '../../core/entity/entities';
import { EntityConfig } from '../../core/entity/entity.types';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService
  ) { }

  ngOnInit(): void {

    const name = this.route.snapshot.paramMap.get('entity');

    if (!name) {
      throw new Error('Entity name missing in route');
    }

    this.entityName = name;

    const config = getEntityConfig(name);

    if (!config) {
      throw new Error('Entity config not found');
    }

    this.entity = config;

  }

  save = async (data: any) => {

    await this.entityService.create(this.entity, data);

    // redirect to list page
    this.router.navigate([`/${this.entityName}`]);

  };

}
