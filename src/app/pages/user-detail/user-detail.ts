import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class UserDetailComponent implements OnInit {
  user?: User;
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router, private usersSvc: UsersService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.usersSvc.getById(id).subscribe({
      next: (u: User) => { this.user = u; this.loading = false; },
      error: () => { this.loading = false; alert('No se pudo cargar el usuario'); }
    });
  }

  goBack(): void { this.router.navigate(['/home']); }

  goEdit(): void { if (this.user) this.router.navigate(['/updateuser', this.user.id]); }

  confirmDelete(): void {
    if (!this.user) return;
    if (!confirm(`¿Eliminar a ${this.user.first_name}?`)) return;
    this.usersSvc.delete(this.user.id).subscribe({
      next: () => this.goBack(),
      error: () => alert('No se pudo eliminar')
    });
  }
}
