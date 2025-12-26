import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container">
      <h1>Artist Detail: {{ artistId }}</h1>
      <p>Artist details page - coming soon</p>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 40px;
      color: white;
    }
  `]
})
export class ArtistDetailComponent {
  artistId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.artistId = this.route.snapshot.paramMap.get('id');
  }
}
