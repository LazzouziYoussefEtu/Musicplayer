import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Song } from '../../../core/models/music.model';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent {
  @Input() song!: Song;

  playSong(): void {
    // Implement play logic
    console.log('Playing:', this.song.title);
  }

  addToPlaylist(): void {
    // Implement add to playlist logic
    console.log('Adding to playlist:', this.song.title);
  }
}
