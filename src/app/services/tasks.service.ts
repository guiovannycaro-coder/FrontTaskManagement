
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tasks } from '../modelos/tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private readonly baseUrl = 'https://localhost:7170/api/TaskManagement/';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // =====================================================
  // 1. OBTENER TODAS LAS TAREAS
  // =====================================================

  getTasksList(): Observable<any> {
    const direccion = this.baseUrl + 'Tasks/ObtenerTodos';
    return this.http.get<any>(direccion, this.httpOptions);
  }

  // =====================================================
  // 2. CREAR TAREA
  // =====================================================

  createTasks(usuarios: Tasks, usersIds: number[]): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/InsertarTask';

    let params = new HttpParams();

    usersIds.forEach(id => {
      params = params.append('usersIds', id.toString());
    });

    return this.http.post<any>(
      direccion,
      usuarios,
      {
        ...this.httpOptions,
        params: params
      }
    );
  }

  // =====================================================
  // 3. ACTUALIZAR TAREA
  // =====================================================

  actualizarTasks(usuarios: Tasks, usersIds: number[]): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/ActualizarTask';

    let params = new HttpParams();

    usersIds.forEach(id => {
      params = params.append('usersIds', id.toString());
    });

    return this.http.put<any>(
      direccion,
      usuarios,
      {
        ...this.httpOptions,
        params: params
      }
    );
  }

  // =====================================================
  // 4. ACTUALIZAR ESTADO DE TAREA
  // =====================================================

  actualizarTaskStatus(taskId: number, status: string): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/ActualizarEstado';

    const params = new HttpParams()
      .set('dato', taskId.toString())
      .set('status', status);

    return this.http.put<any>(
      direccion,
      null,
      {
        ...this.httpOptions,
        params: params
      }
    );
  }

  // =====================================================
  // 5. ELIMINAR TAREA
  // =====================================================

  eliminarTasks(data: number): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/EliminarTask';

    const params = new HttpParams()
      .set('dato', data.toString());

    return this.http.delete<any>(direccion, {
      params: params
    });
  }

  // =====================================================
  // 6. OBTENER TAREA POR ID
  // =====================================================

  getTasksById(data: number): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/ObtenerPorId';

    const params = new HttpParams()
      .set('dato', data.toString());

    return this.http.get<any>(direccion, {
      params: params
    });
  }

  // =====================================================
  // 7. OBTENER TAREAS POR TÍTULO
  // =====================================================

  getTasksByTitle(data: string): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/ObtenerPorTitle';

    const params = new HttpParams()
      .set('dato', data);

    return this.http.get<any>(direccion, {
      params: params
    });
  }

  // =====================================================
  // 8. OBTENER TAREAS POR USUARIO
  // =====================================================

  getTasksByUser(data: number): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/ObtenerPorUsuario';

    const params = new HttpParams()
      .set('dato', data.toString());

    return this.http.get<any>(direccion, {
      params: params
    });
  }

  // =====================================================
  // 9. OBTENER TAREAS POR ESTADO
  // =====================================================

  getTasksByStatus(data: string): Observable<any> {

    const direccion = this.baseUrl + 'Tasks/ObtenerPorEstado';

    const params = new HttpParams()
      .set('dato', data);

    return this.http.get<any>(direccion, {
      params: params
    });
  }

}
