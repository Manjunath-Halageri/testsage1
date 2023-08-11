import { Component, OnInit } from '@angular/core';
import { apiServiceComponent } from '../../../core/services/apiService';
import 'rxjs/add/operator/map';
import { ObjectServiceComponent } from '../../../core/services/object.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-object-name',
  templateUrl: './object-name.component.html',
  styleUrls: ['./object-name.component.css']
})
export class ObjectNameComponent implements OnInit {

  pageName: string;
  image: string;
  name: string;
  value: string;
  url: string;
  objectName: string;
  selectedPageName: string;
  constructor(private http: HttpClient, private sendObject: ObjectServiceComponent,
    private api: apiServiceComponent) {
  }

  displayNewObject = []
  hideObjectData: any

  openObjectName: string;
  splitData: string


  ngOnInit() {
    this.showObjectData()

  }

  everyTime: any;
  clickObject: any;
  clearObject: any;
  showObjectData() {


    this.everyTime = setInterval(() => {
      this.clickObject = this.sendObject.clickObject();
      this.clearObject = this.sendObject.clearTable();
      console.log(this.clickObject + "bnbnbnbbn" + this.clearObject)
      if (this.clickObject != undefined && this.clearObject == undefined) {
        this.sendObject.objectNameDetails(this.clickObject)
          .subscribe(moduleData => {
            this.displayNewObject = moduleData; this.displayTable(this.displayNewObject)
            console.log(this.displayNewObject)

            this.hideObjectData = this.displayNewObject
          });
      }
      else if (this.clearObject != undefined) {
        this.clickObject = undefined
        this.tableData = [];
        this.objectName = ''
        clearInterval(this.everyTime);
      }
    }, 100)
  }

  ngOnDestroy() {
    console.log("destroy")
    clearInterval(this.everyTime);
  }

  saveTableData() {
    this.sendObject.objectNameDetails(this.clearObject)
      .subscribe(moduleData => {
        this.displayNewObject = moduleData; this.displayTable(this.displayNewObject);
        this.hideObjectData = this.displayNewObject
      });
  }



  tableData = []
  displayTable(displayNewObject) {

    if (this.clickObject != undefined) {
      this.objectName = displayNewObject[0].objectName;
      this.tableData = this.displayNewObject[0].locators;
    }
    else {
      for (var i = 0; i <= displayNewObject.length - 1; i++) {
        for (var j = 0; j <= this.displayNewObject[i].objectName.length - 1; j++) {
          if (this.objectName == this.displayNewObject[i].objectName[j].objectName) {
            console.log(this.displayNewObject)
            this.objectName = this.displayNewObject[i].objectName[j].objectName;
            this.tableData = this.displayNewObject[i].objectName[j].locators;
          }
        }
      }
    }

  }


  locators: string
  objectData(name, value, url, locators) {

    if (name == undefined && value == undefined && url == undefined && locators == undefined
      || name != undefined && value == undefined && url == undefined && locators == undefined
      || name == undefined && value != undefined && url == undefined && locators == undefined
      || name == undefined && value == undefined && url != undefined && locators == undefined
      || name == undefined && value == undefined && url == undefined && locators != undefined
      || name != undefined && value != undefined && url == undefined && locators == undefined
      || name == undefined && value != undefined && url != undefined && locators != undefined
      || name != undefined && value != undefined && url != undefined && locators == undefined
      || name == undefined && value != undefined && url == undefined && locators != undefined
      || name != undefined && value == undefined && url != undefined && locators == undefined
      || name != undefined && value == undefined && url == undefined && locators != undefined
    ) {
      alert("Please Select Necessary Details")

    }

    let obj = {
      'name': name,
      'value': value,
      'url': url,
      'locators': locators,
      'objectName': this.objectName,
      'pageName': this.clearObject
    }

    this.name = '';
    this.value = '';
    this.url = '';
    this.locators = '';
    return this.http.post(this.api.apiData + "/objectTestName", obj, {})
      .subscribe(data => {
        console.log(data); this.saveTableData()
      });
  }
}
