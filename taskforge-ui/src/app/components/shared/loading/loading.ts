import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading {
  @Input() title = 'TASKFORGE';
  @Input() message = 'Loading...';
  @Input() subtext = 'Please wait...';
}
