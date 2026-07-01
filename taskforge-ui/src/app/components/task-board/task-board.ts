import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { Task } from '../../models/task';
import { Project } from '../../models/project';
import { Navbar } from '../navbar/navbar';
import { EmptyState } from '../shared/empty-state/empty-state';
import { Loading } from '../shared/loading/loading';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-board',
  imports: [
    CommonModule,
    RouterLink,
    Navbar,
    EmptyState,
    Loading,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDividerModule,
    DragDropModule
  ],
  templateUrl: './task-board.html',
  styleUrl: './task-board.scss'
})
export class TaskBoard implements OnInit {
  project: Project | null = null;
  projectId: number = 0;
  isLoading = true;

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  reviewTasks: Task[] = [];
  doneTasks: Task[] = [];

  columns = [
    { id: 'todo', title: 'To Do', status: 'TODO', color: '#f5f5f5', tasks: this.todoTasks },
    { id: 'inprogress', title: 'In Progress', status: 'IN_PROGRESS', color: '#e3f2fd', tasks: this.inProgressTasks },
    { id: 'review', title: 'Review', status: 'REVIEW', color: '#fff3e0', tasks: this.reviewTasks },
    { id: 'done', title: 'Done', status: 'DONE', color: '#e8f5e9', tasks: this.doneTasks }
  ];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject();
    this.loadTasks();
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Failed to load project', 'Close', { duration: 3000 });
      }
    });
  }

  loadTasks(): void {
    this.taskService.getTasksByProjectId(this.projectId).subscribe({
      next: (tasks) => {
        this.todoTasks = tasks.filter(t => t.status === 'TODO');
        this.inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
        this.reviewTasks = tasks.filter(t => t.status === 'REVIEW');
        this.doneTasks = tasks.filter(t => t.status === 'DONE');

        this.columns = [
          { id: 'todo', title: 'To Do', status: 'TODO', color: '#f5f5f5', tasks: this.todoTasks },
          { id: 'inprogress', title: 'In Progress', status: 'IN_PROGRESS', color: '#e3f2fd', tasks: this.inProgressTasks },
          { id: 'review', title: 'Review', status: 'REVIEW', color: '#fff3e0', tasks: this.reviewTasks },
          { id: 'done', title: 'Done', status: 'DONE', color: '#e8f5e9', tasks: this.doneTasks }
        ];

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      this.taskService.updateTaskStatus(task.id, { status: newStatus }).subscribe({
        next: () => {
          this.snackBar.open(`Task moved to ${newStatus.replace('_', ' ')}`, 'Close', { duration: 2000 });
          this.cdr.detectChanges();
        },
        error: () => {
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          this.snackBar.open('Failed to update task status', 'Close', { duration: 3000 });
          this.cdr.detectChanges();
        }
      });
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

  navigateToTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  createTask(): void {
    this.router.navigate(['/tasks/new'], {
      queryParams: { projectId: this.projectId }
    });
  }
}