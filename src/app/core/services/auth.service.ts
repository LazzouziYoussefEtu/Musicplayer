import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', avatarUrl: 'https://via.placeholder.com/150?text=Alice' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', avatarUrl: 'https://via.placeholder.com/150?text=Bob' },
  { id: 'u3', name: 'Charlie', email: 'charlie@example.com', avatarUrl: 'https://via.placeholder.com/150?text=Charlie' }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(MOCK_USERS[0]); // Default to Alice
  public user$ = this._user$.asObservable();

  constructor() {
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

  getAvailableUsers(): User[] {
    return MOCK_USERS;
  }

  switchUser(user: User) {
    this.login(user);
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