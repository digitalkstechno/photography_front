import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  modalData: any = null;
  private sub = new Subscription();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.sub.add(
      this.modalService.modalState$.subscribe(data => {
        this.modalData = data;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  confirm() {
    this.modalService.resolveConfirmation(true);
  }

  cancel() {
    this.modalService.resolveConfirmation(false);
  }

  getIcon() {
    switch(this.modalData?.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'confirm': return '❓';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }
}
