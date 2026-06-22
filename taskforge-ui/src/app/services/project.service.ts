import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, CreateProjectRequest } from '../models/project';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:8080/api/projects';

    constructor(private http: HttpClient) {}

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(this.apiUrl);
    }

    getProjectById(id: number): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/${id}`)
    }

    createProject(request: CreateProjectRequest): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, request);
    }

    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}