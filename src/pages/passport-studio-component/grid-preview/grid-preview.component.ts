import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid-preview.component.html',
  styleUrls: ['./grid-preview.component.css']
})
export class GridPreviewComponent {
  @Input() croppedImage: string | null = null;
  @Input() paperType: string = 'A4';
  @Input() layout: { cols: number, rows: number } = { cols: 4, rows: 2 };

  get gridItems() {
    return Array(this.layout.cols * this.layout.rows).fill(0);
  }

  get gridStyle() {
    return {
      'grid-template-columns': `repeat(${this.layout.cols}, 1fr)`
    };
  }
}
