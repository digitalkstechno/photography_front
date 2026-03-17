import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EntityListComponent } from '../../shared/entity/entity-list/entity-list.component';
import { getEntityConfig } from '../../core/entity/entities';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, EntityListComponent],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent {
  config = getEntityConfig('bookings')!;

  constructor(private router: Router) {}

  onNew() {
    this.router.navigate(['/bookings/new']);
  }
}
