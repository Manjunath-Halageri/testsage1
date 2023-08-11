import { Injectable } from '@angular/core';

//import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';
import { Post } from '../../post';
import { apiServiceComponent } from './apiService';
import { HttpcallService } from './httpcall.service';




//import {SechdularlistComponent} from '../sechdularlist/sechdularlist.component'



@Injectable()


export class sechduleService {

    constructor( private api: apiServiceComponent, private httpCall: HttpcallService) {

    }

    editInprogress(data) {
        let obj = {
            selectedSechdule: data
        }
        console.log(obj);
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/scheduler/getForEdit'

        }
        return this.httpCall.httpCaller(request);
    }

    deletesechdule(data) {
        console.log(data);
        let request = {
            'params': data,
            'method': 'delete',
            'path': '/scheduler/deletesechdule'

        }
        return this.httpCall.httpCaller(request);
    }

    getyetToStart(obj) {
        console.log(obj)
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/scheduler/getAllyetToStart'

        }
        return this.httpCall.httpCaller(request);
    }
    updateEditData(data) {
        let obj = {
            editedDetails: data
        }
        let request = {
            'params': obj,
            'method': 'put',
            'path': '/scheduler/updateEditData'

        }
        return this.httpCall.httpCaller(request);
    }

updateSchedule(data) {
        let request = {
            'params': data,
            'method': 'put',
            'path': '/scheduler/updateSchedule'

        }
        return this.httpCall.httpCaller(request);
    }



    getInprogress(obj): Observable<Post[]> {
        console.log(obj)
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/scheduler/getInProgress'

        }
        return this.httpCall.httpCaller(request);
    }

    getsComplted(obj): Observable<Post[]> {
        console.log(obj);
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/scheduler/getAllComplted'

        }
        return this.httpCall.httpCaller(request);
    }


    // inProgressData(release): Observable<Post[]> {
    //     return this.http.get(this.api.apiData + "/inprogressDetails" + release)
    //         .map((response: Response) => <Post[]>response.json());
    // }
    // yetToStart(release) {
    //     return this.http.get(this.api.apiData + "/yetToStartDetails" + release)
    //         .map((response: Response) => <Post[]>response.json());
    // }

    // CompletedData(release) {
    //     return this.http.get(this.api.apiData + "/completedDetails" + release)
    //         .map((response: Response) => <Post[]>response.json());
    // }
    // getsInprogress(): Observable<Post[]> {
    //     return this.http.get(this.api.apiData + "/getAllyetToStart" )
    //         .map((response: Response) => <Post[]>response.json());

    // }

    // getsComplted(): Observable<Post[]> {
    //     return this.http.get(this.api.apiData + "/getAllComplted")
    //         .map((response: Response) => <Post[]>response.json());
    // }

    // editInprogress(idToEdit): Observable<Post[]> {
    //     return this.http.get(this.api.apiData + "/getForEdit" + idToEdit, {})
    //         .map((response: Response) => <Post[]>response.json());
    // }

    // getAllReleaseData(obj): Observable<Post[]> {
    //     console.log(obj)
    //     return this.http.get(this.api.apiData + "/getAllreleases" + obj)
    //         .map((response: Response) => <Post[]>response.json());


    // }

}