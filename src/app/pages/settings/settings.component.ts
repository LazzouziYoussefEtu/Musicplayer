import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupThemeListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.settingsForm = this.fb.group({
      audioQuality: ['high', Validators.required],
      theme: [this.themeService.getCurrentTheme(), Validators.required],
      notifications: [true],
      privateSession: [false]
    });
  }

  setupThemeListener(): void {
    this.settingsForm.get('theme')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.themeService.setTheme(theme);
      });
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      console.log('Settings saved:', this.settingsForm.value);
    }
  }
}
