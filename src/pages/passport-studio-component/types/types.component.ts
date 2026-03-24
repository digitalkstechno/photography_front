import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-types',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ FIX
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent {

  @Input() types: any[] = [];
  @Output() select = new EventEmitter();

  selected: any;

  choose(t: any) {
    this.selected = t;
    this.select.emit(t);
  }
}
