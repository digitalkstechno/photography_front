import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HealthAdviceService } from '../../core/blog.service';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormField } from '../../shared/dynamic-form/form.types';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  templateUrl: 'blog.component.html',
  imports: [DynamicFormComponent]
})
export class AddBlogComponent {

  submitLabel = 'Add Blog';

  model: any = {
    title: '',
    slug: '',
    category: 'general',
    badge: '',
    summary: '',
    coverImage: '',
    readTimeMin: 1,
    isPublished: false
  };

  fields: FormField[] = [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'text',
      required: true
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Digestive', value: 'digestive' },
        { label: 'Mental', value: 'mental' },
        { label: 'Heart', value: 'heart' }
      ]
    },
    {
      key: 'badge',
      label: 'Badge',
      type: 'text'
    },
    {
      key: 'summary',
      label: 'Summary',
      type: 'textarea'
    },
    {
      key: 'coverImage',
      label: 'Cover Image URL',
      type: 'text',
      required: true
    },
    {
      key: 'readTimeMin',
      label: 'Read Time (min)',
      type: 'number'
    },
    {
      key: 'isPublished',
      label: 'Publish',
      type: 'checkbox'
    }
  ];

  constructor(private blogService: HealthAdviceService) {}

  submitBlog = async (data: any) => {
    return await firstValueFrom(
      this.blogService.createHealthAdvice(data)
    );
  };
}
