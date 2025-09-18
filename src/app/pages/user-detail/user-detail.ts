import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/interfaces/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css']
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
    if (!id) { this.router.navigate(['/home']); return; }

    this.loading = true;
    this.usersSvc.getById(id).subscribe({
      next: (u) => { 
        console.log('[detail] respuesta normalizada:', u);
        this.user = u; 
        this.loading = false; 
      },
      error: (err) => { 
        console.error('[detail] error API:', err);
        this.loading = false; 
        alert('No se pudo cargar el usuario'); 
      }
    });
  }

  goBack(): void { this.router.navigate(['/home']); }
  goEdit(): void { if (this.user) this.router.navigate(['/updateuser', this.user._id]); }
  confirmDelete(): void {
    if (!this.user) return;
    if (!confirm(`¿Eliminar a ${this.user.first_name}?`)) return;
    this.usersSvc.delete(this.user._id || this.user.id).subscribe({
      next: (response) => {
        console.log('[detail-delete] Respuesta de la API:', response);
        alert('Usuario eliminado');
        this.goBack();
      },
      error: (err) => {
        console.error('[detail-delete] Error de la API:', err);
        alert('No se pudo eliminar');
      }
    });
  }
}