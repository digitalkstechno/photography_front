import { Injectable } from '@angular/core';
import { Subject, Observable, merge } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs/operators';

export enum HotkeyAction {
  TOGGLE_SHORTCUTS = 'TOGGLE_SHORTCUTS',
}

@Injectable({
  providedIn: 'root',
})
export class HotkeyService {
  private hotkeySubject = new Subject<HotkeyAction>();

  constructor(private router: Router) {
    this.init();
  }

  private init() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.altKey) {
        const key = event.key.toLowerCase();

        switch (key) {
          case 's':
            event.preventDefault();
            this.router.navigate(['/admin/invoices/new']);
            break;
          case 'q':
            event.preventDefault();
            this.router.navigate(['/admin/quotations/new']);
            break;
          case 'b':
            event.preventDefault();
            this.router.navigate(['/admin/pos']);
            break;
          case 'i':
            event.preventDefault();
            this.router.navigate(['/admin/payments/new'], { queryParams: { type: 'IN' } });
            break;
          case 'o':
            event.preventDefault();
            this.router.navigate(['/admin/payments/new'], { queryParams: { type: 'OUT' } });
            break;
          case 'e':
            event.preventDefault();
            this.router.navigate(['/admin/expenses/new']);
            break;
          case 'y':
            event.preventDefault();
            this.router.navigate(['/admin/party/new']);
            break;
          case 'm':
            event.preventDefault();
            this.router.navigate(['/admin/services']);
            break;
          case '/':
            event.preventDefault();
            this.hotkeySubject.next(HotkeyAction.TOGGLE_SHORTCUTS);
            break;
        }
      }
    });
  }

  /**
   * Returns the hotkey stream, with a debounce on the toggle action
   * to prevent rapid-fire while holding the Alt key.
   */
  get hotkeys(): Observable<HotkeyAction> {
    const source$ = this.hotkeySubject.asObservable();

    const toggleAction$ = source$.pipe(
      filter((a): a is HotkeyAction.TOGGLE_SHORTCUTS => a === HotkeyAction.TOGGLE_SHORTCUTS),
      debounceTime(300)
    );

    const otherActions$ = source$.pipe(
      filter((a) => a !== HotkeyAction.TOGGLE_SHORTCUTS)
    );

    return merge(toggleAction$, otherActions$);
  }
}
