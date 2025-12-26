import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Song } from '../../../core/models/music.model';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent {
  @Input() song!: Song;

  constructor(private playerService: PlayerService) {}

  playSong(): void {
    this.playerService.play(this.song);
  }

  addToPlaylist(): void {
    // Implement add to playlist logic
    console.log('Adding to playlist:', this.song.title);
  }
}
