
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { Users } from '../../modelos/users';
import { Roles } from '../../modelos/roles';

import { UsersService } from '../../services/users.service';
import { SeguridadService } from '../../services/seguridad.service';

import { AddtusersComponent } from '../../modals/users/addtusers/addtusers.component';
import { EditusersComponent } from '../../modals/users/editusers/editusers.component';


@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit {

  // No incluir Acciones aquí.
  displayedColumns: string[] = [
    'Id',
    'Nombres',
    'Correo',
    'Perfil',
    'Estado'
  ];

  dataSource = new MatTableDataSource<Users>();

    perusu: Users[] = [];
 perusud: Users = new Users();

  usuario: string | null = null;
  perfil: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
  private uapi: UsersService,
    private apis: SeguridadService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Configurar filtro de búsqueda.
    this.dataSource.filterPredicate = (usuario: Users, filtro: string): boolean => {

      const texto = filtro.toLowerCase();

      const nombre = usuario.usuNames?.toLowerCase() ?? '';
      const correo = usuario.usuEmail?.toLowerCase() ?? '';
      const rol = usuario.roles?.rolName?.toLowerCase() ?? '';
      const estado = usuario.usuIsActive ? 'activo' : 'inactivo';
      const id = usuario.usuId?.toString() ?? '';

      return nombre.includes(texto)
        || correo.includes(texto)
        || rol.includes(texto)
        || estado.includes(texto)
        || id.includes(texto);
    };
  }

  ngOnInit(): void {

    // Evitar errores de sessionStorage/localStorage durante SSR.
    if (isPlatformBrowser(this.platformId)) {

      this.usuario = sessionStorage.getItem('email')
        ?? localStorage.getItem('email');

      if (this.usuario) {
        this.obtenerDatosUsuario(this.usuario);
        this.obtenerPerfilUsuario(this.usuario);
      }
    }

    // Consultar el listado independientemente del perfil.
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Agregar Acciones únicamente para administradores.
  get displayedColumnsFinal(): string[] {
    return this.esPermitidoAdmin()
      ? [...this.displayedColumns, 'Acciones']
      : this.displayedColumns;
  }

  private obtenerPerfilUsuario(usuario: string): void {

    this.apis.getProfile(usuario).subscribe({
      next: (data: any) => {
        this.perfil = String(data.perfil);
        console.log('Perfil del usuario:', this.perfil);
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
      }
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

  // Roles 1 y 2: administradores.
  esPermitidoAdmin(): boolean {
    const rolId = Number(this.perusud?.usuRolId);
    return rolId === 1 || rolId === 2;
  }

  // Rol 3: usuario de consulta.
  esUsuarioConsulta(): boolean {
    return Number(this.perusud?.usuRolId) === 3;
  }

  getRolName(rol: number | null | undefined): string {

    switch (Number(rol)) {
      case 1:
        return 'Super Administrador';

      case 2:
        return 'Administrador';

      case 3:
        return 'Usuario';

      default:
        return 'Sin rol asignado';
    }
  }

  // Obtener listado de usuarios.
  private obtenerUsuarios(): void {

    this.uapi.getUsuariosList().subscribe({

      next: (respuesta: any) => {

        console.log('Respuesta completa del backend:', respuesta);

        // Contemplar las diferentes formas de respuesta.
        const usuarios: Users[] =
          respuesta?.data ??
          respuesta?.Data ??
          respuesta ??
          [];

        if (!Array.isArray(usuarios)) {
          console.error('La respuesta no contiene un arreglo de usuarios:', usuarios);
          this.dataSource.data = [];
          return;
        }

        this.dataSource.data = usuarios;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
          this.dataSource.sort = this.sort;
        }

        console.log('Cantidad de usuarios:', usuarios.length);
        console.log('Usuarios cargados:', this.dataSource.data);
      },

      error: (error) => {

        console.error('Error al obtener usuarios:', error);

        Swal.fire(
          'Error',
          'No se pudo obtener la lista de usuarios.',
          'error'
        );
      }
    });
  }

  // Abrir formulario para agregar usuario.
  openAddProForm(): void {

    if (!this.esPermitidoAdmin()) {
      return;
    }

    this.dialog.open(AddtusersComponent, {
      width: '500px'
    });
  }

  // Abrir formulario para editar usuario.
  openEditProForm(id: number): void {

    if (!this.esPermitidoAdmin()) {
      return;
    }

    if (!id) {
      console.error('El ID del usuario es inválido.');
      return;
    }

    this.dialog.open(EditusersComponent, {
      data: { usuId: id },
      width: '500px'
    });
  }

  // Eliminar usuario.
  openDropProForm(id: number): void {

    if (!this.esPermitidoAdmin()) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        this.uapi.eliminarUsuario(id).subscribe({

          next: (data) => {

            console.log('Usuario eliminado:', data);

            Swal.fire(
              '¡Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );

            this.obtenerUsuarios();
          },

          error: (error) => {

            console.error('Error al eliminar el usuario:', error);

            Swal.fire(
              'Error',
              'No se pudo eliminar el usuario.',
              'error'
            );
          }
        });
      }
    });
  }

  // Filtro general.
  applyFilter(event: Event): void {

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

