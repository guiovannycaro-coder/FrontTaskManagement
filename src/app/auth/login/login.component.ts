
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SeguridadService } from '../../services/seguridad.service';
import { Login } from '../../modelos/login';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  email: string ="";
  password: string ="";


  userdata: any;
  loginform: FormGroup;
  
  constructor(
    private builder: FormBuilder,
    private api: SeguridadService,
    private router: Router) {
    
   this.loginform = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.checkLocalStorage();
  }

  checkLocalStorage(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    const email = sessionStorage.getItem('email');

    if (email) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {

    if (this.loginform.invalid) {
      this.loginform.markAllAsTouched();

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un correo y una contraseña válidos.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const credenciales: Login = this.loginform.value;

  

    this.api.login(credenciales).subscribe({

      next: (respuesta: any) => {

        this.userdata = respuesta;



        if (respuesta?.codeError === 200 && respuesta?.data === true) {

          const email = this.loginform.get('email')?.value;

          sessionStorage.setItem('email', email);

          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: 'Autenticación exitosa.',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: respuesta?.message ?? 'Credenciales incorrectas.',
            confirmButtonText: 'Aceptar'
          });

        }
      },

      error: (error) => {

        console.error('Error en la autenticación:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No fue posible iniciar sesión.',
          confirmButtonText: 'Aceptar'
        });

      }

    });
  }
}

