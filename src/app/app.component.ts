import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { PlayerComponent } from './shared/components/player/player.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { SearchResult } from './core/services/search.service';
import { PlayerService } from './core/services/player.service';
import { MusicService } from './core/services/music.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, PlayerComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSidebarOpen = false;

  constructor(
    public auth: AuthService, 
    public theme: ThemeService,
    private router: Router,
    private playerService: PlayerService,
    private musicService: MusicService
  ) {}

  ngOnInit(): void {
    // Initialize theme on app load
    this.theme.getCurrentTheme();
  }

  get user$() { return this.auth.user$; }

  onLogout() { this.auth.logout(); }
  onToggleNav() { this.isSidebarOpen = !this.isSidebarOpen; }
  
  onSearchSelected(result: SearchResult) {
    if (result.type === 'song') {
      this.musicService.getSongById(result.id).subscribe(song => {
        this.playerService.play(song);
      });
    } else if (result.type === 'artist') {
      this.router.navigate(['/artist', result.id]);
    } else if (result.type === 'album') {
      this.router.navigate(['/album', result.id]);
    }
  }
}
