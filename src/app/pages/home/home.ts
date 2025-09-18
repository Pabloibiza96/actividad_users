import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersService } from '../../core/services/users';
import { User } from '../../core/interfaces/user.model';
import { UserCardComponent } from '../../components/user-card/user-card.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, UserCardComponent],
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  loading = false;

  page = 1;
  perPage = 6;         
  totalPages = 3;

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(page = this.page): void {
    this.loading = true;
    this.page = Math.max(1, page); 

    this.usersSvc.getAll(this.page, this.perPage).subscribe({
      next: (res: any) => {
        console.log('[home] Respuesta de la API:', res);
        this.users = res.results ?? [];
        this.totalPages = res.total_pages ?? 1;   
        this.loading = false;
        console.log('[home] Usuarios cargados:', this.users);
      },
      error: (err) => {
        console.error('[home] Error de la API:', err);
        this.loading = false;
        alert('No se pudo cargar el listado');
      }
    });
  }

  confirmDelete(u: User): void {
    if (!confirm(`¿Eliminar a ${u.first_name}?`)) return;
    this.usersSvc.delete(u._id || u.id).subscribe({
      next: (response) => { 
        console.log('[delete] Respuesta de la API:', response);
        alert('Usuario eliminado'); 
        this.loadUsers(); 
      },
      error: (err) => {
        console.error('[delete] Error de la API:', err);
        alert('No se pudo eliminar');
      }
    }); 
  }


}
