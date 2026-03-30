import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntityListComponent } from '../../shared/entity/entity-list/entity-list.component';
import { FilterPanelComponent } from '../../shared/filter-panel/filter-panel.component';
import { EntityConfig } from '../../core/entity/entity.types';
import { getEntityConfig } from '../../core/entity/entities';

@Component({
  selector: 'app-entity-page',
  standalone: true,
  imports: [CommonModule, EntityListComponent, FilterPanelComponent],
  templateUrl: './entity-page.component.html',
  styleUrls: ['./entity-page.component.css']
})
export class EntityPageComponent {

  entity?: EntityConfig;
  isFilterOpen = false;
  activeFilters: any = {};

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
      this.isFilterOpen = false;
      this.activeFilters = {};
    });
  }

  onToggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onFilterChange(filters: any) {
    this.activeFilters = filters;
  }

  onEdit(record: any) {
    if (!this.entity) return;
    this.router.navigate(['/admin', this.entity.key, record.id]);
  }

  onNew() {
    if (!this.entity) return;
    this.router.navigate(['/admin', this.entity.key, 'new']);
  }
}
