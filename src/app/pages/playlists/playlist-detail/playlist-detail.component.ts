import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, switchMap, tap } from 'rxjs';
import { MusicService } from '../../../core/services/music.service';
import { PlayerService } from '../../../core/services/player.service';
import { Playlist, Song } from '../../../core/models/music.model';

@Component({
  selector: 'app-playlist-detail',
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
    <div class="playlist-detail" *ngIf="playlist$ | async as playlist">
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
          <table mat-table [dataSource]="playlist.songs" class="songs-table">
            
            <!-- Index Column -->
            <ng-container matColumnDef="index">
              <th mat-header-cell *matHeaderCellDef class="col-index">#</th>
              <td mat-cell *matCellDef="let song; let i = index" class="col-index">
                <span class="index-num">{{ i + 1 }}</span>
                <button mat-icon-button class="play-icon" (click)="playSong(song, playlist.songs, i)">
                  <mat-icon>play_arrow</mat-icon>
                </button>
              </td>
            </ng-container>

            <!-- Title Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let song" class="col-title">
                <div class="song-info">
                  <img [src]="song.coverUrl" class="song-thumb">
                  <div class="text">
                    <span class="song-name">{{ song.title }}</span>
                    <span class="song-artist">{{ song.artist.name }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Album Column -->
            <ng-container matColumnDef="album">
              <th mat-header-cell *matHeaderCellDef class="hide-mobile">Album</th>
              <td mat-cell *matCellDef="let song" class="hide-mobile">
                <a class="album-link" [routerLink]="['/album', song.album.id]">{{ song.album.title }}</a>
              </td>
            </ng-container>

            <!-- Date Added Column -->
            <ng-container matColumnDef="dateAdded">
              <th mat-header-cell *matHeaderCellDef class="hide-mobile">Date Added</th>
              <td mat-cell *matCellDef="let song" class="hide-mobile">
                {{ song.createdAt || playlist.updatedAt | date:'mediumDate' }}
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

            <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="song-row"></tr>
          </table>

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
  styles: [
    `
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
    }

    .playlist-detail {
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
      color: var(--text-primary); /* Use theme variable */

      .type {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
        display: block;
      }

      .title {
        font-size: 82px; /* Large title style */
        font-weight: 900;
        margin: 0 0 12px 0;
        line-height: 1;
        letter-spacing: -2px;
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
        color: var(--text-primary);

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
          &:hover { color: var(--text-primary); }
        }
      }
    }

    .content-section {
      padding: 0 32px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), var(--background) 200px); /* Subtle gradient into bg */
    }

    .table-container {
      background: transparent;
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

        &.col-title {
          color: var(--text-primary);
        }
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
        .song-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .song-thumb {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            object-fit: cover;
          }

          .text {
            display: flex;
            flex-direction: column;

            .song-name {
              font-weight: 500;
              font-size: 16px;
              color: var(--text-primary);
            }

            .song-artist {
              font-size: 12px;
              color: var(--text-secondary);
            }
          }
        }
      }

      .col-duration {
        width: 80px;
        text-align: right;
      }

      .album-link {
        color: var(--text-secondary);
        text-decoration: none;
        &:hover { text-decoration: underline; color: var(--text-primary); }
      }
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

      .hide-mobile { display: none; }
      .content-section { padding: 0 16px; }
    }
  `]
})
export class PlaylistDetailComponent implements OnInit {
  playlist$: Observable<Playlist> | null = null;
  displayedColumns: string[] = ['index', 'title', 'album', 'dateAdded', 'duration'];

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

  playSong(song: Song, queue: Song[], index: number): void {
    this.playerService.playQueue(queue, index);
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

  formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}