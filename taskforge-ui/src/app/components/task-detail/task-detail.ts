import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CommentService } from '../../services/comment.service';
import { Task } from '../../models/task';
import { Comment } from '../../models/comment';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    Navbar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss'
})
export class TaskDetail implements OnInit {
  task: Task | null = null;
  comments: Comment[] = [];
  isLoading = true;
  isLoadingComments = true;
  isSubmittingComment = false;
  commentForm: FormGroup;
  taskId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private taskService: TaskService,
    private commentService: CommentService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask();
    this.loadComments();
  }

  loadTask(): void {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load task', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  loadComments(): void {
    this.commentService.getComments(this.taskId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingComments = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid) return;

    this.isSubmittingComment = true;

    this.commentService.addComments(this.taskId, this.commentForm.value).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.commentForm.reset();
        this.isSubmittingComment = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmittingComment = false;
        this.snackBar.open('Failed to add comment', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  editTask(): void {
    this.router.navigate(['/tasks', this.taskId, 'edit']);
  }

  deleteTask(): void {
    if (!this.task) return;
    if (confirm(`Are you sure you want to delete "${this.task.title}"?`)) {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.snackBar.open('Task deleted', 'Close', { duration: 3000 });
          this.router.navigate(['/projects', this.task!.projectId, 'board']);
        },
        error: () => {
          this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'DONE': return 'done';
      case 'IN_PROGRESS': return 'in-progress';
      case 'REVIEW': return 'review';
      default: return 'todo';
    }
  }
}
