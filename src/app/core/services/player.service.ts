import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerState, Song } from '../models/music.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    repeat: 'off',
    shuffle: false
  };

  private playerState$ = new BehaviorSubject<PlayerState>(this.initialState);
  public player$ = this.playerState$.asObservable();
  
  private audio: HTMLAudioElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.audio = new Audio();
      this.setupAudioListeners();
    }
  }

  private setupAudioListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      this.updateState({ currentTime: this.audio?.currentTime || 0 });
    });

    this.audio.addEventListener('durationchange', () => {
      this.updateState({ duration: this.audio?.duration || 0 });
    });

    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.audio.addEventListener('play', () => {
      this.updateState({ isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });
  }

  private updateState(newState: Partial<PlayerState>): void {
    this.playerState$.next({
      ...this.playerState$.value,
      ...newState
    });
  }

  getCurrentState(): PlayerState {
    return this.playerState$.value;
  }

  play(song: Song, queue: Song[] = [song]): void {
    const currentIndex = queue.findIndex(s => s.id === song.id);
    this.updateState({
      currentTrack: song,
      queue,
      currentIndex: currentIndex >= 0 ? currentIndex : 0,
      isPlaying: true
    });

    if (this.audio) {
      this.audio.src = song.audioUrl;
      this.audio.play().catch(err => console.error('Audio play failed:', err));
    }
  }

  playQueue(queue: Song[], startIndex: number = 0): void {
    if (queue.length === 0) return;
    this.play(queue[startIndex], queue);
  }

  togglePlayPause(): void {
    const state = this.playerState$.value;
    if (!state.currentTrack || !this.audio) return;

    if (state.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => console.error('Audio play failed:', err));
    }
  }

  nextTrack(): void {
    const state = this.playerState$.value;
    if (state.queue.length === 0) return;

    let nextIndex: number;
    
    if (state.shuffle) {
      nextIndex = Math.floor(Math.random() * state.queue.length);
    } else {
      nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0;
        } else {
          this.stop();
          return;
        }
      }
    }

    this.play(state.queue[nextIndex], state.queue);
  }

  previousTrack(): void {
    const state = this.playerState$.value;
    if (state.queue.length === 0) return;

    let prevIndex: number;
    
    if (state.shuffle) {
      prevIndex = Math.floor(Math.random() * state.queue.length);
    } else {
      prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        if (state.repeat === 'all') {
          prevIndex = state.queue.length - 1;
        } else {
          prevIndex = 0;
        }
      }
    }

    this.play(state.queue[prevIndex], state.queue);
  }

  setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    this.updateState({ volume: normalizedVolume });
    if (this.audio) {
      this.audio.volume = normalizedVolume;
    }
  }

  setCurrentTime(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
      this.updateState({ currentTime: time });
    }
  }

  addToQueue(song: Song): void {
    const state = this.playerState$.value;
    this.updateState({ queue: [...state.queue, song] });
  }

  toggleRepeat(): void {
    const state = this.playerState$.value;
    const repeat = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
    this.updateState({ repeat });
  }

  toggleShuffle(): void {
    const state = this.playerState$.value;
    this.updateState({ shuffle: !state.shuffle });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.updateState({ isPlaying: false, currentTime: 0 });
  }
}