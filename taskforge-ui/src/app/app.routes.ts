import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { ProjectList } from './components/project-list/project-list';
import { ProjectForm } from './components/project-form/project-form';
import { TaskBoard } from './components/task-board/task-board';
import { TaskForm } from './components/task-form/task-form';
import { TaskDetail } from './components/task-detail/task-detail';
import { UserProfile } from './components/user-profile/user-profile';
import { AdminUsers } from './components/admin-users/admin-users';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    component: ProjectList,
    canActivate: [authGuard]
  },
  {
    path: 'projects/new',
    component: ProjectForm,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:id/board',
    component: TaskBoard,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id',
    component: TaskDetail,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id/edit',
    component: TaskForm,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: UserProfile,
    canActivate: [authGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsers,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];