import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    searchUsers(query: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/serach?q=${query}`);
    }

    updateProfile(id: number, request: Partial<User>): Observable<User> {
        return this.http.put<User>(`f${this.apiUrl}/${id}`, request);
    }

    updatePassword(id: number, currentPassword: string, newPassword: string): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${id}/password`, {
            currentPassword,
            newPassword
        });
    }
}