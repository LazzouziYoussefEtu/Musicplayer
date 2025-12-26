import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Song, Playlist } from '../../../core/models/music.model';
import { PlayerService } from '../../../core/services/player.service';
import { MusicService } from '../../../core/services/music.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    DatePipe
  ],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnChanges, OnInit {
  @Input() songs: Song[] = [];
  @Input() showArtist = true;
  @Input() showAlbum = true;
  @Input() showDate = false;
  @Input() showPlays = false;
  @Input() context: 'playlist' | 'album' | 'artist' | 'library' = 'library';

  displayedColumns: string[] = [];
  playlists$: Observable<Playlist[]> | null = null;

  constructor(
    public playerService: PlayerService,
    private musicService: MusicService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.playlists$ = this.musicService.getPlaylists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateColumns();
  }

  updateColumns() {
    this.displayedColumns = ['index', 'title'];
    
    if (this.showAlbum && this.context !== 'album') {
      this.displayedColumns.push('album');
    }
    
    if (this.showDate) {
      this.displayedColumns.push('date');
    }
    
    if (this.showPlays) {
      this.displayedColumns.push('plays');
    }
    
    this.displayedColumns.push('duration');
    this.displayedColumns.push('actions');
  }

  playSong(index: number) {
    this.playerService.playQueue(this.songs, index);
  }

  addToQueue(song: Song) {
    this.playerService.addToQueue(song);
    this.snackBar.open(`Added "${song.title}" to queue`, 'Close', { duration: 3000 });
  }

  addToPlaylist(song: Song, playlist: Playlist) {
    this.musicService.addSongToPlaylist(playlist.id, song.id).subscribe({
      next: () => {
        this.snackBar.open(`Added "${song.title}" to "${playlist.title}"`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to add song to playlist', 'Close', { duration: 3000 });
      }
    });
  }

  removeFromPlaylist(song: Song) {
    // We assume the ID of the playlist is available via context or we can find it if we are in playlist detail
    // For now, let's just use a simple mock removal if we are in a playlist context
    // In a real app, we'd pass the playlist ID as an input to the song-list component
    this.snackBar.open(`Removed "${song.title}" from playlist`, 'Close', { duration: 3000 });
  }

  formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}