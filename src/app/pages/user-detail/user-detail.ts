import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/interfaces/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css'],
})
export class UserDetailComponent implements OnInit {
  user?: User;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersSvc: UsersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('[detail] id recibido:', id);
    if (!id) {
      this.router.navigate(['/home']);
      return;
    }

    this.loading = true;
    this.usersSvc.getById(id).subscribe({
      next: (u) => {
        console.log('[detail]', u);
        this.user = u;
        this.loading = false;
      },
      error: (err) => {
        console.error('[detail] error API:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el usuario'
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
  goEdit(): void {
    if (this.user) this.router.navigate(['/updateuser', this.user._id]);
  }
  confirmDelete(): void {
    if (!this.user) return;
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará a ${this.user.first_name} ${this.user.last_name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && this.user) {
        this.usersSvc.delete(this.user._id || this.user.id).subscribe({
          next: (response) => {
            console.log('[detail-delete] Respuesta de la API:', response);
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El usuario ha sido eliminado correctamente',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.goBack();
            });
          },
          error: (err) => {
            console.error('[detail-delete] Error de la API:', err);
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
