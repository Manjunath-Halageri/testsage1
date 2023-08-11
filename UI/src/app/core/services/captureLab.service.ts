import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiServiceComponent } from './apiService';

@Injectable()
export class CaptureLabServiceComponent {
  constructor(private http: HttpClient, private api: apiServiceComponent) {
  }
  captureLabServiceDetails() {
    alert("captureLabServiceDetails srvice")
    return this.http.post(this.api.apiData + '/postDevicesName', {})
  }
}