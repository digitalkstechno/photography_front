import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ENTITIES } from '../core/entity/entities';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  entities = Object.values(ENTITIES).filter(e => e.sidebar !== false);

  constructor(private router: Router) {}

  get activeRouteLabel(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    
    // Check if it's an entity route
    const entityKey = url.split('/').pop() || '';
    const entity = this.entities.find(e => e.key === entityKey);
    if (entity) return entity.label;

    return 'Overview';
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
