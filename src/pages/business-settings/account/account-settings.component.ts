import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService, StudioConfig } from '../../../core/services/settings.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="account-settings animate-fade-in">
      <header class="section-header">
        <h2 class="section-title">Personal Profile & Security</h2>
        <p class="section-subtitle">Manage your identity and studio-wide login security</p>
      </header>

      <div class="settings-grid mt-6">
        <!-- PROFILE SECTION -->
        <div class="settings-card shadow-sm">
          <div class="profile-header">
            <div class="avatar-edit-large shadow-premium">
              <span>AD</span>
              <button class="badge-edit">📸</button>
            </div>
            <div class="profile-stats mt-4">
              <div class="stat-label">Security Health: <span class="text-success font-bold">Excellent (92%)</span></div>
              <div class="health-bar"><div class="fill" style="width: 92%;"></div></div>
            </div>
          </div>

          <form [formGroup]="accountForm" class="mt-6">
            <div class="form-group">
              <label>Full Display Name</label>
              <input type="text" formControlName="fullName" placeholder="Enter your full name">
            </div>
            
            <div class="form-group">
              <label>Professional Bio</label>
              <textarea formControlName="bio" rows="3" placeholder="Describe your role in the studio..."></textarea>
            </div>

            <div class="social-links-area mt-4">
               <h4 class="sub-title">Connect Studio Socials</h4>
               <div class="social-input">
                 <span class="s-icon">📸</span>
                 <input type="text" formControlName="instagram" placeholder="Instagram Handle">
               </div>
               <div class="social-input mt-2">
                 <span class="s-icon">🌐</span>
                 <input type="text" formControlName="website" placeholder="Studio Website">
               </div>
            </div>
          </form>
        </div>

        <!-- SECURITY & AUTH -->
        <div class="settings-card shadow-sm bg-security">
          <h3 class="card-title">🔐 Login & Security</h3>
          
          <div class="feature-item">
            <div class="f-info">
              <span class="f-title">Multi-Factor Authentication</span>
              <p>Secure your login with SMS or Authenticator App</p>
            </div>
            <label class="switch sm"><input type="checkbox" checked><span class="slider"></span></label>
          </div>

          <div class="feature-item mt-4">
            <div class="f-info">
              <span class="f-title">Session Management</span>
              <p>Logged in from 3 devices (Mumbai, Delhi, Bengaluru)</p>
            </div>
            <button class="btn btn-text-danger">Logout All</button>
          </div>

          <div class="password-box mt-6">
             <h4 class="sub-title">Update Password</h4>
             <div class="form-group">
               <label>Current Password</label>
               <input type="password" placeholder="••••••••">
             </div>
             <div class="form-group">
               <label>New Password</label>
               <input type="password" placeholder="Min. 8 characters">
             </div>
             <button class="btn btn-secondary w-full">Change Password</button>
          </div>
        </div>
      </div>
      
      <div class="sticky-save-bar">
         <p>Click save to update your personal profile</p>
         <button class="btn btn-primary" (click)="save()">Save Profile Changes</button>
      </div>
    </div>
  `,
  styles: [`
    .account-settings { padding: 1rem 0; }
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .settings-card { background: white; padding: 2rem; border-radius: 20px; border: 1.5px solid #f1f5f9; }
    .bg-security { background: rgba(124, 58, 237, 0.01); border-color: rgba(124, 58, 237, 0.1); }
    
    .avatar-edit-large { width: 120px; height: 120px; background: #7c3aed; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 800; margin: 0 auto; position: relative; }
    .badge-edit { position: absolute; bottom: 0; right: 0; width: 36px; height: 36px; border-radius: 50%; background: white; border: 1.5px solid #e2e8f0; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    
    .health-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 0.5rem; }
    .health-bar .fill { height: 100%; background: #10b981; border-radius: 3px; }
    
    .sub-title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin: 1.5rem 0 0.75rem; font-weight: 800; }
    .social-input { display: flex; align-items: center; gap: 0.75rem; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.5rem 1rem; background: #f8fafc; }
    .social-input:focus-within { border-color: #7c3aed; background: white; }
    .social-input input { border: none; background: transparent; font-size: 0.9rem; flex: 1; padding: 0; }
    .social-input input:focus { outline: none; }

    .feature-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
    .f-title { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    .f-info p { margin: 2px 0 0; font-size: 0.75rem; color: #64748b; }
    
    .btn-text-danger { background: transparent; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 700; cursor: pointer; }
    .sticky-save-bar { margin-top: 3rem; padding: 1.5rem; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: space-between; }
    .sticky-save-bar p { font-size: 0.85rem; color: #64748b; font-weight: 500; }
    
    .text-success { color: #10b981; }
    .shadow-premium { box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.15); }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AccountSettingsComponent implements OnInit {
  accountForm: FormGroup;

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    const config = this.settingsService.getConfig().account;
    this.accountForm = this.fb.group({
      fullName: [config.fullName],
      bio: [config.bio],
      instagram: [config.socials.instagram],
      website: [config.socials.website]
    });
  }

  ngOnInit() {}

  save() {
    const val = this.accountForm.value;
    this.settingsService.updateConfig({
      account: {
        ...this.settingsService.getConfig().account,
        fullName: val.fullName,
        bio: val.bio,
        socials: {
          ...this.settingsService.getConfig().account.socials,
          instagram: val.instagram,
          website: val.website
        }
      }
    });
    alert('Account profile has been saved with absolute precision! 🚀');
  }
}
