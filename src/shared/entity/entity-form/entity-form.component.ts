import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityConfig, EntityField, EntitySelectOption } from '../../../core/entity/entity.types';
import { unflattenObject } from '../../unflatten';
import { InputRendererComponent } from '../input-renderer/input-renderer.component';
import { EntityService } from '../../../core/entity/entity.service';
import { getEntityConfig } from '../../../core/entity/entities';

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputRendererComponent],
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.css'],
})
export class EntityFormComponent {

  @Input() entity!: EntityConfig;

  @Input() model: any = {};

  @Output() modelChange = new EventEmitter<any>();

  @Input() submitLabel = 'Save';

  @Output() cancelEvent = new EventEmitter<void>();

  @Input() submitFn!: (data: any) => Promise<any>;

  loading = false;
  message = '';

  constructor(private entityService: EntityService) {}

  async ngOnInit() {
    await this.populateRelationOptions();
  }

  onFieldChange(field: string, value: any) {
    this.model[field] = value;
    this.modelChange.emit(this.model);
  }

  private async populateRelationOptions() {
    if (!this.entity?.fields?.length) return;

    const updatedFields = await Promise.all(
      this.entity.fields.map(async (field) => {

        if (field.type !== 'relation' || !field.relation) return field;

        const relatedEntityConfig = getEntityConfig(field.relation.entity);
        if (!relatedEntityConfig) return field;

        try {

          const response = await this.entityService.list(relatedEntityConfig);

          const records = Array.isArray(response)
            ? response
            : (response?.data ?? []);

          const valueKey =
            field.relation.valueKey ??
            relatedEntityConfig.idKey ??
            '_id';

          const labelKey =
            field.relation.labelKey ??
            'name';

          const options: EntitySelectOption[] = records.map((record: any) => ({
            value: record?.[valueKey],
            label: String(record?.[labelKey] ?? record?.[valueKey] ?? ''),
          }));

          return { ...field, options };

        } catch {
          return field;
        }

      })
    );

    this.entity = { ...this.entity, fields: updatedFields as EntityField[] };
  }

  async submit(formIsValid: boolean) {

    if (!formIsValid) return;

    try {

      this.loading = true;
      this.message = '';

      const normalizedModel = unflattenObject(this.model);

      await this.submitFn(normalizedModel);

      this.message = '✅ Saved successfully';

    } catch (error: any) {

      this.message =
        error?.error?.message ||
        error?.message ||
        '❌ Failed';

    } finally {

      this.loading = false;

    }

  }

  cancel() {
    this.cancelEvent.emit();
  }
}
