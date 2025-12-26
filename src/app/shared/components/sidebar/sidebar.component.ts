import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MusicService } from '../../../core/services/music.service';
import { Playlist } from '../../../core/models/music.model';
import { Observable } from 'rxjs';

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

  playlists$: Observable<Playlist[]> | null = null;

  @Input() isOpen = false;
  @HostBinding('class.open') get opened() { return this.isOpen; }

  constructor(public router: Router, private musicService: MusicService) {}

  ngOnInit(): void {
    this.playlists$ = this.musicService.getPlaylists();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  createNewPlaylist(): void {
    const title = prompt('Enter playlist name:', 'New Playlist');
    if (title) {
      this.musicService.createPlaylist({
        title,
        description: 'Custom playlist',
        coverUrl: 'https://via.placeholder.com/300?text=' + title.replace(/ /g, '+'),
        songs: [],
        songCount: 0,
        isPublic: false
      }).subscribe(playlist => {
        this.router.navigate(['/playlists', playlist.id]);
        // Refresh playlists (in a real app, this would be a behavior subject or store)
        // Since getPlaylists returns 'of(MOCK)', subsequent calls get the modified MOCK array reference,
        // but 'of()' emits once. We need to manually refresh or just rely on the fact that MOCK_PLAYLISTS is mutable 
        // and we might need to re-trigger the observable if it was a real HTTP call.
        // For this mock, the view might not update automatically unless we re-assign.
        this.playlists$ = this.musicService.getPlaylists();
      });
    }
  }
}
