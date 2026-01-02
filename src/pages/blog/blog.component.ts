import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-blog',
  imports: [
    BrowserModule,
    FormsModule        // ✅ REQUIRED
  ],
  templateUrl: './blog.component.html'
})
export class AddBlogComponent {
  loading = false;
  message = '';

  blog = {
    title: '',
    slug: '',
    category: 'general',
    badge: '',
    summary: '',
    coverImage: '',
    readTimeMin: 5,
    isPublished: false
  };

  constructor(private http: HttpClient) { }

  submit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;
    this.message = '';

    const token = localStorage.getItem('token');

    const payload = {
      ...this.blog,
      publishedAt: this.blog.isPublished
        ? new Date().toISOString()
        : null
    };

    this.http.post('/api/health-advice', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        this.message = '✅ Blog added';
        this.loading = false;
        form.resetForm({
          category: 'general',
          readTimeMin: 5,
          isPublished: false
        });
      },
      error: (err) => {
        this.message = err.error?.message || '❌ Failed to add blog';
        this.loading = false;
      }
    });
  }
}
