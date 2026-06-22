import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Navbar,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isLoadingProfile = false;
  isLoadingPassword = false;
  profileErrorMessage = '';
  passwordErrorMessage = '';
  currentUserId: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.profileForm.patchValue({
      displayName: currentUser?.displayName,
      email: currentUser?.email
    });

    // We need the user's numeric ID, fetch it from the backend using email
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const match = users.find(u => u.email === currentUser?.email);
        if (match) {
          this.currentUserId = match.id;
        }
        this.cdr.detectChanges();
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmitProfile(): void {
    if (this.profileForm.invalid || !this.currentUserId) return;

    this.isLoadingProfile = true;
    this.profileErrorMessage = '';

    this.userService.updateProfile(this.currentUserId, this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.isLoadingProfile = false;

        const currentUser = this.authService.getCurrentUser();
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          displayName: updatedUser.displayName,
          email: updatedUser.email
        }));

        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingProfile = false;
        this.profileErrorMessage = err.error?.message || 'Failed to update profile.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmitPassword(): void {
    if (this.passwordForm.invalid || !this.currentUserId) return;

    this.isLoadingPassword = true;
    this.passwordErrorMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.updatePassword(this.currentUserId, currentPassword, newPassword).subscribe({
      next: () => {
        this.isLoadingPassword = false;
        this.passwordForm.reset();
        this.snackBar.open('Password updated successfully!', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingPassword = false;
        this.passwordErrorMessage = err.error?.message || 'Failed to update password.';
        this.cdr.detectChanges();
      }
    });
  }
}