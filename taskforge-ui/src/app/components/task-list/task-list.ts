import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

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
    private projectService: ProjectService,
    private taskService: TaskService,
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

    this.projectService.getProjects().subscribe({
      next: projects => {
        if (projects.length === 0) {
          this.tasks = [];
          this.filteredTasks = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        const taskRequests = projects.map(project =>
          this.taskService.getTasksByProjectId(project.id).pipe(
            catchError(() => of([] as Task[]))
          )
        );

        forkJoin(taskRequests).subscribe({
          next: taskGroups => {
            this.tasks = taskGroups.flat();
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
    const assignedTasks = this.tasks.filter(task =>
      task.assignedToId === this.currentUser?.id
    );

    if (this.filter === 'in-progress') {
      this.filteredTasks = assignedTasks
        .filter(task => task.status === 'IN_PROGRESS')
        .sort((a, b) => this.sortNewestFirst(a, b));
      return;
    }

    if (this.filter === 'recent') {
      this.filteredTasks = assignedTasks
        .sort((a, b) => this.sortNewestFirst(a, b))
        .slice(0, 10);
      return;
    }

    this.filteredTasks = assignedTasks.sort((a, b) =>
      this.sortNewestFirst(a, b)
    );
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
      return 'Tasks currently in progress and assigned to you.';
    }

    if (this.filter === 'recent') {
      return 'Your most recently updated assigned tasks.';
    }

    return 'All tasks currently assigned to you.';
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