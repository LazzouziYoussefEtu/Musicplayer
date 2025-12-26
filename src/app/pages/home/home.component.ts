import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SongCardComponent } from '../../shared/components/song-card/song-card.component';
import { MusicService } from '../../core/services/music.service';
import { Song } from '../../core/models/music.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    SongCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recentSongs: Song[] = [];
  popularSongs: Song[] = [];
  isLoading = true;

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.musicService.getSongs().subscribe({
      next: (songs) => {
        // Split songs into recent and popular for demo
        this.recentSongs = songs.slice(0, 6);
        this.popularSongs = songs.slice(6, 12);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading home data:', err);
        this.isLoading = false;
      }
    });
  }
}
