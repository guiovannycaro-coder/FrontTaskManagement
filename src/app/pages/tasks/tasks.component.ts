
import { AfterViewInit, Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

import Swal from 'sweetalert2';
import { Tasks } from '../../modelos/tasks';
import { Roles } from '../../modelos/roles';
import { Users } from '../../modelos/users';

import { TasksService } from '../../services/tasks.service';
import { UsersService } from '../../services/users.service';
import { SeguridadService } from '../../services/seguridad.service';
import { EdittaskComponent } from '../../modals/tasks/edittask/edittask.component';
import { AddtaskComponent } from '../../modals/tasks/addtask/addtask.component';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent  implements OnInit, AfterViewInit{

  // Columnas generales: visibles para todos las tareas.
 displayedColumns: string[] = [
  'Id',
  'Titulo',
  'Descripcion',
  'Adicionales',
  'Creacion',
   'Estado',
  'Acciones'
  ];
  
  dataSource = new MatTableDataSource<Tasks>();
  
  perusu: Users[] = [];
 perusud: Users = new Users();
  usuario: string | null = null;
  perfil: string = '';

   @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private apit: TasksService,
      private uapi: UsersService,
      private apis: SeguridadService,
      @Inject(MatDialog) public dialog: MatDialog,
      @Inject(PLATFORM_ID) private platformId: object
    ) {}

    ngOnInit(): void {
  
      this.usuario = sessionStorage.getItem('email')
        ?? localStorage.getItem('email');
  
      if (this.usuario) {
        this.obtenerDatosUsuario(this.usuario);
        this.obtenerPerfilUsuario(this.usuario);
      }
  
      this.obtenerTasks();
    }
  
    ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   get displayedColumnsFinal(): string[] {
    return this.esPermitidoAdmin()
      ? [...this.displayedColumns, 'Acciones']
      : this.displayedColumns;
  }

     private obtenerPerfilUsuario(usuario: string): void {
    this.apis.getProfile(usuario).subscribe({
      next: (data) => {
        this.perfil = String(data.perfil);
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

  
  // Verificar si el usuario puede administrar hoteles.
  // Roles 1 y 2.
  esPermitidoAdmin(): boolean {
    const rolId = Number(this.perusud?.usuRolId);

    return rolId === 1 || rolId === 2;
  }

  // Verificar si el usuario solamente puede consultar.
  // Rol 3.
  esUsuarioConsulta(): boolean {
    return Number(this.perusud?.usuRolId) === 3;
  }

    // Nombre del rol.
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

  
    private obtenerTasks(): void {
  
      this.apit.getTasksList().subscribe({
        next: (respuesta: any) => {
  
          console.log('Respuesta del backend:', respuesta);
  
          const tasks: Tasks[] = respuesta.data ?? [];
  
          this.dataSource.data = tasks;
  
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
  
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
  
          console.log('Tasks cargados:', this.dataSource.data);
        },
        error: (error) => {
  
          console.error('Error al obtener Tasks:', error);
  
          Swal.fire(
            'Error',
            'No se pudo obtener la lista de Tasks.',
            'error'
          );
        }
      });
      
  }
  
   openAddProForm(): void {
  
      if (!this.esPermitidoAdmin()) {
        return;
      }
  
      this.dialog.open(AddtaskComponent, {
        width: '500px'
      });
    }
  
    // Abrir formulario para editar hotel.
     openEditProForm(id: number): void {
   
       if (!this.esPermitidoAdmin()) {
         return;
       }
   
       if (!id) {
         console.error('Error: el ID del hotel es inválido.');
         return;
       }
   
       this.dialog.open(EdittaskComponent, {
         data: { taskId: id },
         width: '500px'
       });
     }

  
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
  
          this.apit.eliminarTasks(id).subscribe({
            next: (data) => {
  
              console.log('Task eliminado:', data);
  
              Swal.fire(
                '¡Eliminado!',
                'la Tarea ha sido eliminado.',
                'success'
              );
  
              // Actualizar tabla sin recargar toda la página.
              this.obtenerTasks();
            },
            error: (error) => {
  
              console.error('Error al eliminar la tarea:', error);
  
              Swal.fire(
                'Error',
                'No se pudo eliminar la tarea.',
                'error'
              );
            }
          });
        }
      });
    }
     // Filtro general de la tabla.
    applyFilter(event: Event): void {
  
      const filterValue = (event.target as HTMLInputElement).value;
  
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
