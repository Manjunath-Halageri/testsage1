// mainly used for multiple users access to avoid localhost issue
import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';

@Injectable()

export class apiServiceComponent {
    apiData:string;
    url:string;
    constructor( platformLocation: PlatformLocation) {
        this.url=(platformLocation as any).location.hostname;
        this.apiData="http://" + this.url + ":2111";
    }

}
