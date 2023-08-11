import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../../post';
import 'rxjs/add/operator/map';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TestComponent {


    constructor(public http: HttpClient, private api: apiServiceComponent) { }

    bjectNameDetails(): Observable<Post[]> {
        return this.http.get(this.api.apiData + "/getCreateTest")
            .map(response => { return response as any })

    }
    getSaveFromDb(project): Observable<Post[]> {
        return this.http.get(this.api.apiData + "/getSaveFromDb" + project)
            .map(response => { return response as any })
    }
}





