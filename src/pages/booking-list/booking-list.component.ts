import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityListComponent } from '../../shared/entity/entity-list/entity-list.component';
import { getEntityConfig } from '../../core/entity/entities';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, EntityListComponent],
  template: `
    <div class="page-container container">
      <div class="card-premium card-header-black mb-5">
        <div class="header-inner">
          <div class="title-group">
            <h1 class="text-white">Bookings</h1>
            <p class="text-muted-light">Overview of all confirmed and pending photography sessions</p>
          </div>
        </div>
        
        <div class="p-5">
          <app-entity-list [entity]="config" baseRoute="/bookings"></app-entity-list>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-5 { margin-bottom: 24px; }
  `]
})
export class BookingListComponent {
  config = getEntityConfig('bookings')!;
}
