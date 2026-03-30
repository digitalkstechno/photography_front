import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="company-settings animate-fade-in">
      <header class="section-header">
        <h2 class="section-title">Studio Branding & Legal</h2>
        <p class="section-subtitle">Configure your studio identity, GST registration, and billing defaults</p>
      </header>

      <div class="settings-grid mt-6">
        <!-- BRANDING SECTION -->
        <div class="settings-card shadow-sm">
          <div class="logo-preview-box">
             <div class="dashed-border">
                <span class="upload-icon">📸</span>
                <h4>Studio Logo</h4>
                <p>Upload a high-resolution PNG for invoices</p>
                <div class="btn btn-secondary btn-sm mt-2">Select File</div>
             </div>
          </div>

          <form [formGroup]="companyForm" class="mt-8">
            <div class="form-group">
              <label>Business Name <span class="required">*</span></label>
              <input type="text" formControlName="name" placeholder="Enter studio name">
            </div>

            <div class="form-row split mt-4">
              <div class="form-group">
                <label>Industry</label>
                <select formControlName="industry">
                  <option value="Photography & Videography">Photography & Videography</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Graphic Design">Graphic Design</option>
                </select>
              </div>
              <div class="form-group">
                <label>Inception Year</label>
                <input type="number" formControlName="inceptionYear" placeholder="e.g. 2018">
              </div>
            </div>

            <div class="form-group mt-4">
               <label>Billing Address</label>
               <textarea formControlName="address" rows="3" placeholder="Enter your full registered address"></textarea>
            </div>
          </form>
        </div>

        <!-- TAX & COMPLIANCE -->
        <div class="settings-card shadow-sm bg-legal">
          <h3 class="card-title">⚖️ Compliance & GST</h3>
          
          <div class="toggle-row">
            <span class="f-title">Is your business GST Registered?</span>
            <div class="switch sm"><input type="checkbox" formControlName="gstRegistered"><span class="slider"></span></div>
          </div>

          <div class="gst-fields mt-6 animate-fade-in" *ngIf="companyForm.get('gstRegistered')?.value">
            <div class="form-group">
              <label>Primary GST Number (State Code 27)</label>
              <input type="text" formControlName="gstNumber" placeholder="27XXXXX0000X1X1">
            </div>
            
            <div class="msme-box mt-4 shadow-xs">
               <span class="badge badge-primary">NEW</span>
               <h4 class="sub-title">MSME / UDYAM Details</h4>
               <input type="text" formControlName="msmeNumber" placeholder="UDYAM-MH-00-1234567">
            </div>
          </div>

          <div class="compliance-footer mt-8">
             <div class="separator-text italic">Digital Signature for E-Invoicing</div>
             <div class="signature-upload shadow-premium mt-2">
                <span class="p-icon">✍️</span>
                <p>Click to upload authorized signature</p>
             </div>
          </div>
        </div>
      </div>

      <div class="sticky-save-bar mt-12">
         <div class="save-info">
            <span class="dot-indicator pulse"></span>
            <p>Last edited 2 mins ago by Admin</p>
         </div>
         <button class="btn btn-primary" (click)="save()">Save Studio Identity</button>
      </div>
    </div>
  `,
  styles: [`
    .company-settings { padding: 1rem 0; }
    .settings-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; }
    .settings-card { background: white; padding: 2.5rem; border-radius: 24px; border: 1.5px solid #f1f5f9; }
    .bg-legal { background: rgba(16, 185, 129, 0.01); border-color: rgba(16, 185, 129, 0.1); }
    
    .logo-preview-box { background: #f8fafc; border-radius: 16px; padding: 1.5rem; }
    .dashed-border { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 2rem; text-align: center; }
    .upload-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .dashed-border h4 { margin: 0; font-size: 0.95rem; color: #1e293b; }
    .dashed-border p { font-size: 0.75rem; color: #94a3b8; margin: 0.25rem 0 1rem; }

    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
    .f-title { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    
    .msme-box { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; position: relative; }
    .badge-primary { position: absolute; top: -10px; right: 20px; background: #6366f1; color: white; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 800; }
    .sub-title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin: 0 0 1rem; font-weight: 800; }

    .signature-upload { height: 100px; background: white; border: 1.5px dashed #cbd5e1; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .signature-upload:hover { border-color: #10b981; background: rgba(16, 185, 129, 0.02); }
    .p-icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .signature-upload p { font-size: 0.75rem; color: #64748b; font-weight: 600; margin: 0; }

    .sticky-save-bar { padding: 1.5rem 2rem; background: #f8fafc; border-radius: 20px; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; }
    .save-info { display: flex; align-items: center; gap: 0.75rem; }
    .save-info p { font-size: 0.85rem; color: #64748b; font-weight: 600; margin: 0; }
    
    .pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 0 rgba(16, 185, 129, 0.4); animation: pulse 2s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
  `]
})
export class CompanySettingsComponent implements OnInit {
  companyForm: FormGroup;

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    const config = this.settingsService.getConfig().business;
    this.companyForm = this.fb.group({
      name: [config.name],
      industry: [config.industry],
      inceptionYear: [2018],
      address: [config.address],
      gstRegistered: [config.gstRegistered],
      gstNumber: ['27AABCU1234F1Z1'],
      msmeNumber: ['']
    });
  }

  ngOnInit() {}

  save() {
    const val = this.companyForm.value;
    this.settingsService.updateConfig({
      business: {
        ...this.settingsService.getConfig().business,
        name: val.name,
        industry: val.industry,
        address: val.address,
        gstRegistered: val.gstRegistered
      }
    });
    alert('Studio identity updated with absolute precision! 🚀');
  }
}
