import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Task } from '../../models/task';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Navbar,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatAutocompleteModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm implements OnInit {
  taskForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  taskId: number | null = null;
  projectId: number = 0;
  users: User[] = [];
  errorMessage = '';

  priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      description: [''],
      priority: ['MEDIUM', Validators.required],
      status: ['TODO', Validators.required],
      assignedToId: [null],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.queryParamMap.get('projectId'));
    this.taskId = Number(this.route.snapshot.paramMap.get('id')) || null;
    this.isEditMode = !!this.taskId;
    this.loadUsers();

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.cdr.detectChanges();
      },
      error: () => {
        console.log('Could not load users for assignment');
      }
    });
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          assignedToId: task.assignedToId,
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        });
        this.projectId = task.projectId;
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

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Task updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/projects', this.projectId, 'board']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Failed to update task.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.taskService.createTask({
        ...this.taskForm.value,
        projectId: this.projectId
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Task created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/projects', this.projectId, 'board']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Failed to create task.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/projects', this.projectId, 'board']);
  }
}