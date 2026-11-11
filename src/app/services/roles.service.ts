import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Roles } from '../modelos/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
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

   getRoleList(): Observable<any>{
      let direccion = this.baseUrl + "Roles/ObtenerTodos";
      let response = this.http.get<any>(direccion,this.httpOptions);
      console.log(response);
      return response;
    }
  
     createRole(usuarios: Roles): Observable<any>{
      let direccion = this.baseUrl + "Roles/InsertarRole";
      let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
  
      return response;
  
     }
  
    
     actualizarRole(usuarios: Roles): Observable<any>{
      let direccion = this.baseUrl + "Roles/ActualizarRole";
      let response = this.http.put<any>(direccion,usuarios,this.httpOptions);
      console.log(response);
      return response;
    }
    
      eliminarRole(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "Roles/EliminarRole?dato=" + data;
      let response = this.http.delete<any>(direccion);
      console.log(response);
      return response;
     }
  
      getRoleById(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "Roles/ObtenerPorId?dato=" + data;
      let response = this.http.get<any>(direccion);
      console.log(response);
      return response;
    }
  
       
  
      getDescriptionByName(data:any): Observable<any>{
  
      console.log("parametro a enviar " + data)
      let direccion = this.baseUrl + "Roles/ObtenerPorName?dato=" + data;
      let response = this.http.get<any>(direccion);
      console.log(response);
      return response;
    }

}
