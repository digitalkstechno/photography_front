import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalOptions {
  title: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalSubject = new Subject<any>();
  modalState$ = this.modalSubject.asObservable();

  private confirmResolver: ((value: boolean) => void) | null = null;

  /**
   * Show an informational alert
   */
  info(title: string, message: string) {
    this.modalSubject.next({ title, message, type: 'info', confirmText: 'OK' });
  }

  /**
   * Show a success alert
   */
  success(title: string, message: string) {
    this.modalSubject.next({ title, message, type: 'success', confirmText: 'Done' });
  }

  /**
   * Show an error alert
   */
  error(title: string, message: string) {
    this.modalSubject.next({ title, message, type: 'error', confirmText: 'Understood' });
  }

  /**
   * Show a confirmation dialog with Promise-based results
   */
  confirm(title: string, message: string, confirmText = 'Yes, Confirm', cancelText = 'No, Cancel'): Promise<boolean> {
    this.modalSubject.next({ 
      title, 
      message, 
      type: 'confirm', 
      confirmText, 
      cancelText 
    });

    return new Promise((resolve) => {
      this.confirmResolver = resolve;
    });
  }

  /**
   * Internal callback for the component
   */
  resolveConfirmation(result: boolean) {
    if (this.confirmResolver) {
      this.confirmResolver(result);
      this.confirmResolver = null;
    }
    this.modalSubject.next(null); // Close modal
  }
}
