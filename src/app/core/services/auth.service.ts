import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);
  public user$ = this._user$.asObservable();

  constructor() {
    // Load user from localStorage if exists (only in browser environment)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          this._user$.next(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }

  login(user: User) { 
    this._user$.next(user);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    }
  }

  logout() { 
    this._user$.next(null);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Error removing user from localStorage:', error);
      }
    }
  }

  getCurrentUser(): User | null {
    return this._user$.value;
  }

  isAuthenticated(): boolean {
    return this._user$.value !== null;
  }
}
