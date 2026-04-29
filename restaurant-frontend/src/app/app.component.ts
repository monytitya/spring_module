import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="main-layout">
      <!-- Hide Sidebar/Header on Auth Pages -->
      <app-sidebar *ngIf="!isAuthPage()"></app-sidebar>
      <app-header *ngIf="!isAuthPage()"></app-header>
      
      <main [class.content-wrapper]="!isAuthPage()" [class.auth-wrapper]="isAuthPage()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(private router: Router) {}

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  }
}
