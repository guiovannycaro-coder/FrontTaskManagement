import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { Roles } from '../../modelos/roles';
import { Users } from '../../modelos/users';
import { SeguridadService } from '../../services/seguridad.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  perfil: string = '';
  perfild: Roles = new Roles();

  perusu: Users[] = [];
 perusud: Users = new Users();

  public estado: number | undefined;
  public nombre: string | undefined;
  public rol: boolean = false;
  public menuItems: any[] = [];
  public secciontems: any[] = [];

  usuario: string | null = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: SeguridadService,
    private router: Router,
    private uapi: UsersService
  ) {}

  ngOnInit(): void {
    // sessionStorage solo existe en el navegador.
    if (isPlatformBrowser(this.platformId)) {
      this.usuario = sessionStorage.getItem('email');

      console.log('Usuario recuperado dashboard:', this.usuario);

      if (this.usuario) {
        this.obtenerDatosUsuario(this.usuario);
        this.obtenerPerfilUsuario(this.usuario);
      }
    }
  }

  private obtenerPerfilUsuario(usuario: string): void {
    this.api.getProfile(usuario).subscribe({
      next: (data) => {
           console.log('Respuesta del endpoint ino : ', data);
        this.perfil = String(data.perfil);
      },
      error: (error) => console.error('Error al obtener el perfil:', error)
    });
  }

  private obtenerDatosUsuario(usuario: string): void {
    console.log('Averiguar datos del perfil de:', usuario);

    this.uapi.getUsuarioPerfil(usuario).subscribe({
      next: (respuesta) => {
        console.log('Respuesta del endpoint dos : ', respuesta);

        // El endpoint devuelve el rol dentro de data.
        this.perusud = respuesta.data;

         sessionStorage.setItem('perfilUsuario',  String(this.perusud.usuRolId));
        // Se mantiene perusu como arreglo para tus métodos de permisos.
        this.perusu = this.perusud
          ? [this.perusud]
          : [];

        console.log('Rol del usuario:', this.perusud.usuRolId);
      },
      error: (error) => {
        console.error('Error al obtener el rol del usuario:', error);
      }
    });
  }




   esPerfilPermitido(): boolean {
    return Number(this.perusud.usuRolId) === 3;
  }

  esPermitidoAdmin(): boolean {
    const rolId = Number(this.perusud.usuRolId);
    

  console.log('Rol recibido:', rolId);
    console.log('¿Es administrador?', rolId === 1 || rolId === 2);
    
     return rolId === 1 || rolId === 2;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('email');
    }

    this.router.navigate(['/login']);
  }
}
