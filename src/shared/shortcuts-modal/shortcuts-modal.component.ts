import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shortcuts-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shortcuts-overlay" (click)="close.emit()">
      <div class="shortcuts-card shadow-premium glass-morphic" (click)="$event.stopPropagation()">
        <div class="shortcuts-header">
          <div class="title-group">
            <span class="icon">⌨️</span>
            <h2 class="gradient-text">Keyboard Shortcuts</h2>
          </div>
          <button class="close-btn" (click)="close.emit()">×</button>
        </div>
        
        <div class="shortcuts-hint">
          Press <span class="kbd">Alt</span> <span class="plus">+</span> <span class="kbd key-accent">/</span> to open or close this panel
        </div>

        <div class="shortcuts-list">
          <div class="section-title">Create Workflow</div>
          
          <div class="shortcut-item" *ngFor="let item of shortcuts">
            <span class="label">{{ item.label }}</span>
            <div class="keys">
              <span class="kbd">Alt</span>
              <span class="plus">+</span>
              <span class="kbd key-accent">{{ item.key }}</span>
            </div>
          </div>
        </div>
        
        <div class="shortcuts-footer">
          <p>Supercharge your photography studio efficiency with instant access.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shortcuts-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }

    .shortcuts-card {
      width: 440px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 24px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      transform-origin: center;
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .shortcuts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .title-group .icon { font-size: 1.5rem; }
    .title-group h2 { margin: 0; font-size: 1.5rem; font-weight: 800; }

    .close-btn {
      background: rgba(0, 0, 0, 0.05);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover { background: rgba(220, 38, 38, 0.1); color: #dc2626; }

    .shortcuts-hint {
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .shortcuts-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .shortcut-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border-radius: 12px;
      transition: all 0.2s;
    }
    .shortcut-item:hover { background: #f1f5f9; transform: translateX(4px); }

    .label { font-weight: 600; color: #334155; font-size: 0.95rem; }

    .keys { display: flex; align-items: center; gap: 0.5rem; }
    
    .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 28px;
      padding: 0 0.5rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-bottom: 3px solid #e2e8f0;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: 800;
      color: #475569;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .key-accent {
      background: #7c3aed;
      color: #ffffff;
      border-color: #6d28d9;
      border-bottom-color: #5b21b6;
    }

    .plus { color: #94a3b8; font-weight: 800; font-size: 0.8rem; }

    .shortcuts-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .gradient-text {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `]
})
export class ShortcutsModalComponent {
  @Output() close = new EventEmitter<void>();

  shortcuts = [
    { label: 'Sales Invoice', key: 'S' },
    { label: 'POS Billing', key: 'B' },
    { label: 'Quotation', key: 'Q' },
    { label: 'Payment In', key: 'I' },
    { label: 'Payment Out', key: 'O' },
    { label: 'Expense', key: 'E' },
    { label: 'Add Party', key: 'Y' },
    { label: 'Service/Package', key: 'M' }
  ];
}
