import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/interfaces/user.model';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import Swal from 'sweetalert2';

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
  totalPages = 2;

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = this.page): void {
    this.loading = true;
    this.page = Math.max(1, page);

    this.usersSvc.getAll(this.page, this.perPage).subscribe({
      next: (res: any) => {
        this.users = res.results ?? [];
        this.totalPages = res.total_pages ?? 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('[home] Error de la API:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el listado de usuarios'
        });
      },
    });
  }

  confirmDelete(u: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará a ${u.first_name} ${u.last_name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersSvc.delete(u._id || u.id).subscribe({
          next: (response) => {
            console.log('[delete] Respuesta de la API:', response);
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El usuario ha sido eliminado correctamente',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadUsers();
          },
          error: (err) => {
            console.error('[delete] Error de la API:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el usuario'
            });
          },
        });
      }
    });
  }
}
