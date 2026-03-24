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

  gridItems = Array(8).fill(0);
}
