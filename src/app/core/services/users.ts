import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

interface GetAllResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: User[];  
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly base = 'https://peticiones.online/api/users';

  constructor(private http: HttpClient) {}

  getAll(page?: number, per_page?: number): Observable<GetAllResponse> {
    const params: any = {};
    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    return this.http.get<GetAllResponse>(this.base, { params });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  create(payload: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.base, payload);
  }

  update(id: number, payload: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(`${this.base}/${id}`);
  }
}