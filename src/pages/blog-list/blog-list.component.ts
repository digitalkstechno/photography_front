import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HealthAdviceService } from '../../core/blog.service';
import { TableComponent } from "../../shared/components/table/table.component";

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  imports: [TableComponent]
})
export class BlogListComponent {

  columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'badge', label: 'Badge' },
    { key: 'readTimeMin', label: 'Read Time' },
    { key: 'isPublished', label: 'Published' }
  ];

  constructor(private blogService: HealthAdviceService) {}

  fetchBlogs = async () => {
    return await firstValueFrom(
      this.blogService.getHealthAdviceCards()
    );
  };
}
