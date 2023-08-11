import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate } from '@angular/router';
import { ApiComponentCoreServiceService } from '../app/core/services/api-component-core-service.service';
import { TokenInterceptorService } from './../app/core/services/authorization.interceptor';

export interface ComponentCanDeactivate {
  getUnsavedChangesPayload();
  canDeactivate();
  openConfirmDialog();
  setRefreshView(refresh);
  resetNlp();

  checkUnsavedChanges();
}

@Injectable({
  providedIn: 'root'
})

export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(private apiCore: ApiComponentCoreServiceService
    ) { }

  canDeactivate(component: ComponentCanDeactivate): boolean | Promise<boolean> | Observable<boolean> {
    console.log("from guard")
    const payload = component.getUnsavedChangesPayload();
    component.resetNlp();
    // return new Promise(res => {
    //   if(payload.allActions.length!=0){
    //   this.apiCore.checkUnsavedChanges(payload).subscribe(data => {
    //     if (!data) {
    //       component.setRefreshView(true);
    //       res(true)
    //     } else {
    //       var result = component.openConfirmDialog();
    //       console.log('popup', result)
    //       component.setRefreshView(result);
    //       res(result);
    //     }
    //   });
    // }else{
    //   component.setRefreshView(true);
    //   res(true)
    // }
    // });
    return new Promise(res => {
      console.log("ERROR",TokenInterceptorService.statusCode)
      if(TokenInterceptorService.statusCode!=500){
      if (payload.allActions.length != 0) {
        console.log(component.checkUnsavedChanges())
        if (!component.checkUnsavedChanges()) {
          component.setRefreshView(true);
          res(true)
        } else {
          var result = component.openConfirmDialog();
          console.log('popup', result)
          component.setRefreshView(result);
          res(result);
        }
      } else {
        component.setRefreshView(true);
        res(true)
      }
    }else{
      res(true)
    }
    

    });
  }
}