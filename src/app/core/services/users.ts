import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from '../interfaces/user.model';

interface GetAllResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: User[];
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly urlAPI = 'https://peticiones.online/api/users';

  constructor(private http: HttpClient) {}

  getAll(page?: number, per_page?: number): Observable<GetAllResponse> {
    const params: any = {};
    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    return this.http.get<GetAllResponse>(this.urlAPI, { params });
  }

  getById(_id: string | number): Observable<User> {
    return this.http.get<any>(`${this.urlAPI}/${_id}`).pipe(
      map((res) => {
        const user = res?.data ?? res?.result ?? res;
        return user;
      })
    );
  }

  create(payload: CreateUserRequest): Observable<User> {
    return this.http.post<any>(this.urlAPI, payload).pipe(
      map((res) => {
        const user = res?.data ?? res?.result ?? res;
        return user;
      })
    );
  }

  update(_id: string | number, payload: UpdateUserRequest): Observable<User> {
    return this.http.put<any>(`${this.urlAPI}/${_id}`, payload).pipe(
      map((res) => {
        const user = res?.data ?? res?.result ?? res;
        return user;
      })
    );
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.urlAPI}/${id}`).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
