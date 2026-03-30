import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StudioConfig {
  account: {
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    socials: { instagram: string; facebook: string; website: string; };
  };
  business: {
    name: string;
    phone: string;
    email: string;
    address: string;
    gstRegistered: boolean;
    registrationType: string;
    industry: string;
  };
  invoices: {
    prefix: string;
    dueDays: number;
    currency: string;
    taxSlabs: number[];
    roundOff: string;
    terms: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private initialConfig: StudioConfig = {
    account: {
      fullName: 'System Administrator',
      email: 'admin@studiopro.com',
      phone: '+91 9876543210',
      bio: 'Professional Photographer & Studio Lead',
      socials: { instagram: '@studiopro', facebook: 'fb.com/studiopro', website: 'www.studiopro.com' }
    },
    business: {
      name: 'Studio Pro',
      phone: '1231231231',
      email: 'contact@studiopro.com',
      address: '123 Photography Lane, Creative Hub, Mumbai - 400001',
      gstRegistered: true,
      registrationType: 'Private Limited Company',
      industry: 'Photography & Videography'
    },
    invoices: {
      prefix: 'STUDIO/2024/',
      dueDays: 7,
      currency: 'INR (₹)',
      taxSlabs: [5, 12, 18, 28],
      roundOff: 'Nearest',
      terms: '50% Advance is non-refundable. Final photos after full payment.'
    }
  };

  private configSubject = new BehaviorSubject<StudioConfig>(this.initialConfig);

  get config$(): Observable<StudioConfig> {
    return this.configSubject.asObservable();
  }

  updateConfig(newConfig: Partial<StudioConfig>) {
    const current = this.configSubject.value;
    this.configSubject.next({ ...current, ...newConfig });
  }

  getConfig(): StudioConfig {
    return this.configSubject.value;
  }
}
