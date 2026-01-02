import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField } from './form.types';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.css'] // ✅ THIS
})
export class DynamicFormComponent {

  @Input() fields: FormField[] = [];
  @Input() model: any = {};
  @Input() submitFn!: (data: any) => Promise<any>;
  @Input() submitLabel = 'Save';

  loading = false;
  message = '';

  async submit() {
    try {
      this.loading = true;
      this.message = '';
      await this.submitFn(this.model);
      this.message = '✅ Saved successfully';
    } catch (err: any) {
      this.message = err?.error?.error || '❌ Failed';
    } finally {
      this.loading = false;
    }
  }
}
