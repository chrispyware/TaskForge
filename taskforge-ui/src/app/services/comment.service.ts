import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentRequest } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
    private apiUrl = 'http://localhost:8080/api/tasks/';

    constructor(private http: HttpClient) {}

    getComments(taskId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/${taskId}/comments`);
    }

    addComments(taskId: number, request: CreateCommentRequest): Observable<Comment> {
        return this.http.post<Comment>(`${this.apiUrl}/${taskId}/comments`, request);
    }
}