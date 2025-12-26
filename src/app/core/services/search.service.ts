import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Song, Album, Artist } from '../models/music.model';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_ARTISTS } from './mock-data';

export interface SearchResult {
  id: string;
  type: 'song' | 'album' | 'artist';
  name: string;
  artist?: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {

  constructor() {}

  search(query: string): Observable<SearchResult[]> {
    const q = query.toLowerCase().trim();
    if (!q) return of([]);

    const songResults: SearchResult[] = MOCK_SONGS
      .filter(s => s.title.toLowerCase().includes(q) || s.artist.name.toLowerCase().includes(q))
      .map(s => ({
        id: s.id,
        type: 'song',
        name: s.title,
        artist: s.artist.name,
        imageUrl: s.coverUrl
      }));

    const albumResults: SearchResult[] = MOCK_ALBUMS
      .filter(a => a.title.toLowerCase().includes(q) || a.artist.name.toLowerCase().includes(q))
      .map(a => ({
        id: a.id,
        type: 'album',
        name: a.title,
        artist: a.artist.name,
        imageUrl: a.coverUrl
      }));

    const artistResults: SearchResult[] = MOCK_ARTISTS
      .filter(a => a.name.toLowerCase().includes(q))
      .map(a => ({
        id: a.id,
        type: 'artist',
        name: a.name,
        imageUrl: a.imageUrl
      }));

    // Combine and limit results
    const results = [...artistResults, ...albumResults, ...songResults].slice(0, 10);
    return of(results).pipe(delay(300));
  }

  searchSongs(query: string): Observable<Song[]> {
    const q = query.toLowerCase().trim();
    const songs = MOCK_SONGS.filter(s => 
      s.title.toLowerCase().includes(q) || s.artist.name.toLowerCase().includes(q)
    );
    return of(songs).pipe(delay(300));
  }

  searchAlbums(query: string): Observable<Album[]> {
    const q = query.toLowerCase().trim();
    const albums = MOCK_ALBUMS.filter(a => 
      a.title.toLowerCase().includes(q) || a.artist.name.toLowerCase().includes(q)
    );
    return of(albums).pipe(delay(300));
  }

  searchArtists(query: string): Observable<Artist[]> {
    const q = query.toLowerCase().trim();
    const artists = MOCK_ARTISTS.filter(a => a.name.toLowerCase().includes(q));
    return of(artists).pipe(delay(300));
  }
}