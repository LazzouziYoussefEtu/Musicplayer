import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container">
      <h1>Playlist Detail: {{ playlistId }}</h1>
      <p>Playlist details page - coming soon</p>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 40px;
      color: white;
    }
  `]
})
export class PlaylistDetailComponent {
  playlistId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.playlistId = this.route.snapshot.paramMap.get('id');
  }
}
