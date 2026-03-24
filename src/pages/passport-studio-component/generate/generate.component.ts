import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-generate',
    imports: [CommonModule], // ✅ FIX
  template: `<button (click)="generate.emit()">Generate Print</button>`
})
export class GenerateComponent {
  @Output() generate = new EventEmitter();
}
