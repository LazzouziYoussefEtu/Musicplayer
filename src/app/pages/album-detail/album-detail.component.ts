import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container">
      <h1>Album Detail: {{ albumId }}</h1>
      <p>Album details page - coming soon</p>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 40px;
      color: white;
    }
  `]
})
export class AlbumDetailComponent {
  albumId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.albumId = this.route.snapshot.paramMap.get('id');
  }
}
