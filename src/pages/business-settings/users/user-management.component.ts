import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="user-management animate-fade-in">
      <header class="section-header">
        <h2 class="section-title">Team & Access Control</h2>
        <p class="section-subtitle">Invite studio members and define granular permission levels</p>
      </header>

      <!-- INVITE BAR -->
      <div class="invite-banner mt-6 shadow-sm">
         <div class="invite-info">
            <span class="invite-icon">🔗</span>
            <div class="invite-text">
               <span class="iv-title">Studio Invite Link</span>
               <p>Anyone with this link can request to join as Staff</p>
            </div>
         </div>
         <div class="invite-action">
            <input type="text" value="studiopro.com/invite/8k29x1" readonly class="invite-input">
            <button class="btn btn-indigo">Copy Link</button>
            <button class="btn btn-secondary">Regenerate</button>
         </div>
      </div>

      <div class="settings-grid mt-8">
        <!-- USER LIST -->
        <div class="settings-card shadow-sm full-width">
          <div class="card-header-flex">
            <h3 class="card-title">👥 Active Members (3)</h3>
            <button class="btn btn-primary">+ Invite via Email</button>
          </div>

          <div class="user-table-wrap mt-4">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr class="user-row active">
                  <td>
                    <div class="u-profile">
                      <div class="u-avatar">AD</div>
                      <div class="u-meta">
                        <span class="u-name">System Admin</span>
                        <span class="u-phone">+91 98765 43210</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-admin">Master Admin</span></td>
                  <td><span class="p-pill">All Access</span></td>
                  <td><span class="status-online"></span> Just now</td>
                  <td><button class="btn-icon">⚙️</button></td>
                </tr>
                <tr class="user-row">
                  <td>
                    <div class="u-profile">
                      <div class="u-avatar bg-staff">RS</div>
                      <div class="u-meta">
                        <span class="u-name">Rahul Sharma</span>
                        <span class="u-phone">+91 99887 76655</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-staff">Staff</span></td>
                  <td><span class="p-pill">Sales, Jobs</span></td>
                  <td>2h ago</td>
                  <td><button class="btn-icon" (click)="editingPermissions = true">⚙️</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PERMISSION MATRIX (HIDDEN BY DEFAULT OR SHOWN ON EDIT) -->
        <div class="settings-card shadow-sm animate-slide-up" *ngIf="editingPermissions">
          <div class="card-header-flex">
             <h3 class="card-title">🛡️ Permissions: Rahul Sharma</h3>
             <button class="btn-sm-text" (click)="editingPermissions = false">Done Editing</button>
          </div>
          
          <div class="permission-matrix mt-6">
            <div class="matrix-header">
               <span>Module</span>
               <span>View</span>
               <span>Edit</span>
               <span>Delete</span>
            </div>
            
            <div class="matrix-row" *ngFor="let mod of modules">
               <span class="m-name">{{mod}}</span>
               <label class="check-container"><input type="checkbox" checked><span class="checkmark"></span></label>
               <label class="check-container"><input type="checkbox" checked><span class="checkmark"></span></label>
               <label class="check-container"><input type="checkbox"><span class="checkmark"></span></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-management { padding: 1rem 0; }
    .invite-banner { background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 20px; padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
    .invite-info { display: flex; align-items: center; gap: 1rem; }
    .invite-icon { font-size: 2rem; }
    .iv-title { font-weight: 800; color: #1e293b; font-size: 1rem; }
    .invite-text p { margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600; }
    .invite-action { display: flex; gap: 0.75rem; flex: 1; justify-content: flex-end; }
    .invite-input { background: white; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 0.6rem 1rem; font-size: 0.85rem; font-family: monospace; color: #4f46e5; width: 220px; }

    .settings-grid { display: flex; flex-direction: column; gap: 2rem; }
    .settings-card { background: white; padding: 2.5rem; border-radius: 24px; border: 1.5px solid #f1f5f9; }
    .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    
    /* Table Styling */
    .premium-table { width: 100%; border-collapse: collapse; }
    .premium-table th { background: #f8fafc; padding: 1rem 1.5rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 800; border-bottom: 1px solid #e2e8f0; }
    .premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
    
    .u-profile { display: flex; align-items: center; gap: 1rem; }
    .u-avatar { width: 44px; height: 44px; background: #7c3aed; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; }
    .bg-staff { background: #0ea5e9; }
    .u-name { display: block; font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    .u-phone { font-size: 0.75rem; color: #94a3b8; }
    
    .badge { padding: 4px 12px; border-radius: 30px; font-size: 0.75rem; font-weight: 800; }
    .badge-admin { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }
    .badge-staff { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
    .p-pill { background: #f1f5f9; color: #64748b; font-size: 0.7rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
    .status-online { display: inline-block; width: 7px; height: 7px; background: #10b981; border-radius: 50%; margin-right: 4px; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }

    /* Matrix */
    .permission-matrix { background: #f8fafc; border-radius: 16px; padding: 1.5rem; border: 1.5px solid #e2e8f0; }
    .matrix-header { display: grid; grid-template-columns: 1fr 60px 60px 60px; padding: 0.5rem 1rem; font-weight: 800; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.5rem; }
    .matrix-row { display: grid; grid-template-columns: 1fr 60px 60px 60px; padding: 0.75rem 1rem; align-items: center; border-bottom: 1px solid #e2e8f0; }
    .matrix-row:last-child { border: none; }
    .m-name { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
    
    /* Checkbox */
    .check-container { position: relative; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
    .check-container input { display: none; }
    .checkmark { width: 18px; height: 18px; border: 1.5px solid #cbd5e1; border-radius: 6px; background: white; transition: all 0.2s; cursor: pointer; }
    input:checked + .checkmark { background: #7c3aed; border-color: #7c3aed; }
    input:checked + .checkmark:after { content: "✓"; color: white; font-size: 0.7rem; display: block; text-align: center; line-height: 18px; }

    .btn-sm-text { background: transparent; border: none; color: #7c3aed; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; cursor: pointer; }
    .animate-slide-up { animation: slideUp 0.4s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class UserManagementComponent implements OnInit {
  editingPermissions: boolean = false;
  modules: string[] = ['Bookings', 'Sales (Quotation/Invoicing)', 'Finance (Accounts)', 'Inventory', 'Team Management'];

  constructor() {}

  ngOnInit() {}
}
