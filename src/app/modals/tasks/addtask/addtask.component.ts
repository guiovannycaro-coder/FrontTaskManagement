
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Tasks } from '../../../modelos/tasks';
import { Users } from '../../../modelos/users';

import { TasksService } from '../../../services/tasks.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-addtask',
  standalone: false,
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.css'
})
export class AddtaskComponent implements OnInit {

  tasksForm: FormGroup;

  task: Tasks = new Tasks();

  // Lista de usuarios consultados desde el backend.
  usuarios: Users[] = [];

  // IDs de los usuarios seleccionados.
  usersIds: number[] = [];

  loading = false;
  loadingUsuarios = false;

  constructor(
    private fb: FormBuilder,
    private api: TasksService,
    private usersApi: UsersService,
    public dialogRef: MatDialogRef<AddtaskComponent>
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
    this.cargarUsuarios();
  }

  // =====================================================
  // 1. CONSULTAR USUARIOS
  // =====================================================

  cargarUsuarios(): void {

    this.loadingUsuarios = true;

    this.usersApi.getUsuariosList().subscribe({

      next: (response) => {

        // La API devuelve los registros dentro de data.
        // También se contempla una respuesta que sea directamente un array.
        const listaUsuarios = Array.isArray(response)
          ? response
          : response?.data ?? response?.Data ?? [];

        this.usuarios = Array.isArray(listaUsuarios)
          ? listaUsuarios
          : [];

        console.log('Usuarios obtenidos:', this.usuarios);

      },

      error: (error) => {

        console.error('Error al consultar usuarios:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible cargar la lista de usuarios.',
          confirmButtonText: 'Aceptar'
        });

      },

      complete: () => {
        this.loadingUsuarios = false;
      }

    });

  }

  // =====================================================
  // 2. SELECCIONAR / DESSELECCIONAR USUARIOS
  // =====================================================

  actualizarSeleccionUsuario(usuId: number, event: Event): void {

    const seleccionado = (event.target as HTMLInputElement).checked;

    if (seleccionado) {

      if (!this.usersIds.includes(usuId)) {
        this.usersIds.push(usuId);
      }

    } else {

      this.usersIds = this.usersIds.filter(id => id !== usuId);

    }

    console.log('IDs de usuarios seleccionados:', this.usersIds);

  }

  // =====================================================
  // 3. VALIDACIONES DEL FORMULARIO
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

    const titulo = String(formValue.taskTitle ?? '').trim();
    const descripcion = String(formValue.taskDescription ?? '').trim();
    const estado = String(formValue.taskStatus ?? '').trim();
    const prioridad = String(formValue.priority ?? '').trim();
    const categoria = String(formValue.category ?? '').trim();
    const horasEstimadas = Number(formValue.estimatedHours);

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
      this.mostrarError('Las horas estimadas deben ser como mínimo 1.');
      return;
    }

    // Validar que se haya seleccionado por lo menos un usuario.
    if (this.usersIds.length === 0) {
      this.mostrarError(
        'Debes asignar por lo menos un usuario a la tarea.'
      );
      return;
    }

    this.guardarTareas();

  }

  // =====================================================
  // 4. GUARDAR NUEVA TAREA
  // =====================================================

  guardarTareas(): void {

    if (this.loading) {
      return;
    }

    const formValue = this.tasksForm.getRawValue();

    const tarea: Tasks = {
      taskId: 0,
      taskTitle: String(formValue.taskTitle).trim(),
      taskDescription: String(formValue.taskDescription).trim(),
      taskStatus: String(formValue.taskStatus),
      taskCreatedAt: new Date(),

      // Construir el JSON de información adicional.
      taskAdditionalData: JSON.stringify({
        priority: formValue.priority,
        category: String(formValue.category).trim(),
        estimatedHours: Number(formValue.estimatedHours)
      })
    };

    console.log('Tarea enviada:', tarea);
    console.log('Usuarios asignados:', this.usersIds);

    this.loading = true;

    // Enviar tarea y usuarios seleccionados.
    this.api.createTasks(tarea, this.usersIds).subscribe({

      next: (response) => {

        console.log('Tarea creada:', response);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'La tarea se registró correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.dialogRef.close(true);
        });

      },

      error: (error) => {

        console.error('Error al crear la tarea:', error);

        const mensaje = error.error?.errors
          ? Object.values(error.error.errors).flat().join('\n')
          : error.error?.message
            || 'Hubo un problema al registrar la tarea.';

        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
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
  // 5. MOSTRAR ERROR
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
  // 6. CERRAR MODAL
  // =====================================================

  cerrarModal(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
