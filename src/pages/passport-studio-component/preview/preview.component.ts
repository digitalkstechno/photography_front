import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  imports: [CommonModule], // ✅ FIX
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() image!: HTMLImageElement | null;
  @Input() zoom!: number;
  @Input() brightness!: number;
  @Input() contrast!: number;
  @Input() selectedType: any;

  @Output() imageLoaded = new EventEmitter<HTMLImageElement>();
  @Output() cropChange = new EventEmitter<string>();
  @Output() zoomChange = new EventEmitter<number>();

  offsetX = 0;
  offsetY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  onFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = async () => {
      this.imageLoaded.emit(img);
      this.image = img;
      
      try {
        if ('FaceDetector' in window) {
          const detector = new (window as any).FaceDetector();
          const faces = await detector.detect(img);
          if (faces && faces.length > 0) {
            const face = faces[0].boundingBox;
            const targetFaceWidthOnCanvas = 200 * 0.45;
            const calculatedZoom = targetFaceWidthOnCanvas / face.width;
            
            const faceCX = face.x + face.width / 2;
            const faceCY = face.y + face.height / 2;
            
            this.zoom = calculatedZoom;
            this.offsetX = calculatedZoom * (img.width / 2 - faceCX);
            // shift slightly higher for passport layout
            this.offsetY = calculatedZoom * (img.height / 2 - faceCY) + 20;

            this.zoomChange.emit(this.zoom);
          }
        }
      } catch (e) {
        console.warn('FaceDetector error', e);
      }

      this.scheduleRender();
      setTimeout(() => this.exportCrop(), 100);
    };
    img.src = URL.createObjectURL(file);
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

  ngOnChanges() {
    this.scheduleRender();
    if (!this.isDragging) {
      setTimeout(() => this.exportCrop(), 0);
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

    ctx.strokeStyle = 'green';
    ctx.strokeRect(
      canvas.width / 2 - cropW / 2,
      canvas.height / 2 - cropH / 2,
      cropW,
      cropH
    );
  }
}
