import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlayerService } from '../../../core/services/player.service';
import { PlayerState, Song } from '../../../core/models/music.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  player$: Observable<PlayerState>;

  constructor(public playerService: PlayerService) {
    this.player$ = this.playerService.player$;
  }

  ngOnInit(): void {}

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onProgressChange(event: any): void {
    this.playerService.setCurrentTime(event.target.value);
  }

  onVolumeChange(event: any): void {
    this.playerService.setVolume(event.target.value);
  }

  playPause(): void {
    this.playerService.togglePlayPause();
  }

  nextTrack(): void {
    this.playerService.nextTrack();
  }

  previousTrack(): void {
    this.playerService.previousTrack();
  }

  toggleRepeat(): void {
    this.playerService.toggleRepeat();
  }

  toggleShuffle(): void {
    this.playerService.toggleShuffle();
  }
}
