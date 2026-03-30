import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

/**
 * Usage: <button appTooltip="This saves the record">Save</button>
 * Optional position: <span appTooltip="Hello" tooltipPosition="bottom">?</span>
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') text = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tip: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onEnter() {
    if (!this.text) return;
    this.show();
  }

  @HostListener('mouseleave') onLeave() {
    this.hide();
  }

  @HostListener('focus') onFocus() {
    if (!this.text) return;
    this.show();
  }

  @HostListener('blur') onBlur() {
    this.hide();
  }

  private show() {
    this.tip = this.renderer.createElement('div');
    this.renderer.addClass(this.tip, 'app-tooltip');
    this.renderer.addClass(this.tip, `app-tooltip--${this.tooltipPosition}`);
    this.renderer.setProperty(this.tip, 'textContent', this.text);
    this.renderer.appendChild(document.body, this.tip);

    const rect = this.el.nativeElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Position after appending so dimensions are available
    requestAnimationFrame(() => {
      if (!this.tip) return;
      const tw = this.tip.offsetWidth;
      const th = this.tip.offsetHeight;
      let top = 0, left = 0;

      switch (this.tooltipPosition) {
        case 'top':
          top  = rect.top  + scrollY - th - 8;
          left = rect.left + scrollX + rect.width / 2 - tw / 2;
          break;
        case 'bottom':
          top  = rect.bottom + scrollY + 8;
          left = rect.left   + scrollX + rect.width / 2 - tw / 2;
          break;
        case 'left':
          top  = rect.top  + scrollY + rect.height / 2 - th / 2;
          left = rect.left + scrollX - tw - 8;
          break;
        case 'right':
          top  = rect.top   + scrollY + rect.height / 2 - th / 2;
          left = rect.right + scrollX + 8;
          break;
      }

      this.renderer.setStyle(this.tip, 'top',  `${top}px`);
      this.renderer.setStyle(this.tip, 'left', `${left}px`);
      this.renderer.addClass(this.tip, 'app-tooltip--visible');
    });
  }

  private hide() {
    if (this.tip) {
      this.renderer.removeChild(document.body, this.tip);
      this.tip = null;
    }
  }

  ngOnDestroy() { this.hide(); }
}
