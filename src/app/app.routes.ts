import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'library',
    loadComponent: () => import('./pages/library/library.component').then(m => m.LibraryComponent)
  },
  {
    path: 'playlists',
    loadComponent: () => import('./pages/playlists/playlists.component').then(m => m.PlaylistsComponent)
  },
  {
    path: 'playlists/:id',
    loadComponent: () => import('./pages/playlists/playlist-detail/playlist-detail.component').then(m => m.PlaylistDetailComponent)
  },
  {
    path: 'artist/:id',
    loadComponent: () => import('./pages/artist-detail/artist-detail.component').then(m => m.ArtistDetailComponent)
  },
  {
    path: 'album/:id',
    loadComponent: () => import('./pages/album-detail/album-detail.component').then(m => m.AlbumDetailComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
