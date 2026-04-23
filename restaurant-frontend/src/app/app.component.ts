import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="main-layout">
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main class="content-wrapper">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
