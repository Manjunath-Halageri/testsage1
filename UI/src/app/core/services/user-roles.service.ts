import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../post';
import { apiServiceComponent } from './apiService';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {
  constructor(private http: HttpClient, private api: apiServiceComponent, private httpCall: HttpcallService) {
  }
  orgAdminDetails(obj): Observable<Post[]> {
    return this.http.post(this.api.apiData + "/orgAdminDetails", obj)
      .map(response => { return response as any });
  }
  edit(obj): Observable<Post[]> {
    console.log(obj)
    return this.http.post(this.api.apiData + "/editUserRolesDetails", obj)
      .map(response => { return response as any });
  }

  find(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectList/findUserRolesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getProjectsUsersData() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/projectList/getProjectsUsersData'

    }
    return this.httpCall.httpCaller(request);
  }
  getProjectsUsers(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectList/getProjectsUsers'

    }
    return this.httpCall.httpCaller(request);
  }
  findPlanwiseCreateUsers(data) {
    let obj = {
      roleName: data,
      orgId: data
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/projectList/findPlanwiseCreateUsers'

    }
    return this.httpCall.httpCaller(request);
  }

  create(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectList/createUserRolesDetails'
    }
    return this.httpCall.httpCaller(request);
  }
  getProjectuserRole(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectList/getProjectuserRole'
    }
    return this.httpCall.httpCaller(request);
  }

  update(obj) {
    let request = {
      'params': obj,
      'method': 'put',
      'path': '/projectList/updateUserRolesDetails'
    }
    return this.httpCall.httpCaller(request);
  }
  delete(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectList/deleteUserRolesDetails'
    }
    return this.httpCall.httpCaller(request);
  }
  getFrameWorks() {

    let request = {
      'params': "",
      'method': 'get',
      'path': '/createProject/getFrameWorks'
    }
    return this.httpCall.httpCaller(request);
  }
  getAllProjects(data) {
    let obj = {
      orgName: data
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/createProject/getAllProjects'
    }
    return this.httpCall.httpCaller(request);
  }
  getOneUserDetails(data) {
    let obj = {
      orgName: data
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/createProject/getOneUserDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  addNew(data) {
    let obj = {
      projectAdmin: data
    }
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/createProject/addNew'
    }
    return this.httpCall.httpCaller(request);
  }
  getSelectedProject(data) {
    let obj = {
      prgName: data
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/createProject/getSelectedProject'
    }
    return this.httpCall.httpCaller(request);
  }
  getPermissions(data) {
    let obj = {
      roleName: data
    }
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/userRole/getPermissions'
    }
    return this.httpCall.httpCaller(request);
  }
}


