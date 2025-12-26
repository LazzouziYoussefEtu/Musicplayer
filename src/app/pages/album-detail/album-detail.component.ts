import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, combineLatest, switchMap } from 'rxjs';
import { MusicService } from '../../core/services/music.service';
import { PlayerService } from '../../core/services/player.service';
import { Album, Song } from '../../core/models/music.model';
import { SongListComponent } from '../../shared/components/song-list/song-list.component';

@Component({
  selector: 'app-album-detail',
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
        <app-song-list 
          [songs]="vm.songs"
          [showAlbum]="false"
          [context]="'album'">
        </app-song-list>
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
      color: white;

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
            color: white;
            text-decoration: none;
            font-weight: 700;
            &:hover { text-decoration: underline; }
          }
        }

        .separator { margin: 0 4px; }
        .stats { color: rgba(255,255,255,0.7); }
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 32px;

        .play-btn { transform: scale(1.1); }
        .action-btn {
          color: rgba(255,255,255,0.7);
          &:hover { color: white; }
        }
      }
    }

    .content-section {
      padding: 0 32px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), var(--background) 200px);
    }
  `]
})
export class AlbumDetailComponent implements OnInit {
  vm$: Observable<{ album: Album, songs: Song[] }> | null = null;

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

  getTotalDuration(songs: Song[]): string {
    const totalSeconds = songs.reduce((acc, song) => acc + song.duration, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  }
}
