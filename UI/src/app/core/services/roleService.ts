import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';
import { Observable } from 'rxjs';
import { Post } from '../../post';
import { apiServiceComponent } from './apiService';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class roleService {
  pageRoles: Object = {}
  edit = false;
  roleName123: any;
  b: any
  arr = [];

  constructor(private http: HttpClient,
    private api: apiServiceComponent,
    private httpCall: HttpcallService) {
    this.edit = true;
  }
  sendRoles(roleName: any) {
    this.roleName123 = roleName;
    this.arr.push(this.roleName123);
  }
  getallProjects(newRole): Observable<Post[]> {
    return this.http.post(this.api.apiData + "/getProjetsAll", newRole)
      .map(response => { return response as any });
  }

  getPermissions(roleName): Observable<Post[]> {
    return this.http.post(this.api.apiData + "/getPermissions", roleName)
      .map(response => { return response as any });
  }


  getModules(roleName) {
    return this.httpCall.httpCaller({
      'params': {
        roleName: roleName
      },
      'method': 'get',
      'path': '/getModules'
    });
  }

  getMyModules(allmods): Observable<Post[]> {
    return this.http.post(this.api.apiData + "/displayModulePageShiva", allmods)
      .map(response => { return response as any });
  }
}











