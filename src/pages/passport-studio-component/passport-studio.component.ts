import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TypesComponent } from './types/types.component';
import { ControlsComponent } from './controls/controls.component';
import { PreviewComponent } from './preview/preview.component';
import { GenerateComponent } from './generate/generate.component';
import { GridPreviewComponent } from './grid-preview/grid-preview.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-passport-studio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TypesComponent,
    PreviewComponent,
    GenerateComponent,
    GridPreviewComponent
  ],
  templateUrl: './passport-studio.component.html',
  styleUrl: './passport-studio.component.css'
})
export class PassportStudioComponent {

  image: HTMLImageElement | null = null;
  croppedImage: string | null = null;

  zoom = 1;
  brightness = 100;
  contrast = 100;

  selectedType: any = null;

  photoTypes = [
    { name: 'India Passport', width_mm: 35, height_mm: 45, category: 'Passport', isPriority: true },
    { name: 'USA Visa', width_mm: 51, height_mm: 51, category: 'Visa', isPriority: true },
    { name: 'Canada Visa', width_mm: 50, height_mm: 70, category: 'Visa', isPriority: true }
  ].sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0));

  onImageLoaded(img: HTMLImageElement) {
    this.image = img;
  }

  onCropChange(dataUrl: string) {
    this.croppedImage = dataUrl;
  }

  onControlsChange(data: any) {
    this.zoom = data.zoom;
    this.brightness = data.brightness;
    this.contrast = data.contrast;
  }

  onTypeSelect(type: any) {
    this.selectedType = type;
  }

  async generate() {
    if (!this.croppedImage) {
      alert('Please upload and select a photo type first.');
      return;
    }

    try {
      const response = await fetch(`${environment.apiUrl}/prints/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: this.croppedImage })
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passport-print.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error(error);
      alert('Error generating print layout');
    }
  }
}
