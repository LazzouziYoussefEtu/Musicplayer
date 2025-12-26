import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, switchMap, combineLatest, map } from 'rxjs';
import { MusicService } from '../../core/services/music.service';
import { PlayerService } from '../../core/services/player.service';
import { Artist, Album, Song } from '../../core/models/music.model';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule
  ],
  template: `
    <div class="detail-container" *ngIf="vm$ | async as vm">
      <!-- Header Section -->
      <div class="header-section" [style.background-image]="'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(' + vm.artist.imageUrl + ')'">
        <div class="info-section">
          <div class="verified-badge">
            <mat-icon class="verified-icon">verified</mat-icon>
            <span>Verified Artist</span>
          </div>
          <h1 class="title">{{ vm.artist.name }}</h1>
          <span class="followers">{{ vm.artist.followers | number }} monthly listeners</span>
          
          <div class="actions">
            <button mat-fab color="primary" class="play-btn" (click)="playArtist(vm.popularSongs)">
              <mat-icon>play_arrow</mat-icon>
            </button>
            <button mat-stroked-button class="follow-btn">FOLLOW</button>
            <button mat-icon-button class="action-btn" [matMenuTriggerFor]="menu">
              <mat-icon>more_horiz</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item>
                <mat-icon>share</mat-icon>
                <span>Share</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        
        <!-- Popular Songs -->
        <section class="popular-section">
          <h2>Popular</h2>
          <table mat-table [dataSource]="vm.popularSongs.slice(0, 5)" class="songs-table">
            <ng-container matColumnDef="index">
              <th mat-header-cell *matHeaderCellDef class="col-index">#</th>
              <td mat-cell *matCellDef="let song; let i = index" class="col-index">
                <span class="index-num">{{ i + 1 }}</span>
                <button mat-icon-button class="play-icon" (click)="playSong(song, vm.popularSongs, i)">
                  <mat-icon>play_arrow</mat-icon>
                </button>
              </td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let song" class="col-title">
                <div class="song-info">
                  <img [src]="song.coverUrl" class="song-thumb">
                  <span class="song-name">{{ song.title }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="playCount">
              <th mat-header-cell *matHeaderCellDef class="hide-mobile">Plays</th>
              <td mat-cell *matCellDef="let song" class="hide-mobile col-plays">
                {{ song.playCount | number }}
              </td>
            </ng-container>

            <ng-container matColumnDef="duration">
              <th mat-header-cell *matHeaderCellDef class="col-duration">
                <mat-icon>schedule</mat-icon>
              </th>
              <td mat-cell *matCellDef="let song" class="col-duration">
                {{ formatDuration(song.duration) }}
              </td>
            </ng-container>

            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="song-row"></tr>
          </table>
        </section>

        <!-- Albums -->
        <section class="albums-section">
          <h2>Discography</h2>
          <div class="albums-grid">
            <div class="album-card" *ngFor="let album of vm.albums" [routerLink]="['/album', album.id]">
              <div class="album-cover-wrapper">
                <img [src]="album.coverUrl" [alt]="album.title">
              </div>
              <div class="album-info">
                <div class="album-title">{{ album.title }}</div>
                <div class="album-year">{{ album.releaseDate | date:'yyyy' }} • Album</div>
              </div>
            </div>
          </div>
        </section>

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

    .detail-container {
      padding-bottom: 32px;
    }

    .header-section {
      height: 340px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      padding: 32px;
    }

    .info-section {
      color: white; /* Always white on header image */
      width: 100%;

      .verified-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        .verified-icon { color: #3d91f4; font-size: 20px; width: 20px; height: 20px; }
      }

      .title {
        font-size: 96px;
        font-weight: 900;
        margin: 0;
        line-height: 1;
        letter-spacing: -2px;
        text-shadow: 0 0 20px rgba(0,0,0,0.5);
      }

      .followers {
        font-size: 16px;
        font-weight: 500;
        margin-top: 16px;
        display: block;
        text-shadow: 0 0 10px rgba(0,0,0,0.5);
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-top: 32px;

        .play-btn { transform: scale(1.1); }
        .follow-btn { 
          border-color: rgba(255,255,255,0.3); 
          color: white;
          padding: 0 24px;
        }
        .action-btn { color: white; }
      }
    }

    .content-section {
      padding: 32px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), var(--background) 200px);
    }

    h2 {
      color: var(--text-primary);
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
    }

    .popular-section {
      margin-bottom: 48px;
    }

    .songs-table {
      width: 100%;
      background: transparent;

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
            object-fit: cover;
          }
          
          .song-name {
            font-size: 16px;
            font-weight: 500;
            color: var(--text-primary);
          }
        }
      }

      .col-plays { text-align: right; }
      .col-duration { width: 80px; text-align: right; }
    }

    .albums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 24px;

      .album-card {
        background: var(--card-background);
        padding: 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: var(--hover-overlay);
        }

        .album-cover-wrapper {
          width: 100%;
          aspect-ratio: 1;
          margin-bottom: 16px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .album-info {
          .album-title {
            color: var(--text-primary);
            font-weight: 700;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .album-year {
            color: var(--text-secondary);
            font-size: 14px;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .header-section {
        height: 300px;
        padding: 24px;
      }
      
      .info-section .title { font-size: 48px; }
      
      .hide-mobile { display: none; }
      
      .content-section { padding: 24px 16px; }
    }
  `]
})
export class ArtistDetailComponent implements OnInit {
  vm$: Observable<{ artist: Artist, popularSongs: Song[], albums: Album[] }> | null = null;
  displayedColumns: string[] = ['index', 'title', 'playCount', 'duration'];

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
          artist: this.musicService.getArtistById(id),
          popularSongs: this.musicService.getArtistSongs(id),
          albums: this.musicService.getArtistAlbums(id)
        });
      })
    );
  }

  playArtist(songs: Song[]): void {
    if (songs.length > 0) {
      this.playerService.playQueue(songs, 0);
    }
  }

  playSong(song: Song, queue: Song[], index: number): void {
    this.playerService.playQueue(queue, index);
  }

  formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}