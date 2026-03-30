import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-invoice-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="invoice-settings animate-fade-in">
      <header class="section-header">
        <h2 class="section-title">Billing & Tax Logic</h2>
        <p class="section-subtitle">Configure invoice prefixes, digital taxes, and default payment terms</p>
      </header>

      <div class="settings-grid mt-6">
        <!-- PREFIX & CURRENCY -->
        <div class="settings-card shadow-sm">
          <h3 class="card-title">🧾 Invoice Series</h3>
          
          <form [formGroup]="invoiceForm">
            <div class="form-group">
              <label>Invoice Prefix</label>
              <input type="text" formControlName="prefix" placeholder="e.g. STUDIO/2024/">
              <p class="help-text">Visible on all generated PDF invoices</p>
            </div>

            <div class="form-row split mt-4">
              <div class="form-group">
                <label>Currency Symbol</label>
                <select formControlName="currency">
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Default Due Days</label>
                <input type="number" formControlName="dueDays">
              </div>
            </div>

            <div class="roundoff-logic mt-6">
               <h4 class="sub-title">Round-off Rule</h4>
               <div class="radio-card-group">
                 <label class="radio-card" [class.selected]="invoiceForm.get('roundOff')?.value === 'Nearest'">
                   <input type="radio" value="Nearest" formControlName="roundOff">
                   <span>Nearest</span>
                 </label>
                 <label class="radio-card" [class.selected]="invoiceForm.get('roundOff')?.value === 'Up'">
                   <input type="radio" value="Up" formControlName="roundOff">
                   <span>Up (₹1)</span>
                 </label>
                 <label class="radio-card" [class.selected]="invoiceForm.get('roundOff')?.value === 'None'">
                   <input type="radio" value="None" formControlName="roundOff">
                   <span>Disabled</span>
                 </label>
               </div>
            </div>
          </form>
        </div>

        <!-- TAX SLABS & TERMS -->
        <div class="settings-card shadow-sm">
          <h3 class="card-title">🏛️ Tax Mastery</h3>
          
          <div class="tax-slab-selector">
             <p class="help-text mb-2">Enable tax slabs used in your services</p>
             <div class="slab-chips">
                <div class="slab-pill" [class.active]="hasSlab(5)" (click)="toggleSlab(5)">5%</div>
                <div class="slab-pill" [class.active]="hasSlab(12)" (click)="toggleSlab(12)">12%</div>
                <div class="slab-pill" [class.active]="hasSlab(18)" (click)="toggleSlab(18)">18%</div>
                <div class="slab-pill" [class.active]="hasSlab(28)" (click)="toggleSlab(28)">28%</div>
             </div>
          </div>

          <div class="form-group mt-8">
            <label>Default Terms & Conditions</label>
            <textarea formControlName="terms" rows="6" placeholder="Mention your booking rules..."></textarea>
          </div>

          <div class="config-summary mt-6">
             <div class="summary-item">
                <span>Auto-calculate Tax</span>
                <div class="switch sm"><input type="checkbox" checked><span class="slider"></span></div>
             </div>
          </div>
        </div>
      </div>

      <div class="sticky-save-bar mt-12">
         <p>Global prefix applied to <b>1,240</b> existing invoices</p>
         <button class="btn btn-primary" (click)="save()">Save Billing Config</button>
      </div>
    </div>
  `,
  styles: [`
    .invoice-settings { padding: 1rem 0; }
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .settings-card { background: white; padding: 2.5rem; border-radius: 24px; border: 1.5px solid #f1f5f9; }
    
    .help-text { font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem; }
    .sub-title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 0.75rem; font-weight: 800; }
    
    .radio-card-group { display: flex; gap: 1rem; }
    .radio-card { flex: 1; padding: 1rem; border: 1.5px solid #e2e8f0; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; font-weight: 700; color: #64748b; }
    .radio-card:hover { background: #f8fafc; }
    .radio-card.selected { border-color: #7c3aed; background: rgba(124, 58, 237, 0.05); color: #7c3aed; }
    .radio-card input { display: none; }

    .slab-chips { display: flex; gap: 0.75rem; }
    .slab-pill { padding: 0.5rem 1rem; border-radius: 30px; background: #f1f5f9; color: #64748b; font-weight: 800; cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent; }
    .slab-pill.active { background: #0f172a; color: white; border-color: #0f172a; }
    
    .config-summary { background: #f8fafc; border-radius: 12px; padding: 1rem; }
    .summary-item { display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #475569; }

    .sticky-save-bar { padding: 1.5rem 2rem; background: #f8fafc; border-radius: 20px; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; }
    .sticky-save-bar p { font-size: 0.85rem; color: #64748b; font-weight: 600; margin: 0; }
  `]
})
export class InvoiceSettingsComponent implements OnInit {
  invoiceForm: FormGroup;
  taxSlabs: number[] = [5, 18];

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    const config = this.settingsService.getConfig().invoices;
    this.invoiceForm = this.fb.group({
      prefix: [config.prefix],
      dueDays: [config.dueDays],
      currency: [config.currency],
      roundOff: [config.roundOff],
      terms: [config.terms]
    });
    this.taxSlabs = config.taxSlabs;
  }

  ngOnInit() {}

  hasSlab(val: number): boolean { return this.taxSlabs.includes(val); }
  toggleSlab(val: number) {
    if (this.hasSlab(val)) this.taxSlabs = this.taxSlabs.filter(s => s !== val);
    else this.taxSlabs.push(val);
  }

  save() {
    const val = this.invoiceForm.value;
    this.settingsService.updateConfig({
      invoices: {
        ...this.settingsService.getConfig().invoices,
        prefix: val.prefix,
        dueDays: val.dueDays,
        currency: val.currency,
        roundOff: val.roundOff,
        terms: val.terms,
        taxSlabs: this.taxSlabs
      }
    });
    alert('Billing & Tax config updated with absolute precision! 🚀');
  }
}
