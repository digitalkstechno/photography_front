import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntityListComponent } from '../../shared/entity/entity-list/entity-list.component';
import { EntityConfig } from '../../core/entity/entity.types';
import { getEntityConfig } from '../../core/entity/entities';

@Component({
  selector: 'app-entity-page',
  standalone: true,
  imports: [CommonModule, EntityListComponent],
  templateUrl: './entity-page.component.html',
  styleUrls: ['./entity-page.component.css']
})
export class EntityPageComponent {

  entity?: EntityConfig;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const entityKey = params.get('entity');
      if (!entityKey) {
        this.entity = undefined;
        return;
      }

      const config = getEntityConfig(entityKey);
      this.entity = config ?? undefined;
    });
  }

  onEdit(record: any) {
    if (!this.entity) return;
    this.router.navigate(['/admin', this.entity.key, record.id]);
  }

  onAddNew() {
    if (!this.entity) return;
    this.router.navigate(['/admin', this.entity.key, 'new']);
  }
}
