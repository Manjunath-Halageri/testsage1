import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseScopeService {
  create(ownerForm: any) {
    throw new Error("Method not implemented.");
  }

  constructor(private httpCall: HttpcallService) { }
  oldModule() {
    alert("call is hiting to projectDeat")
    console.log()
    let request = {
      'params':'',
      'method':'get',
      'path':'/releaseScope/oldGetModule'
    }
   return this.httpCall.httpCaller(request);
  }
  
}
