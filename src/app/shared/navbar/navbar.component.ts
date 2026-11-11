
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { Users } from '../../modelos/users';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {


perusud: Users = new Users();
  usuario: string | null = null;
rolId: number = 0;
  private readonly esNavegador: boolean;

  constructor(
    private api: UsersService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.esNavegador = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.esNavegador) {
      return;
    }
    this.rolId = Number(sessionStorage.getItem('perfilUsuario'));
    
   
    this.usuario = sessionStorage.getItem('email')
      ?? localStorage.getItem('email');

    if (this.usuario) {
      this.obtenerPerfilUsuario(this.usuario);
    }
  }

private obtenerPerfilUsuario(usuario: string): void {
  this.api.getUsuarioPerfil(usuario).subscribe({
    next: (respuesta: any) => {

      if (respuesta?.codeError === 200 && respuesta?.data) {

        this.perusud = respuesta.data;

      } else {
        console.error('No se pudo obtener el perfil:', respuesta?.message);
      
      }
    },
    error: (error) => {
      console.error('Error al obtener el perfil del usuario:', error);
   
    }
  });
}

logout(): void {
  const rol = Number(sessionStorage.getItem('perfilUsuario'));

  console.log('Rol antes de cerrar sesión:', rol);

  // Limpiar sesión
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('perfilUsuario');
  localStorage.removeItem('email');

 
    this.router.navigate(['/login']);
  
}
  getRolName(rol: number | null | undefined): string {
    switch (rol) {
      case 1:
        return 'Super Administrador';
      case 2:
        return 'Administrador';
      default:
        return 'Usuario';
    }
  }
}