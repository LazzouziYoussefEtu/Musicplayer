import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Library', icon: 'library_music', route: '/library' },
    { label: 'Playlists', icon: 'playlist_play', route: '/playlists' }
  ];

  settingsItems: NavItem[] = [
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  @Input() isOpen = false;
  @HostBinding('class.open') get opened() { return this.isOpen; }

  constructor(public router: Router) {}

  ngOnInit(): void {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
