import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ FIX
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent {

  zoom = 1;
  brightness = 100;
  contrast = 100;

  @Output() change = new EventEmitter();

  emit() {
    this.change.emit({
      zoom: this.zoom,
      brightness: this.brightness,
      contrast: this.contrast
    });
  }
}
