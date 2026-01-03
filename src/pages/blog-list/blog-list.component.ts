import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TableComponent } from "../../shared/components/table/table.component";
import { HealthAdviceService } from '../../core/blog/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  standalone: true,
  imports: [TableComponent]
})
export class BlogListComponent {

  columns = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'badge', label: 'Badge' },
    { key: 'summary', label: 'Summary' },
    { key: 'coverImage', label: 'Cover Image' },
    { key: 'readTimeMin', label: 'Read Time (min)' },
    { key: 'publishedAt', label: 'Published At' }
  ];


  constructor(private blogService: HealthAdviceService) { }

  fetchBlogs = async () => {
    const blogs = await firstValueFrom(
      this.blogService.getHealthAdviceCards()
    );

    return blogs.map((blog: any) => ({
      ...blog,

      // fallback category (if not returned by API)
      category: blog.category ?? 'general',

      // derive published status
      isPublished: !!blog.publishedAt
    }));
  };
}
