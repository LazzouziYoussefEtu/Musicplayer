import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, switchMap, combineLatest, map } from 'rxjs';
import { MusicService } from '../../core/services/music.service';
import { PlayerService } from '../../core/services/player.service';
import { Album, Song } from '../../core/models/music.model';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    DatePipe
  ],
  template: `
    <div class="detail-container" *ngIf="vm$ | async as vm">
      <!-- Header Section -->
      <div class="header-section">
        <div class="cover-image-container">
          <img [src]="vm.album.coverUrl" [alt]="vm.album.title" class="cover-image">
        </div>

        <div class="info-section">
          <span class="type">Album</span>
          <h1 class="title">{{ vm.album.title }}</h1>
          
          <div class="meta-info">
            <div class="artist-info">
              <img [src]="vm.album.artist.imageUrl" class="artist-avatar">
              <a [routerLink]="['/artist', vm.album.artist.id]" class="artist-link">{{ vm.album.artist.name }}</a>
            </div>
            <span class="separator">•</span>
            <span class="year">{{ vm.album.releaseDate | date:'yyyy' }}</span>
            <span class="separator">•</span>
            <span class="stats">{{ vm.songs.length }} songs, {{ getTotalDuration(vm.songs) }}</span>
          </div>

          <div class="actions">
            <button mat-fab color="primary" class="play-btn" (click)="playAlbum(vm.songs)">
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
                <mat-icon>add_to_queue</mat-icon>
                <span>Add to Queue</span>
              </button>
              <button mat-menu-item>
                <mat-icon>playlist_add</mat-icon>
                <span>Add to Playlist</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <table mat-table [dataSource]="vm.songs" class="songs-table">
          
          <!-- Index Column -->
          <ng-container matColumnDef="index">
            <th mat-header-cell *matHeaderCellDef class="col-index">#</th>
            <td mat-cell *matCellDef="let song; let i = index" class="col-index">
              <span class="index-num">{{ i + 1 }}</span>
              <button mat-icon-button class="play-icon" (click)="playSong(song, vm.songs, i)">
                <mat-icon>play_arrow</mat-icon>
              </button>
            </td>
          </ng-container>

          <!-- Title Column -->
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let song" class="col-title">
              <span class="song-name">{{ song.title }}</span>
              <span class="song-artist-mobile">{{ song.artist.name }}</span>
            </td>
          </ng-container>

          <!-- Duration Column -->
          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef class="col-duration">
              <mat-icon>schedule</mat-icon>
            </th>
            <td mat-cell *matCellDef="let song" class="col-duration">
              {{ formatDuration(song.duration) }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="song-row">
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [
    `:host {
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
    }

    .info-section {
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
        font-size: 72px;
        font-weight: 900;
        margin: 0 0 12px 0;
        line-height: 1;
        letter-spacing: -2px;
      }

      .meta-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);

        .artist-info {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .artist-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
          }

          .artist-link {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 700;
            &:hover { text-decoration: underline; }
          }
        }

        .separator { margin: 0 4px; }
        .stats { color: var(--text-secondary); }
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 32px;

        .play-btn { transform: scale(1.1); }
        .action-btn {
          color: var(--text-secondary);
          &:hover { color: var(--text-primary); }
        }
      }
    }

    .content-section {
      padding: 0 32px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), var(--background) 200px);
    }

    .songs-table {
      width: 100%;
      background: transparent;

      th.mat-header-cell {
        background: transparent;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--border-color);
        font-size: 12px;
        text-transform: uppercase;
        padding: 8px 16px;
      }

      td.mat-cell {
        padding: 8px 16px;
        border-bottom: 1px solid transparent;
        color: var(--text-secondary);
        font-size: 14px;

        &.col-title { color: var(--text-primary); }
      }

      .song-row {
        transition: background-color 0.2s ease;
        cursor: pointer;
        border-radius: 4px;

        &:hover {
          background-color: var(--hover-overlay);
          .col-index .index-num { display: none; }
          .col-index .play-icon { display: inline-block; }
          .col-title .song-name { color: var(--primary-color); }
        }
      }

      .col-index {
        width: 48px;
        text-align: center;
        position: relative;

        .play-icon {
          display: none;
          color: var(--text-primary);
          margin-left: -12px;
        }
      }

      .col-title {
        .song-artist-mobile {
          display: none;
          font-size: 12px;
          color: var(--text-secondary);
        }
      }

      .col-duration {
        width: 80px;
        text-align: right;
      }
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 24px;
      }

      .info-section {
        .title { font-size: 32px; }
        .meta-info { justify-content: center; flex-wrap: wrap; }
        .actions { justify-content: center; }
      }

      .content-section { padding: 0 16px; }
      
      .col-title .song-artist-mobile { display: block; }
    }
  `]
})
export class AlbumDetailComponent implements OnInit {
  vm$: Observable<{ album: Album, songs: Song[] }> | null = null;
  displayedColumns: string[] = ['index', 'title', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.vm$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return [];
        
        return combineLatest({
          album: this.musicService.getAlbumById(id),
          songs: this.musicService.getAlbumSongs(id)
        });
      })
    );
  }

  playAlbum(songs: Song[]): void {
    if (songs.length > 0) {
      this.playerService.playQueue(songs, 0);
    }
  }

  playSong(song: Song, queue: Song[], index: number): void {
    this.playerService.playQueue(queue, index);
  }

  getTotalDuration(songs: Song[]): string {
    const totalSeconds = songs.reduce((acc, song) => acc + song.duration, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  }

  formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}