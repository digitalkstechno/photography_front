import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/http/api.service';

@Component({
  selector: 'app-quote-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-public.component.html',
  styleUrls: ['./quote-public.component.css'],
})
export class QuotePublicComponent implements OnInit {
  loading = true;
  error = '';
  quote: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid quote link.';
      this.loading = false;
      return;
    }

    try {
      this.quote = await this.api.get<any>(`/transactions/${id}`).toPromise();
    } catch (err) {
      this.error = 'Unable to load quote.';
    } finally {
      this.loading = false;
    }
  }

  async accept() {
    if (!this.quote?.id) return;

    try {
      await this.api
        .post(`/transactions/${this.quote.id}/convert-to-invoice`, {})
        .toPromise();
      this.router.navigate(['/booking-confirmation'], {
        queryParams: { quoteId: this.quote.id },
      });
    } catch {
      this.error = 'Failed to accept quote.';
    }
  }
}

