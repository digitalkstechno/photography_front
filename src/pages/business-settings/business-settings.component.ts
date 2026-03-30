import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <!-- SECONDARY SIDEBAR -->
      <aside class="settings-sidebar shadow-premium">
        <div class="business-brief">
          <div class="brief-avatar">📸</div>
          <div class="brief-info">
            <span class="business-name">Studio Pro</span>
            <span class="business-id">7096120270</span>
          </div>
        </div>

        <button class="back-btn" (click)="goBack()">← Back to Dashboard</button>

        <nav class="settings-nav">
          <div class="nav-item">
            <span class="icon">👤</span> Account
          </div>
          <div class="nav-item active">
            <span class="icon">💼</span> Manage Business
          </div>
          <div class="nav-item">
            <span class="icon">📄</span> Invoice Settings
          </div>
          <div class="nav-item">
            <span class="icon">🖨️</span> Print Settings
          </div>
          <div class="nav-item">
            <span class="icon">👥</span> Manage Users
          </div>
          <div class="nav-item">
            <span class="icon">⏰</span> Reminders
          </div>
          <div class="nav-item">
            <span class="icon">📊</span> CA Reports Sharing
          </div>
          <div class="nav-item">
            <span class="icon">💎</span> Pricing
          </div>
          <div class="nav-item">
            <span class="icon">🎁</span> Refer & Earn
          </div>
        </nav>

        <div class="sidebar-footer">
          <p>App Version: 9.1.0</p>
          <div class="badges">
            <span>🛡️ 100% Secure</span>
            <span>🎯 ISO Certified</span>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="settings-main">
        <header class="settings-header">
          <div class="header-left">
            <h1 class="gradient-text">Business Settings</h1>
            <p>Edit your company settings and information</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-create">Create new business</button>
            <div class="action-group">
                <button class="btn-text">💬 Chat Support</button>
                <button class="btn-text">📅 Close Financial Year</button>
                <button class="btn btn-secondary">Cancel</button>
                <button class="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </header>

        <div class="settings-form-grid">
          <!-- LEFT COLUMN -->
          <div class="form-section">
            <div class="logo-upload-box">
              <div class="dashed-border">
                <span class="upload-icon">🖼️</span>
                <p>Upload Logo</p>
                <span>PNG/JPG, max 5 MB</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full">
                <label>Business Name <span class="required">*</span></label>
                <input type="text" placeholder="Enter business name" value="Studio Pro">
              </div>
            </div>

            <div class="form-row split">
              <div class="form-group">
                <label>Company Phone Number</label>
                <input type="text" placeholder="7096120270">
              </div>
              <div class="form-group">
                <label>Company E-Mail</label>
                <input type="email" placeholder="Enter company e-mail">
              </div>
            </div>

            <div class="form-group full">
               <label>Billing Address</label>
               <textarea placeholder="Enter Billing Address" rows="3"></textarea>
            </div>

            <div class="form-row tri">
               <div class="form-group">
                 <label>State</label>
                 <select><option>Select State</option></select>
               </div>
               <div class="form-group">
                 <label>City</label>
                 <input type="text" placeholder="Enter City">
               </div>
               <div class="form-group">
                 <label>Pincode</label>
                 <input type="text" placeholder="Enter Pincode">
               </div>
            </div>

            <div class="toggle-section">
              <label>Are you GST Registered?</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" name="gst" checked>
                  <span>Yes</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="gst">
                  <span>No</span>
                </label>
              </div>
            </div>

            <div class="feature-bar">
               <span class="icon">🚀</span>
               <span>Enable e-Invoicing</span>
               <span class="badge badge-new">New</span>
               <div class="switch">
                 <input type="checkbox">
                 <span class="slider"></span>
               </div>
            </div>

            <div class="form-group full mt-4">
              <label>PAN Number</label>
              <input type="text" placeholder="Enter your PAN Number">
            </div>

            <div class="feature-row mt-4">
               <div class="feature-item">
                 <span>Enable TDS</span>
                 <div class="switch sm"><input type="checkbox"><span class="slider"></span></div>
               </div>
               <div class="feature-item">
                 <span>Enable TCS</span>
                 <div class="switch sm"><input type="checkbox"><span class="slider"></span></div>
               </div>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="form-section">
             <div class="form-group full">
                <label>Business Type (Select multiple, if applicable)</label>
                <select><option>Select</option></select>
             </div>

             <div class="form-group full">
                <label>Industry Type</label>
                <div class="search-input">
                  <span class="s-icon">🔍</span>
                  <input type="text" placeholder="Select Industry Type">
                </div>
             </div>

             <div class="form-group full">
                <label>Business Registration Type</label>
                <select><option>Private Limited Company</option></select>
             </div>

             <div class="separator-text">Note: Terms & Conditions and Signature added below will be shown on your Invoices.</div>

             <div class="signature-box">
                <label>Signature</label>
                <div class="dashed-border signature-area">
                   <p>Upload or draw signature</p>
                </div>
                <button class="btn-link danger">Remove</button>
             </div>

             <div class="business-details-box mt-4">
                <div class="box-header">Add Business Details</div>
                <p class="box-subtitle">Add additional business information such as MSME number, Website etc.</p>
                
                <div class="detail-row">
                  <input type="text" placeholder="Website" class="key">
                  <span>=</span>
                  <input type="text" placeholder="www.website.com" class="val">
                  <button class="btn btn-indigo">Add</button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .settings-container {
      display: flex;
      height: 100vh;
      background: #f8fafc;
    }

    .settings-sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 0;
    }

    .business-brief {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0 1.5rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .brief-avatar {
      width: 40px;
      height: 40px;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .business-name { display: block; font-weight: 800; color: #1e293b; font-size: 0.9rem; }
    .business-id { font-size: 0.75rem; color: #64748b; font-weight: 500; }

    .back-btn {
      margin: 1.5rem;
      padding: 0.75rem 1rem;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .back-btn:hover { background: #1e293b; transform: translateX(-4px); }

    .settings-nav { flex: 1; padding: 0 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 12px;
      color: #64748b;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-item:hover { background: #f1f5f9; color: #1e293b; }
    .nav-item.active { background: #7c3aed; color: white; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25); }
    .nav-item .icon { font-size: 1.1rem; width: 24px; text-align: center; }

    .sidebar-footer { padding: 1.5rem; border-top: 1px solid #f1f5f9; font-size: 0.75rem; color: #94a3b8; }
    .sidebar-footer .badges { display: flex; gap: 1rem; margin-top: 0.5rem; }

    /* MAIN CONTENT */
    .settings-main { flex: 1; overflow-y: auto; padding: 2rem 3rem; }

    .settings-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .settings-header h1 { margin: 0; font-size: 1.75rem; font-weight: 800; }
    .settings-header p { margin: 0.25rem 0 0; color: #64748b; font-size: 0.9rem; }

    .header-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; }
    .action-group { display: flex; align-items: center; gap: 0.75rem; }

    .btn { padding: 0.625rem 1.25rem; border-radius: 10px; font-weight: 700; font-size: 0.85rem; border: 1.5px solid transparent; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #7c3aed; color: white; }
    .btn-primary:hover { background: #6d28d9; }
    .btn-secondary { background: white; border-color: #e2e8f0; color: #64748b; }
    .btn-create { background: #f97316; color: white; }
    .btn-text { background: transparent; border: none; color: #64748b; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
    .btn-text:hover { color: #1e293b; }
    .btn-indigo { background: #4f46e5; color: white; padding: 0.5rem 1rem; }

    .settings-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }

    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.85rem; font-weight: 700; color: #475569; }
    .required { color: #ef4444; }

    input, select, textarea { 
      padding: 0.75rem 1rem; 
      border: 1.5px solid #e2e8f0; 
      border-radius: 12px; 
      font-size: 0.95rem; 
      transition: all 0.2s; 
      background: white;
    }
    input:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1); }

    .form-row { display: flex; gap: 1rem; }
    .form-row.split > div { flex: 1; }
    .form-row.tri > div { flex: 1; }

    .logo-upload-box { margin-bottom: 2rem; }
    .dashed-border {
      border: 2px dashed #cbd5e1;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      background: #f8fafc;
      transition: all 0.2s;
      cursor: pointer;
    }
    .dashed-border:hover { border-color: #7c3aed; background: rgba(124, 58, 237, 0.02); }
    .upload-icon { font-size: 2rem; margin-bottom: 0.5rem; display: block; }
    .dashed-border p { margin: 0; font-weight: 700; color: #334155; font-size: 0.9rem; }
    .dashed-border span { font-size: 0.75rem; color: #94a3b8; }

    .toggle-section { margin: 2rem 0; }
    .radio-group { display: flex; gap: 2rem; margin-top: 0.75rem; }
    .radio-item { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 600; color: #475569; }
    .radio-item input { width: 18px; height: 18px; }

    .feature-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #f1f5f9;
      border-radius: 12px;
      font-weight: 700;
      color: #334155;
    }
    .badge-new { background: #4f46e5; color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; }

    /* Switch */
    .switch { position: relative; display: inline-block; width: 44px; height: 24px; margin-left: auto; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; transition: .4s; border-radius: 34px; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background: #7c3aed; }
    input:checked + .slider:before { transform: translateX(20px); }

    .separator-text { font-size: 0.8rem; color: #64748b; font-weight: 500; font-style: italic; margin: 2rem 0 1rem; }

    .signature-area { height: 120px; display: flex; align-items: center; justify-content: center; }
    .btn-link { background: none; border: none; cursor: pointer; font-weight: 700; font-size: 0.85rem; margin-top: 0.5rem; }
    .danger { color: #ef4444; }

    .business-details-box { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; }
    .box-header { font-weight: 800; color: #1e293b; font-size: 0.95rem; }
    .box-subtitle { font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; margin-bottom: 1.5rem; }
    
    .detail-row { display: flex; align-items: center; gap: 0.75rem; }
    .detail-row input.key { flex: 1; }
    .detail-row input.val { flex: 2; }

    .gradient-text {
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `]
})
export class BusinessSettingsComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
