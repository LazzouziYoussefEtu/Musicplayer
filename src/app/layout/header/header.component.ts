import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchComponent } from '../../shared/search/search.component';
import { User } from '../../core/models/user.model';
import { SearchResult } from '../../core/services/search.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    SearchComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() toggleNav = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() searchSelected = new EventEmitter<SearchResult>();

  currentTheme$ = this.themeService.theme$;
  availableUsers: User[] = [];

  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.availableUsers = this.authService.getAvailableUsers();
  }

  onToggleNav() { this.toggleNav.emit(); }
  onLogout() { this.logout.emit(); }
  onSearchSelected(result: SearchResult) { this.searchSelected.emit(result); }
  onToggleTheme() { this.themeService.toggleTheme(); }
  
  onSwitchUser(user: User) {
    this.authService.switchUser(user);
  }
}
