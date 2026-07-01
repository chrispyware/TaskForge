import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentRequest } from '../models/comment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
    private apiUrl = `${environment.apiBaseUrl}/comments`;

    constructor(private http: HttpClient) {}

    getComments(taskId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/${taskId}/comments`);
    }

    addComments(taskId: number, request: CreateCommentRequest): Observable<Comment> {
        return this.http.post<Comment>(`${this.apiUrl}/${taskId}/comments`, request);
    }
}