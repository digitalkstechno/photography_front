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

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
