import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users';
import { CreateUserRequest, UpdateUserRequest, User } from '../../core/interfaces/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class UserFormComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  idToEdit?: string;
  loading = false;


  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersSvc: UsersService
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.mode = (this.route.snapshot.data['mode'] ?? 'create') as 'create' | 'edit';
    if (this.mode === 'edit') {
  this.idToEdit = this.route.snapshot.paramMap.get('id') ?? undefined;
      this.prefill();
    }
  }

  prefill(): void {
    if (!this.idToEdit) return;
    this.loading = true;
    this.usersSvc.getById(this.idToEdit).subscribe({
      next: (u: User) => {
        this.form.patchValue({
          first_name: u.first_name,
          last_name: u.last_name,
          email: u.email,
          image: u.image
        });
        this.loading = false;
      },
      error: () => { this.loading = false; alert('No se pudo cargar el usuario'); }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    if (this.mode === 'create') {
      const payload = this.form.value as CreateUserRequest;
      this.usersSvc.create(payload).subscribe({
        next: (u: User) => { 
          console.log('[create] Respuesta de la API:', u);
          alert(`Creado con ID ${u.id}`); 
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          console.error('[create] Error de la API:', err);
          alert('No se pudo crear el usuario');
        }
      });
    } else {
      const payload: UpdateUserRequest = {
        first_name: this.form.value.first_name!,
        last_name: this.form.value.last_name!,
        email: this.form.value.email!,
        image: this.form.value.image!
      };
      this.usersSvc.update(this.idToEdit!, payload).subscribe({
        next: (response) => {
          console.log('[update] Respuesta de la API:', response); // console.log para ver respuesta de la API
          this.router.navigate(['/user', this.idToEdit]);
        },
        error: (err) => {
          console.error('[update] Error de la API:', err); //respuesta de la API en caso de error
          alert('No se pudo actualizar el usuario');
        }
      });
    }
  }
}
