import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Post } from '../../post';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProjectDetailServiceComponent {
  projectDetails: any;
  constructor(private http: HttpClient, private api: apiServiceComponent) { }

  projectId(a): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getProjectId" + a)
      .map(response => { return response as any });
  }


  moId(clickModule): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getMoId" + clickModule)
      .map(response => { return response as any });
  }
  
  getProjectDir(searchDir): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/searchDir" + searchDir)
      .map(response => { return response as any });
  }

  getActions(): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getact")
      .map(response => { return response as any });
  }

  childModuleDetails(index): Observable<Post[]> {
    return this.http.get(this.api.apiData + '/getFeatureName' + index)
      .map(response => { return response as any });
  }


  createFolder(folderName): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/createFolder" + folderName)
      .map(response => { return response as any });
  }


  childModuleDetails1(): Observable<Post[]> {
    return this.http.get(this.api.apiData + '/featureName')
      .map(response => { return response as any });
  }

  typeDetails() {
    return this.http.get(this.api.apiData + "/importType")
      .map(response => { return response as any });
  }

  priorityDetails() {
    return this.http.get(this.api.apiData + "/importPriority")
      .map(response => { return response as any });
  }

  moduuu(): Observable<Post[]> {
    return this.http.get(this.api.apiData + '/postmodule')
      .map(response => { return response as any });
  }

  idDetails(ss): Observable<Post[]> {
    return this.http.get(this.api.apiData + '/getIds' + ss)
      .map(response => { return response as any });
  }

  reportDetails(run): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getreportDetail" + run)
      .map(response => { return response as any });
  }

  selProjectName: string;

  takeProjectName(takedProjectName) {
    this.selProjectName = takedProjectName;
    sessionStorage.setItem('key', this.selProjectName);
  }

  selectedProject() {
    this.selProjectName = sessionStorage.getItem('key');
    return this.selProjectName;
  }

  updateRequest(): Observable<any> {
    var myvar = {};
    myvar["yash"] = "yash";
    return this.http.put(this.api.apiData + '/update', myvar, {})
      .map(response => { return response as any });
  }

}

