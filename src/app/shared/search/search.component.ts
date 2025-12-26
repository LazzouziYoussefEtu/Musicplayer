import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, filter, switchMap, startWith, catchError, of } from 'rxjs';
import { SearchService, SearchResult } from '../../core/services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  ctrl = new FormControl<string>('', { nonNullable: true });
  results$ = this.ctrl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(q => q.length >= 2),
    switchMap(q => this.searchService.search(q)),
    catchError(() => of([])),
    startWith([])
  );

  @Output() selected = new EventEmitter<SearchResult>();

  constructor(private searchService: SearchService) {}

  select(item: SearchResult) {
    this.selected.emit(item);
    this.ctrl.setValue('');
  }

  display(item: SearchResult): string {
    return item?.name ?? '';
  }
}