import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, shareReplay } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { Song, Album, Artist, Playlist, Genre } from '../models/music.model';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_ARTISTS, MOCK_PLAYLISTS, MOCK_GENRES } from './mock-data';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private apiUrl = '/api/music';
  private localSongs$: Observable<Song[]>;

  constructor(private http: HttpClient) {
    this.localSongs$ = this.http.get<Song[]>('/api/local-library').pipe(
      catchError(() => of(MOCK_SONGS)),
      map(songs => songs.length > 0 ? songs : MOCK_SONGS),
      shareReplay(1)
    );
  }

  // Songs
  getSongs(): Observable<Song[]> {
    return this.localSongs$;
  }

  getSongById(id: string): Observable<Song> {
    if (id.startsWith('yt-')) {
      return this.getYoutubeSongById(id);
    }
    return this.getSongs().pipe(
      map(songs => {
        const song = songs.find(s => s.id === id);
        if (!song) throw new Error('Song not found');
        return song;
      }),
      catchError(err => this.handleError(err.message, null))
    );
  }

  private getYoutubeSongById(id: string): Observable<Song> {
    // For simplicity, we fetch it from search results or just re-request if we had a dedicated endpoint
    // Since we don't have a dedicated "getYoutubeById", we'll simulate it by returning the song 
    // if it was recently searched, or making a targeted search.
    // However, the cleanest way for this demo is to have the search service provide the full song object
    // Or add a dedicated backend endpoint for YouTube video details.
    
    // For now, let's assume we can fetch basic details from a specific search
    const videoId = id.replace('yt-', '');
    return this.http.get<Song[]>('/api/search/youtube', { params: { q: videoId } }).pipe(
      map(songs => {
        const song = songs.find(s => s.id === id);
        if (!song) throw new Error('YouTube Song not found');
        return song;
      })
    );
  }

  getSongsByGenre(genreId: string): Observable<Song[]> {
    return this.getSongs().pipe(
      map(songs => songs.filter(s => s.genre.id === genreId))
    );
  }

  // Albums
  getAlbums(): Observable<Album[]> {
    return this.getSongs().pipe(
      map(songs => {
        const albumsMap = new Map<string, Album>();
        songs.forEach(s => {
          if (!albumsMap.has(s.album.id)) {
            albumsMap.set(s.album.id, {
              ...s.album,
              songCount: songs.filter(song => song.album.id === s.album.id).length
            });
          }
        });
        return Array.from(albumsMap.values());
      })
    );
  }

  getAlbumById(id: string): Observable<Album> {
    return this.getAlbums().pipe(
      map(albums => {
        const album = albums.find(a => a.id === id);
        if (!album) throw new Error('Album not found');
        return album;
      })
    );
  }

  getAlbumSongs(albumId: string): Observable<Song[]> {
    return this.getSongs().pipe(
      map(songs => songs.filter(s => s.album.id === albumId))
    );
  }

  // Artists
  getArtists(): Observable<Artist[]> {
    return this.getSongs().pipe(
      map(songs => {
        const artistsMap = new Map<string, Artist>();
        songs.forEach(s => {
          if (!artistsMap.has(s.artist.id)) {
            artistsMap.set(s.artist.id, s.artist);
          }
        });
        return Array.from(artistsMap.values());
      })
    );
  }

  getArtistById(id: string): Observable<Artist> {
    return this.getArtists().pipe(
      map(artists => {
        const artist = artists.find(a => a.id === id);
        if (!artist) throw new Error('Artist not found');
        return artist;
      })
    );
  }

  getArtistAlbums(artistId: string): Observable<Album[]> {
    return this.getAlbums().pipe(
      map(albums => albums.filter(a => a.artist.id === artistId))
    );
  }

  getArtistSongs(artistId: string): Observable<Song[]> {
    return this.getSongs().pipe(
      map(songs => songs.filter(s => s.artist.id === artistId))
    );
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
    MOCK_PLAYLISTS.push(newPlaylist);
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
      this.getSongById(songId).subscribe(song => {
        playlist.songs.push(song);
        playlist.songCount = playlist.songs.length;
      });
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