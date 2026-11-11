
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Tasks } from '../../../modelos/tasks';
import { Users } from '../../../modelos/users';

import { TasksService } from '../../../services/tasks.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-edittask',
  standalone: false,
  templateUrl: './edittask.component.html',
  styleUrl: './edittask.component.css'
})
export class EdittaskComponent implements OnInit {

  tasksForm: FormGroup;

  task: Tasks = new Tasks();

  usuarios: Users[] = [];

  // IDs de los usuarios seleccionados.
  usersIds: number[] = [];

  loading = false;
  loadingUsuarios = false;
  cargandoDatos = false;

  constructor(
    private fb: FormBuilder,
    private api: TasksService,
    private usersApi: UsersService,
    public dialogRef: MatDialogRef<EdittaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskId: number }
  ) {

    this.tasksForm = this.fb.group({

      taskId: [0],

      taskTitle: ['', Validators.required],

      taskDescription: ['', Validators.required],

      taskStatus: ['Pending', Validators.required],

      taskCreatedAt: [new Date()],

      priority: ['Medium', Validators.required],

      category: ['General', Validators.required],

      estimatedHours: [1, [
        Validators.required,
        Validators.min(1)
      ]]

    });

  }

  ngOnInit(): void {

    console.log('Datos recibidos en el modal:', this.data);

    const id = Number(this.data?.taskId);

    if (!Number.isInteger(id) || id <= 0) {

      console.error('ID de tarea inválido:', this.data);

      this.mostrarError('No se recibió un ID de tarea válido.');

      this.dialogRef.close(false);

      return;

    }

    this.obtenerTarea(id);

    this.cargarUsuarios();

  }

  // =====================================================
  // 1. CONSULTAR TAREA POR ID
  // =====================================================

  obtenerTarea(id: number): void {

    this.cargandoDatos = true;

    this.api.getTasksById(id).subscribe({

      next: (response) => {

        console.log('Respuesta de la tarea:', response);

        let tarea = response?.data ?? response?.Data ?? response;

        // Si el backend devuelve una lista.
        if (Array.isArray(tarea)) {
          tarea = tarea.length > 0 ? tarea[0] : null;
        }

        if (!tarea) {

          this.mostrarError('No se encontró la tarea.');

          this.dialogRef.close(false);

          return;

        }

        this.task = tarea;

        // ==============================================
        // LEER INFORMACIÓN ADICIONAL JSON
        // ==============================================

        let datosAdicionales: any = {};

        try {

          const adicional = tarea.taskAdditionalData
            ?? tarea.TaskAdditionalData;

          if (adicional) {

            datosAdicionales = typeof adicional === 'string'
              ? JSON.parse(adicional)
              : adicional;

          }

        } catch (error) {

          console.error(
            'Error al interpretar información adicional:',
            error
          );

          datosAdicionales = {};

        }

        // ==============================================
        // CARGAR DATOS EN EL FORMULARIO
        // ==============================================

        this.tasksForm.patchValue({

          taskId: tarea.taskId ?? tarea.TaskId,

          taskTitle:
            tarea.taskTitle ?? tarea.TaskTitle ?? '',

          taskDescription:
            tarea.taskDescription ?? tarea.TaskDescription ?? '',

          taskStatus:
            tarea.taskStatus ?? tarea.TaskStatus ?? 'Pending',

          taskCreatedAt:
            tarea.taskCreatedAt ?? tarea.TaskCreatedAt ?? new Date(),

          priority:
            datosAdicionales.priority ?? 'Medium',

          category:
            datosAdicionales.category ?? 'General',

          estimatedHours:
            datosAdicionales.estimatedHours ?? 1

        });

        console.log(
          'Formulario cargado:',
          this.tasksForm.getRawValue()
        );

      },

      error: (error) => {

        console.error('Error al consultar la tarea:', error);

        this.mostrarError(
          'No fue posible consultar la información de la tarea.'
        );

        this.cargandoDatos = false;

      },

      complete: () => {

        this.cargandoDatos = false;

      }

    });

  }

  // =====================================================
  // 2. CONSULTAR USUARIOS
  // =====================================================

  cargarUsuarios(): void {

    this.loadingUsuarios = true;

    this.usersApi.getUsuariosList().subscribe({

      next: (response) => {

        const listaUsuarios = Array.isArray(response)
          ? response
          : response?.data ?? response?.Data ?? [];

        this.usuarios = Array.isArray(listaUsuarios)
          ? listaUsuarios
          : [];

        console.log('Usuarios obtenidos:', this.usuarios);

        // Consultar las asignaciones existentes.
        this.cargarUsuariosAsignados();

      },

      error: (error) => {

        console.error('Error al consultar usuarios:', error);

        this.mostrarError(
          'No fue posible cargar la lista de usuarios.'
        );

        this.loadingUsuarios = false;

      }

    });

  }

  // =====================================================
  // 3. IDENTIFICAR USUARIOS ASIGNADOS
  // =====================================================

  cargarUsuariosAsignados(): void {

    if (this.usuarios.length === 0) {

      this.loadingUsuarios = false;

      return;

    }

    const consultas = this.usuarios.map(usuario =>

      this.api.getTasksByUser(usuario.usuId).pipe(

        catchError(error => {

          console.error(
            'Error consultando tareas del usuario:',
            usuario.usuId,
            error
          );

          return of(null);

        })

      )

    );

    forkJoin(consultas).subscribe({

      next: (respuestas) => {

        const tareaId = Number(this.data.taskId);

        this.usersIds = [];

        respuestas.forEach((response, index) => {

          if (!response) {
            return;
          }

          let tareas = Array.isArray(response)
            ? response
            : response?.data ?? response?.Data ?? [];

          if (!Array.isArray(tareas)) {
            tareas = tareas ? [tareas] : [];
          }

          const asignado = tareas.some((tarea: any) =>

            Number(tarea.taskId ?? tarea.TaskId) === tareaId

          );

          if (asignado) {

            this.usersIds.push(this.usuarios[index].usuId);

          }

        });

        console.log(
          'Usuarios asignados a la tarea:',
          this.usersIds
        );

      },

      error: (error) => {

        console.error(
          'Error al consultar las asignaciones:',
          error
        );

      },

      complete: () => {

        this.loadingUsuarios = false;

      }

    });

  }

  // =====================================================
  // 4. SELECCIONAR USUARIOS - SELECT MÚLTIPLE
  // =====================================================

  cambiarUsuariosSeleccionados(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.usersIds = Array.from(select.selectedOptions)

      .map(option => Number(option.value));

    console.log(
      'Usuarios seleccionados:',
      this.usersIds
    );

  }

  // =====================================================
  // 5. VALIDACIONES DEL FORMULARIO
  // =====================================================

  onSubmit(): void {

    if (this.loading) {
      return;
    }

    if (this.tasksForm.invalid) {

      this.tasksForm.markAllAsTouched();

      Swal.fire({

        icon: 'warning',

        title: 'Formulario inválido',

        text: 'Completa todos los campos requeridos.',

        confirmButtonText: 'Aceptar'

      });

      return;

    }

    const formValue = this.tasksForm.getRawValue();

    const titulo = String(
      formValue.taskTitle ?? ''
    ).trim();

    const descripcion = String(
      formValue.taskDescription ?? ''
    ).trim();

    const estado = String(
      formValue.taskStatus ?? ''
    ).trim();

    const prioridad = String(
      formValue.priority ?? ''
    ).trim();

    const categoria = String(
      formValue.category ?? ''
    ).trim();

    const horasEstimadas = Number(
      formValue.estimatedHours
    );

    if (!titulo) {

      this.mostrarError('El título de la tarea es obligatorio.');

      return;

    }

    if (!descripcion) {

      this.mostrarError('La descripción de la tarea es obligatoria.');

      return;

    }

    if (!['Pending', 'InProgress', 'Done'].includes(estado)) {

      this.mostrarError('Selecciona un estado válido para la tarea.');

      return;

    }

    if (!['Low', 'Medium', 'High'].includes(prioridad)) {

      this.mostrarError('Selecciona una prioridad válida.');

      return;

    }

    if (!categoria) {

      this.mostrarError('La categoría es obligatoria.');

      return;

    }

    if (!Number.isFinite(horasEstimadas) || horasEstimadas < 1) {

      this.mostrarError(
        'Las horas estimadas deben ser como mínimo 1.'
      );

      return;

    }

    if (this.usersIds.length === 0) {

      this.mostrarError(
        'Debes asignar por lo menos un usuario a la tarea.'
      );

      return;

    }

    this.actualizarTareas();

  }

  // =====================================================
  // 6. ACTUALIZAR TAREA
  // =====================================================

  actualizarTareas(): void {

    if (this.loading) {
      return;
    }

    const formValue = this.tasksForm.getRawValue();

    const tarea: Tasks = {

      taskId: Number(formValue.taskId),

      taskTitle: String(
        formValue.taskTitle
      ).trim(),

      taskDescription: String(
        formValue.taskDescription
      ).trim(),

      taskStatus: String(
        formValue.taskStatus
      ),

      taskCreatedAt: formValue.taskCreatedAt
        ? new Date(formValue.taskCreatedAt)
        : new Date(),

      taskAdditionalData: JSON.stringify({

        priority: String(formValue.priority),

        category: String(
          formValue.category
        ).trim(),

        estimatedHours: Number(
          formValue.estimatedHours
        )

      })

    };

    console.log(
      'Tarea enviada para actualizar:',
      tarea
    );

    console.log(
      'Usuarios asignados:',
      this.usersIds
    );

    this.loading = true;

    this.api.actualizarTasks(
      tarea,
      this.usersIds
    ).subscribe({

      next: (response) => {

        console.log('Tarea actualizada:', response);

        Swal.fire({

          icon: 'success',

          title: 'Éxito',

          text: 'La tarea se actualizó correctamente.',

          confirmButtonText: 'Aceptar'

        }).then(() => {

          this.dialogRef.close(true);

        });

      },

      error: (error) => {

        console.error(
          'Error al actualizar la tarea:',
          error
        );

        const mensaje = error.error?.errors

          ? Object.values(error.error.errors)
              .flat()
              .join('\n')

          : error.error?.message
            || 'Hubo un problema al actualizar la tarea.';

        Swal.fire({

          icon: 'error',

          title: 'Error al actualizar',

          text: mensaje,

          confirmButtonText: 'Aceptar'

        });

        this.loading = false;

      },

      complete: () => {

        this.loading = false;

      }

    });

  }

  // =====================================================
  // 7. MOSTRAR ERROR
  // =====================================================

  private mostrarError(mensaje: string): void {

    Swal.fire({

      icon: 'error',

      title: 'Error',

      text: mensaje,

      confirmButtonText: 'Aceptar'

    });

  }

  // =====================================================
  // 8. CERRAR MODAL
  // =====================================================

  cerrarModal(): void {

    this.dialogRef.close();

  }

}
