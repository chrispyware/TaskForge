import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { Navbar } from '../navbar/navbar';
import { TasksByStatusPipe } from '../../pipes/tasks-by-status-pipe';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    Navbar,
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

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
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
    if (this.projects.length === 0) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const firstProjectId = this.projects[0].id;
    this.taskService.getTasksByProjectId(firstProjectId).subscribe({
      next: (tasks) => {
        this.recentTasks = tasks.slice(0, 5);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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