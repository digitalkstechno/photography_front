import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField } from './form.types';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent {

  @Input() fields: FormField[] = [];
  @Input() model: any = {};
  @Input() submitFn!: (data: any) => Promise<any>;
  @Input() submitLabel = 'Save';

  loading = false;
  message = '';

  /**
   * 🔥 FIX: convert flat dot-keys into nested objects
   * Example:
   * { "profile.specialization": "Cardio" }
   * → { profile: { specialization: "Cardio" } }
   */
  private unflatten(data: any) {
    const result: any = {};

    Object.keys(data).forEach(key => {
      if (!key.includes('.')) {
        result[key] = data[key];
        return;
      }

      const parts = key.split('.');
      let current = result;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = data[key];
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    });

    return result;
  }

  async submit() {
    try {
      this.loading = true;
      this.message = '';

      // 🔥 ONLY CHANGE THAT MATTERS
      const normalizedData = this.unflatten(this.model);

      await this.submitFn(normalizedData);

      this.message = '✅ Saved successfully';
    } catch (err: any) {
      this.message =
        err?.error?.message ||
        err?.message ||
        '❌ Failed';
    } finally {
      this.loading = false;
    }
  }
}
