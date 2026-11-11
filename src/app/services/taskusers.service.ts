import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TasksUsers } from '../modelos/tasks-users';


@Injectable({
  providedIn: 'root'
})
export class TaskusersService {

  private readonly baseUrl = 'https://localhost:7170/api/TaskManagement/';
   
  id: number;

constructor(private http: HttpClient) {
    this.id =0;
  }

  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
  }

   getTasksUsersList(): Observable<any>{
      let direccion = this.baseUrl + "TasksUsers/ObtenerTodos";
      let response = this.http.get<any>(direccion,this.httpOptions);
      console.log(response);
      return response;
    }
  
     createTasksUsers(usuarios: TasksUsers): Observable<any>{
      let direccion = this.baseUrl + "TasksUsers/InsertarTaskUser";
      let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
  
      return response;
  
     }
  
     updateTasksUsers(usuarios: TasksUsers): Observable<any>{
      let direccion = this.baseUrl + "TasksUsers/ActualizarTaskUser";
      let response = this.http.put<any>(direccion,usuarios,this.httpOptions);
      console.log(response);
      return response;
    }
    
    dropTasksUsers(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "TasksUsers/EliminarTaskUser?dato=" + data;
      let response = this.http.delete<any>(direccion);
      console.log(response);
      return response;
     }

    dropTasksId(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "TasksUsers/EliminarPorTaskId?dato=" + data;
      let response = this.http.delete<any>(direccion);
      console.log(response);
      return response;
     }
  
    getTasksUsersById(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "TasksUsers/ObtenerPorId?dato=" + data;
      let response = this.http.get<any>(direccion);
      console.log(response);
      return response;
    }
  
  
    getTasksUsersByTaskId(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "TasksUsers/ObtenerPorTaskId?dato=" + data;
      let response = this.http.get<any>(direccion);
      console.log(response);
      return response;
  }
  
    getObtenerPorUserId(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "TasksUsers/ObtenerPorUserId?dato=" + data;
      let response = this.http.get<any>(direccion);
      console.log(response);
      return response;
    }
       
  
    
}
