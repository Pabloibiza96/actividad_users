import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User, CreateUserRequest, UpdateUserRequest } from '../interfaces/user.model';

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

  getById(id: string | number): Observable<User> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map((res) => {
        const user = res?.data ?? res?.result ?? res;
        // Normaliza el campo id si viene como _id
        if (user && user._id && !user.id) {
          user.id = user._id;
        }
        return user;
      })
    );

  }

  create(payload: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.base, payload);
  }

  update(id: string | number, payload: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(`${this.base}/${id}`);
  }
}