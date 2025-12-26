import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, combineLatest, switchMap, map } from 'rxjs';
import { MusicService } from '../../core/services/music.service';
import { PlayerService } from '../../core/services/player.service';
import { Artist, Album, Song } from '../../core/models/music.model';
import { SongListComponent } from '../../shared/components/song-list/song-list.component';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SongListComponent,
    DecimalPipe,
    DatePipe
  ],
  template: `
    <div class="detail-container" *ngIf="vm$ | async as vm">
      <!-- Header Section -->
      <div class="header-section" [style.background-image]="'linear-gradient(rgba(0,0,0,0.6), var(--primary-color) 90%), url(' + vm.artist.imageUrl + ')'">
        <div class="info-section">
          <div class="verified-badge" *ngIf="vm.artist.followers > 100000">
            <mat-icon class="verified-icon">verified</mat-icon>
            <span>Verified Artist</span>
          </div>
          <h1 class="title">{{ vm.artist.name }}</h1>
          <span class="followers">{{ vm.artist.followers | number }} monthly listeners</span>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <div class="actions-bar">
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
        
        <!-- Popular Songs -->
        <section class="popular-section">
          <h2>Popular</h2>
          <app-song-list 
            [songs]="vm.popularSongs.slice(0, 5)"
            [showAlbum]="false"
            [showPlays]="true"
            [context]="'artist'">
          </app-song-list>
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
      height: 40vh;
      min-height: 340px;
      max-height: 500px;
      background-size: cover;
      background-position: center 25%;
      display: flex;
      align-items: flex-end;
      padding: 32px;
      color: white;
    }

    .info-section {
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
      }
    }

    .content-section {
      padding: 32px;
      background: linear-gradient(to bottom, transparent, var(--background) 150px);
    }
    
    .actions-bar {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 48px;

      .play-btn { transform: scale(1.1); }
      .follow-btn { 
        border-color: var(--text-secondary);
        color: var(--text-primary);
        padding: 0 24px;
      }
      .action-btn { color: var(--text-secondary); }
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

    .albums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 24px;

      .album-card {
        background: var(--surface);
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
      
      .content-section { padding: 24px 16px; }
    }
  `]
})
export class ArtistDetailComponent implements OnInit {
  vm$: Observable<{ artist: Artist, popularSongs: Song[], albums: Album[] }> | null = null;

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
          popularSongs: this.musicService.getArtistSongs(id).pipe(
            map((songs: Song[]) => songs.sort((a, b) => b.playCount - a.playCount))
          ),
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
}
