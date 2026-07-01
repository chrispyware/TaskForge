import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest } from '../models/task';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiBaseUrl}/tasks`;

    constructor(private http: HttpClient) {}

    getTasksByProjectId(projectId: number): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`);
    }

    getTaskById(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`);
    }

    createTask(request: CreateTaskRequest): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, request);
    }

    updateTask(id: number, request: UpdateTaskRequest): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
    }

    updateTaskStatus(id: number, request: UpdateTaskStatusRequest): Observable<Task> {
        return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, request);
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}