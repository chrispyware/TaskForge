import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss'
})
export class EmptyState {
  @Input() icon = 'inbox';
  @Input() title = 'Nothing Found';
  @Input() message = 'There is nothing to display yet.';
  @Input() actionLabel?: string;
  @Input() actionIcon = 'add';
  @Input() actionRoute?: string | any[];
}