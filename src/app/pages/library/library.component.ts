import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { SongCardComponent } from '../../shared/components/song-card/song-card.component';
import { MusicService } from '../../core/services/music.service';
import { Song, Album, Artist } from '../../core/models/music.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatGridListModule,
    SongCardComponent
  ],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  songs: Song[] = [];
  albums: Album[] = [];
  artists: Artist[] = [];
  selectedTabIndex = 0;
  isLoading = true;

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.loadLibraryData();
  }

  loadLibraryData(): void {
    this.musicService.getSongs().subscribe({
      next: (songs) => (this.songs = songs)
    });

    this.musicService.getAlbums().subscribe({
      next: (albums) => (this.albums = albums)
    });

    this.musicService.getArtists().subscribe({
      next: (artists) => {
        this.artists = artists;
        this.isLoading = false;
      }
    });
  }
}
