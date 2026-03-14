import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-confirmation.component.html',
})
export class BookingConfirmationComponent {
  quoteId: string | null;

  constructor(route: ActivatedRoute) {
    this.quoteId = route.snapshot.queryParamMap.get('quoteId');
  }
}

