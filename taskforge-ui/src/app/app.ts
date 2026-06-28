import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommandPalette } from './components/command-palette/command-palette';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommandPalette],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('taskforge-ui');
}
