import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
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
    this.page = Math.max(1, page); // evita valores < 1

    this.usersSvc.getAll(this.page, this.perPage).subscribe({
      next: (res: any) => {
        this.users = res.results ?? [];
        this.totalPages = res.total_pages ?? 1;   // 👈 clave para la paginación
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('No se pudo cargar el listado');
      }
    });
  }

  confirmDelete(u: User): void {
    if (!confirm(`¿Eliminar a ${u.first_name}?`)) return;
    this.usersSvc.delete(u.id).subscribe({
      next: () => { alert('Borrado enviado (mock).'); this.loadUsers(); },
      error: () => alert('No se pudo eliminar')
    });
  }
}
