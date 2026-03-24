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
    { name: '🇵🇰 Pakistan - Passport / Visa / NICOP', width_mm: 35, height_mm: 45, category: 'Passport', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] },
    { name: '🇮🇳 India - Passport / Visa', width_mm: 35, height_mm: 45, category: 'Passport', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] },
    { name: '🇮🇳 India - OCI', width_mm: 51, height_mm: 51, category: 'Visa', head_ratio: [0.50, 0.69], eye_position: [0.56, 0.69] },
    { name: '🇨🇦 Canada - Visa', width_mm: 35, height_mm: 45, category: 'Visa', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] },
    { name: '🇨🇦 Canada - Passport / PR / Immigration', width_mm: 50, height_mm: 70, category: 'Passport', head_ratio: [0.44, 0.51], eye_position: [0.50, 0.65] },
    { name: '🇺🇸 USA - Visa / Passport', width_mm: 51, height_mm: 51, category: 'Visa', head_ratio: [0.50, 0.69], eye_position: [0.56, 0.69] },
    { name: '🇬🇧 UK - Passport / Visa', width_mm: 35, height_mm: 45, category: 'Passport', head_ratio: [0.65, 0.75], eye_position: [0.50, 0.70] },
    { name: '🇮🇹 Italy - Passport / Visa', width_mm: 35, height_mm: 45, category: 'Passport', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] },
    { name: '🇪🇸 Spain - Passport / Visa', width_mm: 35, height_mm: 45, category: 'Passport', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] },
    { name: '🇸🇦 Saudi Arabia - Visa / Umrah', width_mm: 35, height_mm: 45, category: 'Visa', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] },
    { name: '🇦🇪 UAE - Visa', width_mm: 40, height_mm: 60, category: 'Visa', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] },
    { name: '🇫🇷 France / Paris - Visa', width_mm: 35, height_mm: 45, category: 'Visa', head_ratio: [0.70, 0.80], eye_position: [0.50, 0.70] }
  ];

  layouts = [
    { label: '4x2 Standard (8)', cols: 4, rows: 2 },
    { label: '2x2 Small Grid (4)', cols: 2, rows: 2 },
    { label: '3x3 Grid (9)', cols: 3, rows: 3 }
  ];
  selectedLayout = this.layouts[0];

  validationStatus: { valid: boolean, reasons: string[] } = { valid: true, reasons: [] };

  onImageLoaded(img: HTMLImageElement) {
    this.image = img;
  }

  onValidationChange(status: { valid: boolean, reasons: string[] }) {
    this.validationStatus = status;
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

  onLayoutSelect(layout: any) {
    this.selectedLayout = layout;
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
        body: JSON.stringify({ 
          image: this.croppedImage,
          columns: this.selectedLayout.cols,
          rows: this.selectedLayout.rows,
          width_mm: this.selectedType?.width_mm || 35,
          height_mm: this.selectedType?.height_mm || 45,
          addBleed: true
        })
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
