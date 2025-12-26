import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MusicService } from '../../core/services/music.service';
import { Playlist } from '../../core/models/music.model';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, RouterModule, MatGridListModule],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.musicService.getPlaylists().subscribe({
      next: (playlists) => (this.playlists = playlists)
    });
  }
}
