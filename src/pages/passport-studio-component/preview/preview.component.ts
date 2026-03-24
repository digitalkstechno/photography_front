import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as faceapi from '@vladmandic/face-api';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  imports: [CommonModule], // ✅ FIX
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() image!: HTMLImageElement | null;
  @Input() zoom!: number;
  @Input() brightness!: number;
  @Input() contrast!: number;
  @Input() selectedType: any;

  @Output() imageLoaded = new EventEmitter<HTMLImageElement>();
  @Output() cropChange = new EventEmitter<string>();
  @Output() zoomChange = new EventEmitter<number>();
  @Output() validationChange = new EventEmitter<{valid: boolean, reasons: string[]}>();

  offsetX = 0;
  offsetY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;
  
  modelsLoaded = false;
  cachedDetection: any = null;

  async ngOnInit() {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    ]);
    this.modelsLoaded = true;
  }

  onFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = async () => {
      this.imageLoaded.emit(img);
      this.image = img;
      
      try {
        if (this.modelsLoaded) {
          this.cachedDetection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
          this.applyFaceConstraints();
        }
      } catch (e) {
        console.warn('FaceAPI detection error', e);
        this.scheduleRender();
        setTimeout(() => this.exportCrop(), 100);
      }
    };
    img.src = URL.createObjectURL(file);
  }

  applyFaceConstraints() {
    if (!this.image) {
      this.scheduleRender();
      return;
    }
    if (!this.cachedDetection) {
      this.scheduleRender();
      setTimeout(() => this.exportCrop(), 100);
      return;
    }

    const landmarks = this.cachedDetection.landmarks;
    const box = this.cachedDetection.alignedRect.box;
    
    const jawOutline = landmarks.getJawOutline();
    const chin = jawOutline[8];

    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const avgEyeY = (leftEye.reduce((s: number, p: any) => s + p.y, 0)/leftEye.length + rightEye.reduce((s: number, p: any) => s + p.y, 0)/rightEye.length) / 2;

    const headTop = box.y;
    const headBottom = chin.y;
    const headHeight = headBottom - headTop;

    const [minHR, maxHR] = this.selectedType?.head_ratio || [0.60, 0.80];
    const [minEye, maxEye] = this.selectedType?.eye_position || [0.50, 0.70];

    // Target the absolute center of the valid bounds to be safe
    const headPercent = (minHR + maxHR) / 2;
    const eyePercent = (minEye + maxEye) / 2;
    
    const ratio = this.selectedType && this.selectedType.height_mm ? this.selectedType.width_mm / this.selectedType.height_mm : 35/45;
    const cropH = 200 / ratio;

    this.zoom = (cropH * headPercent) / headHeight;
    this.offsetX = this.zoom * (this.image.width / 2 - (box.x + box.width/2));
    this.offsetY = this.zoom * (this.image.height / 2 - avgEyeY) + cropH * (0.5 - eyePercent);

    this.zoomChange.emit(this.zoom);
    this.scheduleRender();
    setTimeout(() => this.exportCrop(), 100);
  }

  onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.startX = e.offsetX - this.offsetX;
    this.startY = e.offsetY - this.offsetY;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    this.offsetX = e.offsetX - this.startX;
    this.offsetY = e.offsetY - this.startY;
    this.scheduleRender();
  }

  onMouseUp() {
    this.isDragging = false;
    this.exportCrop();
  }

  ngOnChanges(changes: any) {
    if (changes['selectedType'] && !changes['selectedType'].firstChange) {
      this.applyFaceConstraints();
    } else {
      this.scheduleRender();
      if (!this.isDragging) {
        setTimeout(() => this.exportCrop(), 0);
      }
    }
  }

  exportCrop() {
    if (!this.image) return;

    const canvas = document.createElement('canvas');
    const ratio = this.selectedType && this.selectedType.height_mm
      ? this.selectedType.width_mm / this.selectedType.height_mm
      : 35 / 45;
    
    canvas.height = 600;
    canvas.width = 600 * ratio;

    const ctx = canvas.getContext('2d')!;
    
    // Exact crop match
    const cropW = 200;
    const cropH = cropW / ratio;
    
    const cropX = 400 / 2 - cropW / 2;
    const cropY = 500 / 2 - cropH / 2;

    const imgW = this.image.width * this.zoom;
    const imgH = this.image.height * this.zoom;
    const imgX = (400 - imgW) / 2 + this.offsetX;
    const imgY = (500 - imgH) / 2 + this.offsetY;

    const scale = canvas.width / cropW;
    
    ctx.filter = `brightness(${this.brightness}%) contrast(${this.contrast}%)`;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(
      this.image, 
      (imgX - cropX) * scale, 
      (imgY - cropY) * scale, 
      imgW * scale, 
      imgH * scale
    );

    this.cropChange.emit(canvas.toDataURL('image/jpeg', 0.9));
  }

  private renderPending = false;

  scheduleRender() {
    if (!this.renderPending) {
      this.renderPending = true;
      requestAnimationFrame(() => {
        this.render();
        this.renderPending = false;
      });
    }
  }

  render() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!this.image) return;

    const w = this.image.width * this.zoom;
    const h = this.image.height * this.zoom;

    const x = (canvas.width - w) / 2 + this.offsetX;
    const y = (canvas.height - h) / 2 + this.offsetY;

    ctx.filter = `brightness(${this.brightness}%) contrast(${this.contrast}%)`;
    ctx.drawImage(this.image, x, y, w, h);

    // dynamic crop
    const ratio = this.selectedType && this.selectedType.height_mm
      ? this.selectedType.width_mm / this.selectedType.height_mm
      : 35 / 45;

    const cropW = 200;
    const cropH = cropW / ratio;

    const cropX = canvas.width / 2 - cropW / 2;
    const cropY = canvas.height / 2 - cropH / 2;
    const drawY = canvas.height / 2 - h / 2 + this.offsetY;
    
    // Validate Real-Time Constraints
    let strokeColor = 'rgba(0, 255, 0, 0.8)';
    if (this.cachedDetection && this.image) {
      let valid = true;
      let reasons: string[] = [];

      const box = this.cachedDetection.alignedRect.box;
      const landmarks = this.cachedDetection.landmarks;
      const chin = landmarks.getJawOutline()[8];
      const headHeight = chin.y - box.y;
      
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();
      const avgEyeY = (leftEye.reduce((s:number, p:any) => s + p.y, 0)/leftEye.length + rightEye.reduce((s:number, p:any) => s + p.y, 0)/rightEye.length) / 2;

      const currentHeadRatio = (headHeight * this.zoom) / cropH;
      
      const eyeTopY = (drawY + avgEyeY * this.zoom) - cropY;
      const eyeDistFromBottom = cropH - eyeTopY;
      const currentEyeRatio = eyeDistFromBottom / cropH;

      const [minHR, maxHR] = this.selectedType?.head_ratio || [0.6, 0.8];
      const [minEye, maxEye] = this.selectedType?.eye_position || [0.5, 0.7];

      if (currentHeadRatio < minHR) { valid = false; reasons.push(`Face too small (needs ${Math.round(minHR*100)}%)`); }
      if (currentHeadRatio > maxHR) { valid = false; reasons.push(`Face too large (max ${Math.round(maxHR*100)}%)`); }
      if (currentEyeRatio < minEye) { valid = false; reasons.push(`Eyes too low (needs ${Math.round(minEye*100)}% from bottom)`); }
      if (currentEyeRatio > maxEye) { valid = false; reasons.push(`Eyes too high (max ${Math.round(maxEye*100)}% from bottom)`); }

      this.validationChange.emit({ valid, reasons });
      if (!valid) strokeColor = 'rgba(255, 0, 0, 0.8)';
    }

    // Draw framing mask (darken everything outside crop box)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height); // Outer rect
    ctx.rect(cropX, cropY, cropW, cropH);        // Inner rect hole
    ctx.fill('evenodd'); // Fills the area between outer and inner perfectly without clearing the image below

    // Draw crop box border
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cropX, cropY, cropW, cropH);
    ctx.setLineDash([]); // reset

    // Draw Overlays inside crop box (Visual Safe Zones)
    if (this.selectedType) {
      const [minHR, maxHR] = this.selectedType.head_ratio || [0.6, 0.8];
      const [minEye, maxEye] = this.selectedType.eye_position || [0.5, 0.7];

      // Draw Eye Zone Dashed Lines
      const minEyeY = cropY + cropH - (maxEye * cropH);
      const maxEyeY = cropY + cropH - (minEye * cropH);
      
      ctx.strokeStyle = strokeColor === 'rgba(0, 255, 0, 0.8)' ? 'rgba(0,255,0,0.5)' : 'rgba(255,0,0,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      
      ctx.beginPath();
      ctx.moveTo(cropX, minEyeY);
      ctx.lineTo(cropX + cropW, minEyeY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cropX, maxEyeY);
      ctx.lineTo(cropX + cropW, maxEyeY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Faint "Safe Face" oval guide (centered)
      const targetFaceH = cropH * ((minHR + maxHR) / 2);
      const targetFaceW = targetFaceH * 0.7; // standard human face aspect ratio roughly 1:1.4
      const centerX = cropX + cropW / 2;
      const centerY = cropY + cropH / 2 + 10; 
      
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, targetFaceW/2, targetFaceH/2, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}
