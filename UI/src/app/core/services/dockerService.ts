import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
    providedIn: 'root'
})
export class DockerService {
    constructor(private httpCall: HttpcallService) { }

    getMachines(obj) {
        console.log("Getting all Machine information", obj);
        let request = {
            'method': 'get',
            'path': '/infrastructure/getMachinesList',
            'params': obj
        }
        return this.httpCall.httpCaller(request);


    }

    getOrgDetails(obj) {
        console.log("Getting information", obj);
        let request = {
            'method': 'get',
            'path': '/infrastructure/getPerticularOrg',
            'params': obj
        }
        return this.httpCall.httpCaller(request);
    }

    removeContainer(obj) {
        console.log(obj);
        let request = {
            'method': 'post',
            'path': '/infrastructure/rmContainer',
            'params': obj,
        }
        return this.httpCall.httpCaller(request);

    }

    createMany(obj) {
        console.log(obj)
        let request = {
            'method': 'post',
            'path': '/infrastructure/runContainer',
            'params': obj
        }
        return this.httpCall.httpCaller(request);
    }

    startFirstMachine(obj) {
        console.log(obj);
        let request = {
            'method': 'get',
            'path': '/docker/dockerUp',
            'params': obj
        }
        return this.httpCall.httpCaller(request);
    }

    machineStart(obj) {
        console.log(obj);
        let request = {
            'method': 'post',
            'path': '/docker/startManually',
            'params': obj
        }
        return this.httpCall.httpCaller(request);

    }

    startJMachine(obj) {
        console.log(obj);
        let request = {
            'method': 'post',
            'path': '/infrastructure/startJMachine',
            'params': obj
        }
        return this.httpCall.httpCaller(request);

    }
    machineStop(obj){
        console.log(obj);
        let request = {
            'method': 'post',
            'path': '/docker/stopManually',
            'params': obj
        }
        return this.httpCall.httpCaller(request);
    }

    checkInDb(obj) {
        console.log(obj);
        let request = {
            'method': 'get',
            'path': '/docker/checkInterval',
            'params': obj
        }
        return this.httpCall.httpCaller(request);
    }

    autoStop(obj) {
        console.log(obj);
        let request = {
            'method': 'get',
            'path': '/docker/autoStopping',
            'params': obj
        }
        return this.httpCall.httpCaller(request);
    }

    getJMachines(obj) {
        console.log("Getting all JMachine information", obj);
        let request = {
            'method': 'get',
            'path': '/infrastructure/getJMachinesList',
            'params': obj
        }
        return this.httpCall.httpCaller(request);
    }

    startJmeterContainer(obj) {
        console.log(obj);
        let request = {
            'method': 'post',
            'path': '/infrastructure/startJmeterContainer',
            'params': obj,
        }
        return this.httpCall.httpCaller(request);

    }

    stopJmeterContainer(obj) {
        console.log(obj);
        let request = {
            'method': 'post',
            'path': '/infrastructure/stopJmeterContainer',
            'params': obj,
        }
        return this.httpCall.httpCaller(request);

    }
}