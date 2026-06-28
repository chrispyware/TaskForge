import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

interface CommandPaletteItem {
  label: string;
  description: string;
  icon: string;
  route: string;
  queryParams?: Record<string, string>;
}

@Component({
  selector: 'app-command-palette',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss'
})
export class CommandPalette {
  @ViewChild('commandInput') commandInput?: ElementRef<HTMLInputElement>;

  isOpen = false;
  searchTerm = '';
  selectedIndex = 0;

  commands: CommandPaletteItem[] = [
    { label: 'Dashboard', description: 'Go to your project overview', icon: 'dashboard', route: '/dashboard' },
    { label: 'Projects', description: 'View all projects', icon: 'folder', route: '/projects' },
    { label: 'New Project', description: 'Create a new project', icon: 'create_new_folder', route: '/projects/new' },
    { label: 'Recent Tasks', description: 'View recently updated tasks', icon: 'history', route: '/tasks', queryParams: { filter: 'recent' } },
    { label: 'In Progress Tasks', description: 'View tasks currently in progress', icon: 'pending', route: '/tasks', queryParams: { filter: 'in-progress' } },
    { label: 'Profile', description: 'Manage your account settings', icon: 'person', route: '/profile' },
    { label: 'Admin Users', description: 'Manage users and roles', icon: 'admin_panel_settings', route: '/admin/users' }
  ];

  constructor(private router: Router) {}

  get filteredCommands(): CommandPaletteItem[] {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      return this.commands;
    }

    return this.commands.filter(command =>
      command.label.toLowerCase().includes(term) ||
      command.description.toLowerCase().includes(term)
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    const isCommandPaletteShortcut =
      (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';

    if (isCommandPaletteShortcut) {
      event.preventDefault();
      this.openPalette();
      return;
    }

    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePalette();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveSelection(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveSelection(-1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.runSelectedCommand();
    }
  }

  openPalette(): void {
    this.isOpen = true;
    this.searchTerm = '';
    this.selectedIndex = 0;

    setTimeout(() => {
      this.commandInput?.nativeElement.focus();
    });
  }

  closePalette(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.selectedIndex = 0;
  }

  onSearchChange(): void {
    this.selectedIndex = 0;
  }

  moveSelection(direction: number): void {
    const commandCount = this.filteredCommands.length;

    if (commandCount === 0) {
      this.selectedIndex = 0;
      return;
    }

    this.selectedIndex =
      (this.selectedIndex + direction + commandCount) % commandCount;
  }

  runSelectedCommand(): void {
    const command = this.filteredCommands[this.selectedIndex];

    if (command) {
      this.runCommand(command);
    }
  }

  runCommand(command: CommandPaletteItem): void {
    this.closePalette();

    this.router.navigate([command.route], {
      queryParams: command.queryParams
    });
  }
}