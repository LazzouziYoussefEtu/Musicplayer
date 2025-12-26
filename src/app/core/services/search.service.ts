import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Song, Album, Artist } from '../models/music.model';
import { MusicService } from './music.service';

export interface SearchResult {
  id: string;
  type: 'song' | 'album' | 'artist';
  name: string;
  artist?: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {

  constructor(private musicService: MusicService) {}

  search(query: string): Observable<SearchResult[]> {
    const q = query.toLowerCase().trim();
    if (!q) return of([]);

    return this.musicService.getSongs().pipe(
      map(songs => {
        const songResults: SearchResult[] = songs
          .filter(s => s.title.toLowerCase().includes(q) || s.artist.name.toLowerCase().includes(q))
          .map(s => ({
            id: s.id,
            type: 'song',
            name: s.title,
            artist: s.artist.name,
            imageUrl: s.coverUrl
          }));

        const albumsMap = new Map<string, SearchResult>();
        songs.forEach(s => {
          if ((s.album.title.toLowerCase().includes(q) || s.artist.name.toLowerCase().includes(q)) && !albumsMap.has(s.album.id)) {
            albumsMap.set(s.album.id, {
              id: s.album.id,
              type: 'album',
              name: s.album.title,
              artist: s.artist.name,
              imageUrl: s.album.coverUrl
            });
          }
        });

        const artistsMap = new Map<string, SearchResult>();
        songs.forEach(s => {
          if (s.artist.name.toLowerCase().includes(q) && !artistsMap.has(s.artist.id)) {
            artistsMap.set(s.artist.id, {
              id: s.artist.id,
              type: 'artist',
              name: s.artist.name,
              imageUrl: s.artist.imageUrl
            });
          }
        });

        return [...Array.from(artistsMap.values()), ...Array.from(albumsMap.values()), ...songResults].slice(0, 10);
      }),
      delay(300)
    );
  }

  searchSongs(query: string): Observable<Song[]> {
    const q = query.toLowerCase().trim();
    return this.musicService.getSongs().pipe(
      map(songs => songs.filter(s => 
        s.title.toLowerCase().includes(q) || s.artist.name.toLowerCase().includes(q)
      )),
      delay(300)
    );
  }

  searchAlbums(query: string): Observable<Album[]> {
    const q = query.toLowerCase().trim();
    return this.musicService.getAlbums().pipe(
      map(albums => albums.filter(a => 
        a.title.toLowerCase().includes(q) || a.artist.name.toLowerCase().includes(q)
      )),
      delay(300)
    );
  }

  searchArtists(query: string): Observable<Artist[]> {
    const q = query.toLowerCase().trim();
    return this.musicService.getArtists().pipe(
      map(artists => artists.filter(a => a.name.toLowerCase().includes(q))),
      delay(300)
    );
  }
}
