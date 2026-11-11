import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Users } from '../modelos/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly baseUrl = 'https://localhost:7170/api/TaskManagement/';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getUsuariosList(): Observable<any> {
    const direccion = this.baseUrl + 'Users/ObtenerTodos';
    return this.http.get<any>(direccion, this.httpOptions);
  }



 createUsuario(usuarios: Users): Observable<any>{
      let direccion = this.baseUrl + "Users/InsertarUser";
      let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
  
      return response;
  
     }
  
    
     actualizarUsuario(usuarios: Users): Observable<any>{
      let direccion = this.baseUrl + "Users/ActualizarUser";
      let response = this.http.put<any>(direccion,usuarios,this.httpOptions);
      console.log(response);
      return response;
    }
    
      eliminarUsuario(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "Users/EliminarUser?dato=" + data;
      let response = this.http.delete<any>(direccion);
      console.log(response);
      return response;
     }


      getUsuarioById(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "Users/ObtenerPorId?dato=" + data;
      let response = this.http.get<any>(direccion);
      console.log(response);
      return response;
  }
  
     getUsuarioByName(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "Users/ObtenerPorName?dato=" + data;
      let response = this.http.get<any>(direccion);
      console.log(response);
      return response;
    }


  getUsuarioPerfil(datos: string): Observable<any> {
    const params = new HttpParams().set('dato', datos);
    const direccion = this.baseUrl + 'Users/ObtenerUserRole';

    return this.http.get<any>(direccion, { params });
  }
}