import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { TaskQueryService } from '../../services/task-query.service';
import { Task } from '../../models/task';
import { EmptyState } from '../shared/empty-state/empty-state';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    RouterLink,
    Navbar,
    EmptyState,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {
  currentUser: any;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = true;
  filter = 'assigned';

  constructor(
    private authService: AuthService,
    private taskQueryService: TaskQueryService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.route.queryParamMap.subscribe(params => {
      this.filter = params.get('filter') || 'assigned';
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.isLoading = true;

  this.taskQueryService.getAllProjectTasks().subscribe({
    next: tasks => {
      this.tasks = tasks;
      this.applyFilter();
      this.isLoading = false;
      this.cdr.detectChanges();
    },
      error: () => {
        this.tasks = [];
        this.filteredTasks = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    if (this.filter === 'in-progress') {
      this.filteredTasks = this.taskQueryService.getInProgressTasksFrom(this.tasks);
      return;
    }

    if (this.filter === 'recent') {
      this.filteredTasks = this.taskQueryService.getRecentTasksFrom(this.tasks, 10);
      return;
    }

    this.filteredTasks = this.taskQueryService.getRecentTasksFrom(this.tasks);
  }

  navigateToTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  getPageTitle(): string {
    if (this.filter === 'in-progress') {
      return 'In Progress Tasks';
    }

    if (this.filter === 'recent') {
      return 'Recent Tasks';
    }

    return 'Assigned Tasks';
  }

  getPageSubtitle(): string {
    if (this.filter === 'in-progress') {
      return 'Tasks currently in progress across all of your projects.';
    }

    if (this.filter === 'recent') {
      return 'Recently updated tasks across all of your projects.';
    }

    return 'All tasks across your projects.';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'DONE': return 'done';
      case 'IN_PROGRESS': return 'in-progress';
      case 'REVIEW': return 'review';
      default: return 'todo';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      default: return 'low';
    }
  }

  private sortNewestFirst(a: Task, b: Task): number {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }
}