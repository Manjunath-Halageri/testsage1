import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../../post';
import { ApiComponentCommunicationService } from '../../../../core/services/api-component-communication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ApiComponentCoreServiceService } from '../../../../core/services/api-component-core-service.service';
import { HttpClient } from '@angular/common/http';
import { CreateService } from '../../../../core/services/release-create.service';
import { RestApiTreeStructureComponent } from '../rest-api-tree-structure/rest-api-tree-structure.component';
import { isBoolean } from 'util';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { browserRefresh } from '../../../../app.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rest-api-mod-feat-script-creation',
  templateUrl: './rest-api-mod-feat-script-creation.component.html',
  styleUrls: ['./rest-api-mod-feat-script-creation.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class RestApiModFeatScriptCreationComponent implements OnInit {
  showmoduleData: boolean;
  rForm: FormGroup;
  featForm: FormGroup;
  scriptForm: FormGroup;
  moduleData: String;
  projectName;
  projectDetails;
  projectFramework;
  projectId;
  frameId;
  showFeatureData: boolean;
  featureData: string;
  clickedModule: any;
  showScriptData = false;
  clickedFeature: any;
  type: any[];
  priority: any[];
  clickedScript: any;
  scriptData: string;
  description: string;
  requirementName: string;
  showEditData = false;
  priorityData: any;
  typeData: any;
  proId: { projectId: any; };
  editModule: boolean = false;

  public browserRefresh: boolean;


  constructor(private data1: ApiComponentCommunicationService,
    private fb: FormBuilder, private data: ProjectDetailServiceComponent,
    private http: HttpClient, private api: apiServiceComponent,
    private apiCore: ApiComponentCoreServiceService, private createService: CreateService,
    private apiTreeCom: RestApiTreeStructureComponent,
    private decoratorServiceKey: DecoratorService, private router: Router) {

    this.rForm = fb.group({
      'modName': ['', Validators.compose([Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)])]

    });//for Module Name validation

    this.featForm = fb.group({
      'featName': ['', Validators.compose([Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)])]
    });//For Feature Name validation

    this.scriptForm = fb.group({
      'scrName': ['', Validators.compose([Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)])],
      'prio': ['', Validators.required],
      'typeSelect': ['', Validators.required],
      'description': ['', Validators.required],
      'requirementSelect': ['']

    });//For Script form validation

  }



  ngOnInit() {
    this.browserRefresh = browserRefresh;
    console.log('refreshed?:', browserRefresh);
    if (browserRefresh) {
      this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
    } else {
      this.showFeatureData = false;
      this.showmoduleData = false;
      this.showScriptData = false;
      this.showEditData = false;
      this.editFeature = false;
      this.editModule = false;
      // this.moduleOpen();
      this.moduleData = "";
      this.featureData = "";
      this.scriptData = "";
      this.priortyFetch();
      // this.typeFetch();
      let dataFromProjectSelectionDropdown = sessionStorage.getItem('key');
      this.projectName = dataFromProjectSelectionDropdown;

      this.projectDetails = this.data.selectedProject();
      this.http.get(this.api.apiData + '/getProjctFrameWork' + this.projectDetails)
        .map(response => { return response as any })
        .subscribe(result => {
          this.projectFramework = result;
          this.projectId = this.projectFramework[0].projectId;
          this.frameId = this.projectFramework[0].frameworkId;
          console.log(this.projectId, this.frameId);
          // this.editScriptOpen();
          this.proId = {
            projectId: this.projectId
          }
        });
    }
  }

  /*logic Description: fetahing the types */
  typeFetch() {
    this.createService.typeDetails().subscribe((typeData) => {
      this.type = typeData;
      this.moduleOpen();
    });
  }

    /*logic Description: fetching the priorities */
  priortyFetch() {
    this.createService.priorityDetails().subscribe((priorityData) => {
      this.priority = priorityData;
      this.typeFetch();
    });
  }

    /*logic Description: if condition will execute when module is creating */
  public moduleValue: any = {};
  moduleOpen() {
    this.moduleValue = this.data1.moduleViewValue;
    console.log(this.moduleValue);
    if (this.moduleValue["flag"]) {
      this.showmoduleData = this.moduleValue["flag"];
      this.showFeatureData = false;
      this.showScriptData = false;
      this.showEditData = false;
      this.editFeature = false;
      this.editModule = false;
    } else {
      this.rForm.reset();
      this.featureOpen();
    }
  }

    /*logic Description: if condition will execute when feature is creating */
  public featureValue: any = {};
  featureOpen() {
    this.featureValue = this.data1.featureViewValue;
    console.log(this.featureValue);
    if (this.featureValue["flag"]) {
      this.showFeatureData = this.featureValue["flag"];
      this.clickedModule = this.featureValue["clickedModule"];
      this.showmoduleData = false;
      this.showScriptData = false;
      this.showEditData = false;
      this.editFeature = false;
      this.editModule = false;
    } else {
      this.featForm.reset();
      this.scriptOpen();
    }
  }

    /*logic Description: if condition will execute when script is creating */
  public scriptValue: any = {};
  scriptOpen() {
    this.scriptValue = this.data1.scriptOpenValue;
    if (this.scriptValue["flag"]) {
      this.showScriptData = this.scriptValue["flag"];
      this.clickedModule = this.scriptValue["clickedModule"];
      this.clickedFeature = this.scriptValue["clickedFeature"];
      this.showFeatureData = false;
      this.showmoduleData = false;
      this.showEditData = false;
      this.editFeature = false;
      this.editModule = false;
    } else {
      this.scriptForm.reset();
      this.moduleEditOpen();
    }
  }

      /*logic Description: if condition will execute when module is editing */
  clickedModuleId: any;
  assignedModule: any = [];
  public moduleEditVAlue: any = {};
  moduleEditOpen() {
    this.moduleEditVAlue = this.data1.moduleEditValue;
    console.log(this.moduleEditVAlue);
    if (this.moduleEditVAlue["flag"]) {
      this.editModule = this.moduleEditVAlue["flag"];
      this.clickedModule = this.moduleEditVAlue["clickedModule"];
      this.clickedModuleId = this.moduleEditVAlue["clickedModuleId"];
      this.showFeatureData = false;
      this.showScriptData = false;
      this.showEditData = false;
      this.editFeature = false;
      let obj = {
        'moduleName': this.clickedModule,
        'moduleId': this.clickedModuleId
      }
      this.apiCore.displayModulePage(obj)
        .subscribe(result => {
          this.assignedModule = result;
          this.moduleData = this.assignedModule[0].moduleName;
        });
    }
    else {
      this.featureEditOpen();
    }
  }

      /*logic Description: if condition will execute when feature is editing */
  editFeature: any = false;
  clickedFeatureId: any;
  public featureEditVAlue: any = {};
  featureEditOpen() {
    this.featureEditVAlue = this.data1.featureEditValue;
    console.log(this.featureEditVAlue);
    if (this.featureEditVAlue["flag"]) {
      this.editFeature = this.featureEditVAlue["flag"];
      this.clickedModule = this.featureEditVAlue["clickedModule"];
      this.clickedModuleId = this.featureEditVAlue["clickedModuleId"];
      this.clickedFeature = this.featureEditVAlue['clickedFeature'];
      this.clickedFeatureId = this.featureEditVAlue['clickedFeatureId'];
      this.showFeatureData = false;
      this.showScriptData = false;
      this.showEditData = false;
      this.editModule = false;
      let obj = {
        'moduleName': this.clickedModule,
        'moduleId': this.clickedModuleId,
        'featureName': this.clickedFeature,
        'featureId': this.clickedFeatureId
      }
      this.apiCore.displayFeaturePage(obj)
        .subscribe(result => {
          this.assignedModule = result;
          this.featureData = this.assignedModule[0].featureName;
        });
    }
    else {
      this.editScriptOpen();
    }
  }
    /*logic Description:not using */
  spliceDefault() {
    this.priority.splice(0, 1)
    console.log(this.priority);
  }
    /*logic Description: not using */
  addDefault() {
    this.priority.unshift({ priorityId: '', priorityName: this.priorityData })
    console.log(this.priority);
  }

      /*logic Description: if condition will execute when script is editing */
  clickedScriptId: any;
  public editScriptEditValue: any = {};
  editScriptOpen() {
    this.editScriptEditValue = this.data1.scriptEditValue;
    console.log(this.editScriptEditValue);
    if (this.editScriptEditValue["flag"] == true) {
      this.showEditData = this.editScriptEditValue["flag"];
      this.clickedModule = this.editScriptEditValue["clickedModule"];
      this.clickedModuleId = this.editScriptEditValue["clickedModuleId"];
      this.clickedFeature = this.editScriptEditValue['clickedFeature'];
      this.clickedFeatureId = this.editScriptEditValue['clickedFeatureId'];
      this.clickedScript = this.editScriptEditValue['clickedScript'];
      this.clickedScriptId = this.editScriptEditValue['clickedScriptId'];
      this.showFeatureData = false;
      this.showmoduleData = false;
      this.showScriptData = false;
      this.editFeature = false;
      this.editModule = false;
      let obj = {
        'scriptName': this.clickedScript,
        'scriptId': this.clickedScriptId
      };
      console.log(this.priority, this.type, obj);
      this.apiCore.getScriptDataForEdit(obj).subscribe((data) => {
        console.log(data);
        // console.log(this.priority,this.type);
        this.assignedModule = data;
        this.scriptData = this.assignedModule[0];
        this.priorityData = this.assignedModule[4];
        this.typeData = this.assignedModule[3];
        this.description = this.assignedModule[1];
        this.requirementName = this.assignedModule[2];
      })
    }
  }

      /*logic Description: creating the module */
  saveApiModuleData(moduleData) {
    if (this.moduleData == "" || this.moduleData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.moduleData = ""
      let obj = {
        'moduleName': moduleData,
        'projectId': this.projectId,
        'projectName': this.projectName,
        'frameworkId': this.frameId
      }
      this.apiCore.sendApiModuleData(obj).subscribe((data) => {
        console.log("response", data);
        if (data[0].duplicate) {
          this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
        } else {
          this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
          this.apiTreeCom.getTreeModules();
          this.showmoduleData = false;
        }
        this.closeApiModule();
      })
    }
  }

      /*logic Description: updating the module */
  updateModuleData(moduleData) {
    if (this.moduleData == "" || this.moduleData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.moduleData = ""
      let moduleObject = {
        'updateName': moduleData,
        'moduleName': this.clickedModule,
        'projectId': this.projectId,
        'moduleId': this.clickedModuleId
      }
      this.apiCore.updateModule(moduleObject)
        .subscribe(data => {
          this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')//by shivakumar
          this.apiTreeCom.getTreeModules();
          this.editModule = false;
          this.closeApiModule();
        });
    }
  }

      /*logic Description: updating the feature */
  updateFeatureData(featureData) {
    if (this.featureData == "" || this.featureData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.featureData = "";
      let obj = {
        'updateName': featureData,
        'featureName': this.clickedFeature,
        'featureId': this.clickedFeatureId,
        'projectId': this.projectId
      }
      this.apiCore.updateFeature(obj)
        .subscribe(data => {
          this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')//by shivakumar
          this.apiTreeCom.getTreeModules();
          this.editFeature = false;
          this.closeApifeature();
        });
    }
  }

      /*logic Description: adding an object and routing to treestructure when close of module modal */
  closeApiModule() {
    this.showmoduleData = false;
    this.editModule = false;
    this.rForm.reset();

    this.data1.enableModuleOpenValue({ 'flag': false });
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
  }

  /*logic Description: creating the feature */
  saveApiFeatureData(featureData) {
    if (this.featureData == "" || this.featureData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.featureData = "";
      let obj = {
        'featureName': featureData,
        'projectName': this.projectName,
        'moduleName': this.clickedModule,
        'projectId': this.projectId,
        'frameworkId': this.frameId
      }

      this.apiCore.sendApiFeatureData(obj).subscribe((data) => {
        console.log("response", data);
        if (data[0].duplicate) {
          this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
        } else {
          this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
          this.apiTreeCom.getTreeModules();
          this.showFeatureData = false;
        }
        this.closeApifeature();
      })
    }
  }

  /*logic Description: adding an object and routing to treestructure when close of feature modal */
  closeApifeature() {
    this.showFeatureData = false;
    this.editFeature = false;
    this.featForm.reset();

    this.data1.enableFeatureOpenValue({ 'flag': false });
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
  }

/*logic Description: creating the script  */
  saveScriptData(scriptData, priority, type, requirementName, description) {
    this.clickedScript = scriptData;
    if (this.scriptData == "" || this.scriptData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.scriptData = ""
      this.priority = []
      this.type = []
      this.description = "";
      this.requirementName = "";

      let obj = {
        'scriptName': scriptData,
        'projectName': this.projectName,
        'moduleName': this.clickedModule,
        'featureName': this.clickedFeature,
        'description': description,
        'priority': priority,
        'type': type,
        'requiremantName': requirementName,
        'frameworkId': this.frameId,
        'projectId': this.projectId
      }

      this.apiCore.sendApiScriptData(obj).subscribe((data) => {
        console.log("response", data);
        if (data[0].duplicate) {
          this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
        } else {
          this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
          this.apiTreeCom.getTreeModules();
          this.showScriptData = false;
        }
        this.priortyFetch();
        this.typeFetch();
        this.closeScriptData();
      })
    }
  }

/*logic Description: update the script  */
  updateScriptData(scriptData, priorityData, typeData, requirementName, description) {
    let obj = {
      'updateName': scriptData,
      'scriptName': this.clickedScript,
      'scriptId': this.clickedScriptId,
      'priority': priorityData,
      'type': typeData,
      'description': description,
      'requirementName': requirementName,
      'projectId': this.projectId,
      'frameworkId': this.frameId,
      'projectName': this.projectName,
      'moduleName': this.clickedModule,
      'featureName': this.clickedFeature,
    }

    this.scriptData = '';
    this.priorityData = '';
    this.typeData = '';
    this.description = '';
    this.requirementName = '';
    this.apiCore.sendScriptDataForUpdate(obj).subscribe((data) => {
      console.log(data);
      this.showEditData = false;
      this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')
      this.apiTreeCom.getTreeModules();
      this.closeScriptData();
    })
  }

  /*logic Description: adding an object and routing to treestructure when close of script modal */
  closeScriptData() {
    this.showScriptData = false;
    this.showEditData = false;
    this.scriptForm.reset();

    this.data1.enableScriptOpenValue({ 'flag': false });
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
  }
}
