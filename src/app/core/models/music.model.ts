export interface Genre {
  id: string;
  name: string;
  description: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  followers: number;
  createdAt?: Date;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  coverUrl: string;
  releaseDate: Date;
  totalDuration: number;
  songCount: number;
  createdAt?: Date;
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  genre: Genre;
  releaseDate: Date;
  playCount: number;
  createdAt?: Date;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  songCount: number;
}

export interface PlayerState {
  currentTrack: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  currentTime: number;
  duration: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
}
