import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Song, Album, Artist, Playlist, Genre } from '../models/music.model';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_ARTISTS, MOCK_PLAYLISTS, MOCK_GENRES } from './mock-data';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private apiUrl = '/api/music';

  constructor(private http: HttpClient) {}

  // Songs
  getSongs(): Observable<Song[]> {
    // Return mock data with a slight delay to simulate API call
    return of(MOCK_SONGS).pipe(delay(300));
  }

  getSongById(id: string): Observable<Song> {
    const song = MOCK_SONGS.find(s => s.id === id);
    return song ? of(song).pipe(delay(300)) : this.handleError('Song not found', null);
  }

  getSongsByGenre(genreId: string): Observable<Song[]> {
    const songs = MOCK_SONGS.filter(s => s.genre.id === genreId);
    return of(songs).pipe(delay(300));
  }

  // Albums
  getAlbums(): Observable<Album[]> {
    return of(MOCK_ALBUMS).pipe(delay(300));
  }

  getAlbumById(id: string): Observable<Album> {
    const album = MOCK_ALBUMS.find(a => a.id === id);
    return album ? of(album).pipe(delay(300)) : this.handleError('Album not found', null);
  }

  getAlbumSongs(albumId: string): Observable<Song[]> {
    // For demo, return some songs with matching album id
    const album = MOCK_ALBUMS.find(a => a.id === albumId);
    const songs = album ? MOCK_SONGS.filter(s => s.album.id === albumId) : [];
    return of(songs).pipe(delay(300));
  }

  // Artists
  getArtists(): Observable<Artist[]> {
    return of(MOCK_ARTISTS).pipe(delay(300));
  }

  getArtistById(id: string): Observable<Artist> {
    const artist = MOCK_ARTISTS.find(a => a.id === id);
    return artist ? of(artist).pipe(delay(300)) : this.handleError('Artist not found', null);
  }

  getArtistAlbums(artistId: string): Observable<Album[]> {
    const albums = MOCK_ALBUMS.filter(a => a.id === artistId);
    return of(albums).pipe(delay(300));
  }

  getArtistSongs(artistId: string): Observable<Song[]> {
    const songs = MOCK_SONGS.filter(s => s.artist.id === artistId);
    return of(songs).pipe(delay(300));
  }

  // Playlists
  getPlaylists(): Observable<Playlist[]> {
    return of(MOCK_PLAYLISTS).pipe(delay(300));
  }

  getPlaylistById(id: string): Observable<Playlist> {
    const playlist = MOCK_PLAYLISTS.find(p => p.id === id);
    return playlist ? of(playlist).pipe(delay(300)) : this.handleError('Playlist not found', null);
  }

  createPlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Observable<Playlist> {
    const now = new Date();
    const newPlaylist: Playlist = {
      ...playlist,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    return of(newPlaylist).pipe(delay(300));
  }

  updatePlaylist(id: string, playlist: Partial<Playlist>): Observable<Playlist> {
    const existing = MOCK_PLAYLISTS.find(p => p.id === id);
    const updated = { ...existing, ...playlist, updatedAt: new Date() } as Playlist;
    return of(updated).pipe(delay(300));
  }

  deletePlaylist(id: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  addSongToPlaylist(playlistId: string, songId: string): Observable<Playlist> {
    const playlist = MOCK_PLAYLISTS.find(p => p.id === playlistId);
    if (playlist) {
      const song = MOCK_SONGS.find(s => s.id === songId);
      if (song) {
        playlist.songs.push(song);
        playlist.songCount = playlist.songs.length;
      }
      return of(playlist).pipe(delay(300));
    }
    return this.handleError('Playlist not found', null);
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<Playlist> {
    const playlist = MOCK_PLAYLISTS.find(p => p.id === playlistId);
    if (playlist) {
      playlist.songs = playlist.songs.filter((song: Song) => song.id !== songId);
      playlist.songCount = playlist.songs.length;
      return of(playlist).pipe(delay(300));
    }
    return this.handleError('Playlist not found', null);
  }

  // Genres
  getGenres(): Observable<Genre[]> {
    return of(MOCK_GENRES).pipe(delay(300));
  }

  getGenreById(id: string): Observable<Genre> {
    const genre = MOCK_GENRES.find(g => g.id === id);
    return genre ? of(genre).pipe(delay(300)) : this.handleError('Genre not found', null);
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    return throwError(() => new Error(message));
  }
}
