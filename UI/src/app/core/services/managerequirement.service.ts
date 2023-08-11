import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { apiServiceComponent } from './apiService';
import { Observable } from 'rxjs';
import { Post } from '../../post';

@Injectable({
  providedIn: 'root'
})
export class ManagerequirementService {

  constructor(private api: apiServiceComponent, private http: HttpClient) { }
  getSaveFromDb(project): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getSaveFromDb" + project)
      .map(response => { return response as any });
  }

  getMyModules(allmods): Observable<Post[]> {
    console.log(allmods)
    return this.http.post(this.api.apiData + "/getstructuredata", allmods)
      .map(response => { return response as any });
  }

  getrequirementNames(info): Observable<Post[]> {

    let editrequirementParam = `${info[0].moduleId},${info[0].featureId},${info[0].projectId}`;
    console.log(editrequirementParam);
    return this.http.get(this.api.apiData + "/requirementDbNames" + editrequirementParam)
      .map(response => { return response as any });
  }

  duplicateRequirement(projectId, requirementName) {
    return this.http.get(this.api.apiData + '/checkDuplicateRequirement' + '/' + projectId + '/' + requirementName);
  }

  checkTestcaseMappedToRelease(reqirementName) {
    console.log(reqirementName)
    return this.http.get(this.api.apiData + '/checkReqmappedToTestcase' + reqirementName);
  }

  checkingModuleHavingFeature(moduleName) {
    return this.http.get(this.api.apiData + '/CheckingModHavingFeature' + moduleName);
  }

  checkingFeatureHavingRequirement(featureName) {
    return this.http.get(this.api.apiData + '/CheckingFeaHavingRequirement' + featureName);
  }

  checkingFeatureHavingTestcases(featureName) {
    return this.http.get(this.api.apiData + '/CheckingFeaHavingTestcase' + featureName);
  }
}

