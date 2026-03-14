import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityField } from '../../../core/entity/entity.types';

@Component({
  selector: 'app-input-renderer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-renderer.component.html',
  styleUrls: ['./input-renderer.component.css'],
})
export class InputRendererComponent {
  @Input() field!: EntityField;
  @Input() model: any = {};
  @Output() modelChange = new EventEmitter<any>();

  get key() {
    return this.field?.name;
  }

  onModelChange() {
    this.modelChange.emit(this.model);
  }
}

