
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Users } from '../../../modelos/users';
import { Roles } from '../../../modelos/roles';

import { UsersService } from '../../../services/users.service';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-addtusers',
  standalone: false,
  templateUrl: './addtusers.component.html',
  styleUrl: './addtusers.component.css'
})
export class AddtusersComponent implements OnInit {

  usersForm: FormGroup;

  usuario: Users = new Users();

  listroles: Roles[] = [];

  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiu: UsersService,
    private apir: RolesService,
    public dialogRef: MatDialogRef<AddtusersComponent>,
    private router: Router
  ) {

    this.usersForm = this.fb.group({

      usuId: [0],

      usuNames: ['', Validators.required],

      usuEmail: ['', [
        Validators.required,
        Validators.email
      ]],

      usuPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],

      usuRolId: [null, Validators.required],

      usuIsActive: [true]

    });
  }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  // Obtener los roles disponibles.
  private obtenerRoles(): void {

    this.apir.getRoleList().subscribe({

      next: (respuesta: any) => {

        console.log('Respuesta de roles:', respuesta);

        this.listroles = respuesta.data ?? respuesta.Data ?? [];

        console.log('Roles cargados:', this.listroles);

      },

      error: (error) => {

        console.error('Error al obtener roles:', error);

        Swal.fire(
          'Error',
          'No se pudo obtener la lista de roles.',
          'error'
        );
      }
    });
  }


  // Guardar nuevo usuario
guardarUsers(): void {

if (this.loading) {
  return;
}

if (this.usersForm.invalid) {
  this.usersForm.markAllAsTouched();

  Swal.fire({
    icon: 'warning',
    title: 'Formulario inválido',
    text: 'Completa todos los campos requeridos.',
    confirmButtonText: 'Aceptar'
  });

  return;
}

const formValue = this.usersForm.getRawValue();
  const tipId = Number(formValue.usuTdocId);
  const rolId = Number(formValue.usuRolId);
// Construir objeto según el modelo Users
  const usuario: Users = {
    usuId: 0,
    usuNames: String(formValue.usuNames).trim(),
  
    usuEmail: String(formValue.usuEmail).trim(),
    usuPassword: String(formValue.usuPassword),
    usuRolId: rolId,
    usuIsActive: Boolean(formValue.usuIsActive),
    roles: { 
     rolId: rolId,
     rolName:  'string',
     rolObservation:  'string',
     rolIsActive: true
    }
};

console.log('JSON enviado al backend:', usuario);

this.loading = true;

this.apiu.createUsuario(usuario).subscribe({

  next: (response) => {
    console.log('Usuario creado:', response);

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'El usuario se registró correctamente.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      this.dialogRef.close(true);
    });
  },

  error: (error) => {
    console.error('Error al crear el usuario:', error);

    const mensaje = error.error?.errors
      ? Object.values(error.error.errors).flat().join('\n')
      : error.error?.message
        || 'Hubo un problema al registrar el usuario.';

    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  },

  complete: () => {
    this.loading = false;
  }

});

  }
  
// Validaciones del formulario
onSubmit(): void {

if (this.usersForm.invalid) {
  this.usersForm.markAllAsTouched();

  Swal.fire({
    icon: 'warning',
    title: 'Formulario inválido',
    text: 'Completa todos los campos requeridos.',
    confirmButtonText: 'Aceptar'
  });

  return;
}

const nombre = String(
  this.usersForm.get('usuNames')?.value ?? ''
).trim();



const email = String(
  this.usersForm.get('usuEmail')?.value ?? ''
).trim();



const password = String(
  this.usersForm.get('usuPassword')?.value ?? ''
);


const rol = Number(
  this.usersForm.get('usuRolId')?.value
);

const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!nombre) {
  this.mostrarError('El nombre del usuario es obligatorio.');
  return;
}





if (!regexCorreo.test(email)) {
  this.mostrarError('Ingrese un correo electrónico válido.');
  return;
}



if (!password.trim()) {
  this.mostrarError('La contraseña es obligatoria.');
  return;
}


if (!Number.isInteger(rol) || rol <= 0) {
  this.mostrarError('Debe seleccionar un perfil válido.');
  return;
}

this.guardarUsers();

}


  private mostrarError(mensaje: string): void {
Swal.fire({
icon: 'error',
title: 'Error',
text: mensaje,
confirmButtonText: 'Aceptar'
});
}

  cerrarModal(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
this.dialogRef.close();
}

}
