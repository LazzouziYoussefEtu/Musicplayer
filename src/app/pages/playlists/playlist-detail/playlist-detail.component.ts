import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, switchMap } from 'rxjs';
import { MusicService } from '../../../core/services/music.service';
import { PlayerService } from '../../../core/services/player.service';
import { Playlist, Song } from '../../../core/models/music.model';
import { SongListComponent } from '../../../shared/components/song-list/song-list.component';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    DatePipe,
    SongListComponent
  ],
  template: `
    <div class="detail-container" *ngIf="playlist$ | async as playlist">
      <!-- Header Section -->
      <div class="header-section">
        <div class="cover-image-container">
          <img [src]="playlist.coverUrl" [alt]="playlist.title" class="cover-image">
          <div class="cover-overlay">
            <button mat-icon-button class="edit-cover-btn">
              <mat-icon>edit</mat-icon>
            </button>
          </div>
        </div>

        <div class="playlist-info">
          <span class="type">Playlist</span>
          <h1 class="title">{{ playlist.title }}</h1>
          <p class="description">{{ playlist.description }}</p>
          
          <div class="meta-info">
            <span class="owner">Created by You</span>
            <span class="separator">•</span>
            <span class="stats">{{ playlist.songCount }} songs, {{ getTotalDuration(playlist.songs) }}</span>
          </div>

          <div class="actions">
            <button mat-fab color="primary" class="play-btn" (click)="playPlaylist(playlist)">
              <mat-icon>play_arrow</mat-icon>
            </button>
            <button mat-icon-button class="action-btn" matTooltip="Save to Your Library">
              <mat-icon>favorite_border</mat-icon>
            </button>
            <button mat-icon-button class="action-btn" [matMenuTriggerFor]="menu">
              <mat-icon>more_horiz</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item>
                <mat-icon>edit</mat-icon>
                <span>Edit Details</span>
              </button>
              <button mat-menu-item>
                <mat-icon>delete</mat-icon>
                <span>Delete Playlist</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <div class="table-container">
          
          <app-song-list 
            [songs]="playlist.songs" 
            [showDate]="true" 
            [context]="'playlist'">
          </app-song-list>

          <div *ngIf="playlist.songs.length === 0" class="empty-state">
            <mat-icon>music_off</mat-icon>
            <h3>This playlist is empty</h3>
            <p>Find songs you love and add them to this playlist</p>
            <button mat-stroked-button color="primary" routerLink="/search">Find Songs</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
    }

    .detail-container {
      padding-bottom: 32px;
    }

    .header-section {
      display: flex;
      align-items: flex-end;
      gap: 24px;
      padding: 32px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
    }

    .cover-image-container {
      position: relative;
      width: 232px;
      height: 232px;
      flex-shrink: 0;
      box-shadow: 0 4px 60px rgba(0,0,0,0.5);
      border-radius: 4px;
      overflow: hidden;

      .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cover-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &:hover .cover-overlay {
        opacity: 1;
      }

      .edit-cover-btn {
        color: white;
      }
    }

    .playlist-info {
      flex: 1;
      color: var(--text-primary);

      .type {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
        display: block;
      }

      .title {
        font-size: 82px;
        font-weight: 900;
        margin: 0 0 12px 0;
        line-height: 1;
        letter-spacing: -2px;
        color: white;
      }

      .description {
        color: var(--text-secondary);
        font-size: 14px;
        margin-bottom: 16px;
      }

      .meta-info {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 500;
        color: white;

        .separator {
          margin: 0 4px;
        }

        .stats {
          color: var(--text-secondary);
        }
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 32px;

        .play-btn {
          transform: scale(1.1);
        }

        .action-btn {
          color: var(--text-secondary);
          &:hover { color: white; }
        }
      }
    }

    .content-section {
      padding: 0 32px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), var(--background) 200px);
    }

    .table-container {
      background: transparent;
    }

    .empty-state {
      padding: 64px;
      text-align: center;
      color: var(--text-secondary);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      h3 {
        margin: 0 0 8px 0;
        color: var(--text-primary);
      }
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 24px;
      }

      .playlist-info {
        .title { font-size: 32px; }
        .meta-info { justify-content: center; }
        .actions { justify-content: center; }
      }
    }
  `]
})
export class PlaylistDetailComponent implements OnInit {
  playlist$: Observable<Playlist> | null = null;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.playlist$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.musicService.getPlaylistById(id) : new Observable<Playlist>();
      })
    );
  }

  playPlaylist(playlist: Playlist): void {
    if (playlist.songs.length > 0) {
      this.playerService.playQueue(playlist.songs, 0);
    }
  }

  getTotalDuration(songs: Song[]): string {
    const totalSeconds = songs.reduce((acc, song) => acc + song.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min ${totalSeconds % 60} sec`;
  }
}
