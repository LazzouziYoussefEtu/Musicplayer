import { Song, Album, Artist, Playlist, Genre } from '../models/music.model';

const MOCK_GENRES: Genre[] = [
  { id: '1', name: 'Electronic', description: 'Electronic music' },
  { id: '2', name: 'Synthwave', description: 'Synthwave music' },
  { id: '3', name: 'Ambient', description: 'Ambient music' },
  { id: '4', name: 'Pop', description: 'Pop music' },
  { id: '5', name: 'Rock', description: 'Rock music' },
  { id: '6', name: 'Hip-Hop', description: 'Hip-Hop music' },
  { id: '7', name: 'Classical', description: 'Classical music' },
  { id: '8', name: 'Chill', description: 'Chill music' }
];

const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Luna Wave',
    bio: 'Electronic music producer from the future',
    imageUrl: 'https://via.placeholder.com/300?text=Luna+Wave',
    followers: 50000
  },
  {
    id: '2',
    name: 'Synth Master',
    bio: 'Pioneering synthwave artist',
    imageUrl: 'https://via.placeholder.com/300?text=Synth+Master',
    followers: 75000
  },
  {
    id: '3',
    name: 'Coastal Vibes',
    bio: 'Ambient music specialist',
    imageUrl: 'https://via.placeholder.com/300?text=Coastal+Vibes',
    followers: 60000
  },
  {
    id: '4',
    name: 'Electric Pulse',
    bio: 'Electronic dance music creator',
    imageUrl: 'https://via.placeholder.com/300?text=Electric+Pulse',
    followers: 80000
  },
  {
    id: '5',
    name: 'Night Owl',
    bio: 'Pop music sensation',
    imageUrl: 'https://via.placeholder.com/300?text=Night+Owl',
    followers: 120000
  }
];

const MOCK_ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Cosmic Journey',
    artist: MOCK_ARTISTS[0],
    coverUrl: 'https://via.placeholder.com/300?text=Cosmic+Journey',
    releaseDate: new Date('2023-01-15'),
    totalDuration: 2400,
    songCount: 12
  },
  {
    id: '2',
    title: 'Urban Nights',
    artist: MOCK_ARTISTS[1],
    coverUrl: 'https://via.placeholder.com/300?text=Urban+Nights',
    releaseDate: new Date('2023-03-20'),
    totalDuration: 2100,
    songCount: 10
  },
  {
    id: '3',
    title: 'Summer Breeze',
    artist: MOCK_ARTISTS[2],
    coverUrl: 'https://via.placeholder.com/300?text=Summer+Breeze',
    releaseDate: new Date('2023-06-10'),
    totalDuration: 2300,
    songCount: 11
  },
  {
    id: '4',
    title: 'Heart Rhythm',
    artist: MOCK_ARTISTS[3],
    coverUrl: 'https://via.placeholder.com/300?text=Heart+Rhythm',
    releaseDate: new Date('2023-05-12'),
    totalDuration: 1900,
    songCount: 9
  },
  {
    id: '5',
    title: 'Metro Tales',
    artist: MOCK_ARTISTS[4],
    coverUrl: 'https://via.placeholder.com/300?text=Metro+Tales',
    releaseDate: new Date('2023-04-25'),
    totalDuration: 2200,
    songCount: 11
  }
];

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: MOCK_ARTISTS[0],
    album: MOCK_ALBUMS[0],
    duration: 245,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Midnight+Dreams',
    genre: MOCK_GENRES[0],
    releaseDate: new Date('2023-01-15'),
    playCount: 15000
  },
  {
    id: '2',
    title: 'Neon Lights',
    artist: MOCK_ARTISTS[1],
    album: MOCK_ALBUMS[1],
    duration: 203,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Neon+Lights',
    genre: MOCK_GENRES[1],
    releaseDate: new Date('2023-03-20'),
    playCount: 20000
  },
  {
    id: '3',
    title: 'Ocean Waves',
    artist: MOCK_ARTISTS[2],
    album: MOCK_ALBUMS[2],
    duration: 267,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Ocean+Waves',
    genre: MOCK_GENRES[2],
    releaseDate: new Date('2023-06-10'),
    playCount: 12000
  },
  {
    id: '4',
    title: 'Electric Heart',
    artist: MOCK_ARTISTS[3],
    album: MOCK_ALBUMS[3],
    duration: 198,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Electric+Heart',
    genre: MOCK_GENRES[0],
    releaseDate: new Date('2023-05-12'),
    playCount: 18000
  },
  {
    id: '5',
    title: 'City Lights',
    artist: MOCK_ARTISTS[4],
    album: MOCK_ALBUMS[4],
    duration: 234,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=City+Lights',
    genre: MOCK_GENRES[3],
    releaseDate: new Date('2023-04-25'),
    playCount: 25000
  },
  {
    id: '6',
    title: 'Paradise',
    artist: MOCK_ARTISTS[0],
    album: MOCK_ALBUMS[0],
    duration: 289,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Paradise',
    genre: MOCK_GENRES[2],
    releaseDate: new Date('2023-01-20'),
    playCount: 14000
  },
  {
    id: '7',
    title: 'Digital Soul',
    artist: MOCK_ARTISTS[3],
    album: MOCK_ALBUMS[3],
    duration: 256,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Digital+Soul',
    genre: MOCK_GENRES[0],
    releaseDate: new Date('2023-05-18'),
    playCount: 16000
  },
  {
    id: '8',
    title: 'Starlight',
    artist: MOCK_ARTISTS[2],
    album: MOCK_ALBUMS[2],
    duration: 278,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Starlight',
    genre: MOCK_GENRES[2],
    releaseDate: new Date('2023-06-15'),
    playCount: 13000
  },
  {
    id: '9',
    title: 'Thunder Road',
    artist: MOCK_ARTISTS[1],
    album: MOCK_ALBUMS[1],
    duration: 212,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Thunder+Road',
    genre: MOCK_GENRES[4],
    releaseDate: new Date('2023-03-25'),
    playCount: 19000
  },
  {
    id: '10',
    title: 'Summer Vibes',
    artist: MOCK_ARTISTS[4],
    album: MOCK_ALBUMS[4],
    duration: 201,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Summer+Vibes',
    genre: MOCK_GENRES[3],
    releaseDate: new Date('2023-04-28'),
    playCount: 22000
  },
  {
    id: '11',
    title: 'Moonlight Sonata',
    artist: MOCK_ARTISTS[0],
    album: MOCK_ALBUMS[0],
    duration: 324,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Moonlight+Sonata',
    genre: MOCK_GENRES[6],
    releaseDate: new Date('2023-01-25'),
    playCount: 11000
  },
  {
    id: '12',
    title: 'Rhythm Master',
    artist: MOCK_ARTISTS[4],
    album: MOCK_ALBUMS[4],
    duration: 245,
    audioUrl: '#',
    coverUrl: 'https://via.placeholder.com/300?text=Rhythm+Master',
    genre: MOCK_GENRES[5],
    releaseDate: new Date('2023-05-01'),
    playCount: 21000
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: '1',
    title: 'Chill Vibes',
    description: 'Relaxing tracks for any time',
    coverUrl: 'https://via.placeholder.com/300?text=Chill+Vibes',
    songs: [MOCK_SONGS[2], MOCK_SONGS[5], MOCK_SONGS[7]],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-20'),
    isPublic: true,
    songCount: 3
  },
  {
    id: '2',
    title: 'Electronic Beats',
    description: 'Electronic and synth tracks',
    coverUrl: 'https://via.placeholder.com/300?text=Electronic+Beats',
    songs: [MOCK_SONGS[0], MOCK_SONGS[1], MOCK_SONGS[3], MOCK_SONGS[6]],
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-12-20'),
    isPublic: true,
    songCount: 4
  },
  {
    id: '3',
    title: 'Pop Hits',
    description: 'Popular songs from around the world',
    coverUrl: 'https://via.placeholder.com/300?text=Pop+Hits',
    songs: [MOCK_SONGS[4], MOCK_SONGS[9]],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-12-20'),
    isPublic: true,
    songCount: 2
  },
  {
    id: '4',
    title: 'Late Night Mix',
    description: 'Perfect for late night sessions',
    coverUrl: 'https://via.placeholder.com/300?text=Late+Night+Mix',
    songs: [MOCK_SONGS[0], MOCK_SONGS[2], MOCK_SONGS[4], MOCK_SONGS[8]],
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-12-20'),
    isPublic: false,
    songCount: 4
  }
];

export { MOCK_GENRES, MOCK_ARTISTS, MOCK_ALBUMS };
