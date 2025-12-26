import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Song } from '../../../core/models/music.model';
import { PlayerService } from '../../../core/services/player.service';

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
    DatePipe
  ],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnChanges {
  @Input() songs: Song[] = [];
  @Input() showArtist = true;
  @Input() showAlbum = true;
  @Input() showDate = false;
  @Input() showPlays = false;
  @Input() context: 'playlist' | 'album' | 'artist' | 'library' = 'library';

  displayedColumns: string[] = [];

  constructor(public playerService: PlayerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateColumns();
  }

  updateColumns() {
    this.displayedColumns = ['index', 'title'];
    
    // In Album detail, we usually don't show Album column
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
  }

  formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}