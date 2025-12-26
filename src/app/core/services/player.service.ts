import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerState, Song } from '../models/music.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    volume: 1,
    currentTime: 0,
    duration: 0,
    repeat: 'off',
    shuffle: false
  };

  private playerState$ = new BehaviorSubject<PlayerState>(this.initialState);
  public player$ = this.playerState$.asObservable();

  constructor() {}

  // Getters
  getCurrentState(): PlayerState {
    return this.playerState$.value;
  }

  // Play song
  play(song: Song, queue: Song[] = [song]): void {
    const state = this.playerState$.value;
    this.playerState$.next({
      ...state,
      currentTrack: song,
      isPlaying: true,
      queue,
      currentIndex: 0,
      currentTime: 0,
      duration: song.duration
    });
  }

  // Play queue
  playQueue(queue: Song[], startIndex: number = 0): void {
    if (queue.length === 0) return;
    
    const state = this.playerState$.value;
    this.playerState$.next({
      ...state,
      currentTrack: queue[startIndex],
      isPlaying: true,
      queue,
      currentIndex: startIndex,
      currentTime: 0,
      duration: queue[startIndex].duration
    });
  }

  // Pause/Resume
  togglePlayPause(): void {
    const state = this.playerState$.value;
    if (!state.currentTrack) return;
    
    this.playerState$.next({
      ...state,
      isPlaying: !state.isPlaying
    });
  }

  // Next track
  nextTrack(): void {
    const state = this.playerState$.value;
    if (state.queue.length === 0) return;

    let nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.queue.length) {
      if (state.repeat === 'all') {
        nextIndex = 0;
      } else {
        return; // Stop at end if repeat is off
      }
    }

    const nextTrack = state.queue[nextIndex];
    this.playerState$.next({
      ...state,
      currentIndex: nextIndex,
      currentTrack: nextTrack,
      currentTime: 0,
      duration: nextTrack.duration
    });
  }

  // Previous track
  previousTrack(): void {
    const state = this.playerState$.value;
    if (state.queue.length === 0) return;

    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = state.queue.length - 1;
    }

    const prevTrack = state.queue[prevIndex];
    this.playerState$.next({
      ...state,
      currentIndex: prevIndex,
      currentTrack: prevTrack,
      currentTime: 0,
      duration: prevTrack.duration
    });
  }

  // Set volume (0-1)
  setVolume(volume: number): void {
    const state = this.playerState$.value;
    this.playerState$.next({
      ...state,
      volume: Math.max(0, Math.min(1, volume))
    });
  }

  // Set current time
  setCurrentTime(time: number): void {
    const state = this.playerState$.value;
    this.playerState$.next({
      ...state,
      currentTime: time
    });
  }

  // Set duration
  setDuration(duration: number): void {
    const state = this.playerState$.value;
    this.playerState$.next({
      ...state,
      duration
    });
  }

  // Toggle repeat (off -> all -> one -> off)
  toggleRepeat(): void {
    const state = this.playerState$.value;
    const repeat = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
    
    this.playerState$.next({
      ...state,
      repeat
    });
  }

  // Toggle shuffle
  toggleShuffle(): void {
    const state = this.playerState$.value;
    this.playerState$.next({
      ...state,
      shuffle: !state.shuffle
    });
  }

  // Add to queue
  addToQueue(song: Song): void {
    const state = this.playerState$.value;
    const newQueue = [...state.queue, song];
    this.playerState$.next({
      ...state,
      queue: newQueue
    });
  }

  // Clear player
  clear(): void {
    this.playerState$.next(this.initialState);
  }

  // Stop playback
  stop(): void {
    const state = this.playerState$.value;
    this.playerState$.next({
      ...state,
      isPlaying: false,
      currentTime: 0
    });
  }
}
