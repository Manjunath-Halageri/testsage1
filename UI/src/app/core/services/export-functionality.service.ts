import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class ExportFunctionalityService {

  constructor(private httpCall: HttpcallService, private api: apiServiceComponent) { }

  exporToRepo(repoDetails) {
    let request = {
      'params': repoDetails,
      'method': 'post',
      'path': '/exports/exportUserProjectTorepo'
    }
    return this.httpCall.httpCaller(request);
  }
}
