import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { TaskQueryService } from '../../services/task-query.service';
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { Navbar } from '../navbar/navbar';
import { EmptyState } from '../shared/empty-state/empty-state';
import { Loading } from '../shared/loading/loading';
import { TasksByStatusPipe } from '../../pipes/tasks-by-status-pipe';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

type RecentTaskSortField = 'title' | 'projectName' | 'status' | 'priority';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    Navbar,
    EmptyState,
    Loading,
    TasksByStatusPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  currentUser: any;
  projects: Project[] = [];
  recentTasks: Task[] = [];
  isLoading = true;
  recentTaskSortField: RecentTaskSortField = 'title';
  recentTaskSortDirection: SortDirection = 'asc';

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private taskQueryService: TaskQueryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.projectService.getProjects().subscribe({
    next: projects => {
      this.projects = projects;
      this.loadRecentTasks();
    },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRecentTasks(): void {
    this.taskQueryService.getRecentTasks(5).subscribe({
      next: (tasks) => {
        this.recentTasks = tasks;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get sortedRecentTasks(): Task[] {
    return [...this.recentTasks].sort((a, b) => {
      const direction = this.recentTaskSortDirection === 'asc' ? 1 : -1;

      if (this.recentTaskSortField === 'priority') {
        return (
          this.getPriorityRank(a.priority) - this.getPriorityRank(b.priority)
        ) * direction || this.compareByTitle(a, b);
      }

      if (this.recentTaskSortField === 'status') {
        return (
          this.getStatusRank(a.status) - this.getStatusRank(b.status)
        ) * direction || this.compareByTitle(a, b);
      }

      if (this.recentTaskSortField === 'projectName') {
        const projectCompare = this.compareStrings(a.projectName, b.projectName) * direction;
        return projectCompare || this.compareByTitle(a, b);
      }

      const aValue = String(a[this.recentTaskSortField] ?? '').toLowerCase();
      const bValue = String(b[this.recentTaskSortField] ?? '').toLowerCase();

      return aValue.localeCompare(bValue) * direction;
    });
  }

  sortRecentTasks(field: RecentTaskSortField): void {
    if (this.recentTaskSortField === field) {
      this.recentTaskSortDirection = this.recentTaskSortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.recentTaskSortField = field;
    this.recentTaskSortDirection = 'asc';
  }

  getSortIcon(field: RecentTaskSortField): string {
    if (this.recentTaskSortField !== field) {
      return 'unfold_more';
    }

    return this.recentTaskSortDirection === 'asc'
    ? 'keyboard_arrow_up'
    : 'keyboard_arrow_down';
  }

  private getPriorityRank(priority: string): number {
    switch (priority) {
      case 'CRITICAL': return 1;
      case 'HIGH': return 2;
      case 'MEDIUM': return 3;
      case 'LOW': return 4;
      default: return 5;
    }
  }

  private getStatusRank(status: string): number {
    switch (status) {
      case 'TODO': return 1;
      case 'IN_PROGRESS': return 2;
      case 'REVIEW': return 3;
      case 'DONE': return 4;
      default: return 5;
    }
  }

  private compareByTitle(a: Task, b: Task): number {
    return this.compareStrings(a.title, b.title);
  }

  private compareStrings(a?: string, b?: string): number {
    return String(a ?? '').toLowerCase().localeCompare(
      String(b ?? '').toLowerCase()
    );
  }

  navigateToBoard(projectId: number): void {
    this.router.navigate(['/projects', projectId, 'board']);
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  navigateToRecentTasks(): void {
    this.router.navigate(['/tasks'], {
      queryParams: { filter: 'recent' }
    });
  }

  navigateToInProgressTasks(): void {
    this.router.navigate(['/tasks'], {
      queryParams: { filter: 'in-progress' }
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return 'warn';
      case 'HIGH': return 'accent';
      case 'MEDIUM': return 'primary';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'DONE': return 'done';
      case 'IN_PROGRESS': return 'in-progress';
      case 'REVIEW': return 'review';
      default: return 'todo';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}