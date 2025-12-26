import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly defaultTheme: Theme = 'light';

  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private getInitialTheme(): Theme {
    if (this.isServerSide()) {
      return this.defaultTheme;
    }

    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return this.getSystemPreference() || this.defaultTheme;
  }

  private getSystemPreference(): Theme | null {
    if (this.isServerSide()) {
      return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private initializeTheme(): void {
    const currentTheme = this.themeSubject.value;
    this.applyTheme(currentTheme);
  }

  private applyTheme(theme: Theme): void {
    if (this.isServerSide()) {
      return;
    }

    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark-mode');
      htmlElement.classList.remove('light-mode');
    } else {
      htmlElement.classList.add('light-mode');
      htmlElement.classList.remove('dark-mode');
    }
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  setTheme(theme: Theme): void {
    if (theme !== 'light' && theme !== 'dark') {
      return;
    }

    this.themeSubject.next(theme);
    this.persistTheme(theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private persistTheme(theme: Theme): void {
    if (this.isServerSide()) {
      return;
    }

    localStorage.setItem(this.THEME_KEY, theme);
  }

  private isServerSide(): boolean {
    return typeof window === 'undefined';
  }
}
