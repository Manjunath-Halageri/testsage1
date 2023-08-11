import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { DefectDashboardService } from '../../../../core/services/defect-dashboard.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { roleService } from '../../../../core/services/roleService';
@Component({
  selector: 'app-defect-hierarchy',
  templateUrl: './defect-hierarchy.component.html',
  styleUrls: ['./defect-hierarchy.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class DefectHierarchyComponent implements OnInit {
  pageRoles: Object = {}
  defectPriorityForm: FormGroup;
  selProjectName: string;
  obj: any;
  allProData: any;
  projectId: any;
  getAllReleasesVersions: any;
  pageName: any;
  newRole: any;
  newUserId: any;
  newUserName: any;
  selectedProject: any;

  constructor(private router: Router,private fb: FormBuilder,
    private defectdashboardService: DefectDashboardService,
    private dashboardservice: DashboardService,
    private roles: roleService) { }

  ngOnInit() {

    
    this.pageName = "defectHierarchyPage"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)

    this.pageRoles = {
       pageName: this.pageName,
       roleName: this.newRole,
       userId: this.newUserId

    }

    this.getRolesPermissions();
    
    this.releasevalidation()
    this.selProjectName = sessionStorage.getItem('key');
   this.obj = {
      "projectSelection": this.selProjectName
   }
   console.log(this.selProjectName)
   this.dashboardservice.getModuleFields(this.obj)
      .subscribe((data) => {
         this.allProData = data;
         this.projectId = this.allProData.projectId
         console.log(this.projectId);
         this.getAllReleases(this.projectId)
      })

      // this.searchData(this.releaseVersion,this.bugWise)
  }
  // releaseVersion:any;
  // bugWise:any;
  releasevalidation() {
    this.defectPriorityForm = this.fb.group({
      'defectReleaseVersion': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      'bugwiseSelect' : ['',Validators.required]
    });//For release form validation 

  }
  getAllReleases(projectId){
    console.log(projectId)
  var obj = {
    "projectId": projectId
  }
  this.defectdashboardService.getAllReleaseVersions(obj)
  .subscribe((data) => {
     console.log(data)
    this.getAllReleasesVersions = data;

  })

 }
  searchData(releaseVersion,bugWise) {
    // alert("haii")
    console.log(releaseVersion + bugWise)
   
    if (releaseVersion === undefined && bugWise === undefined ) {
      alert("select release")
    } else {
      localStorage.setItem('releaseVersion', releaseVersion);
      localStorage.setItem('bugWise', bugWise);
      this.router.navigate(['/projectdetail/dashboard/defecthierarchy/Defectmodulelevel']);
    }
  }
  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;


  getRolesPermissions() {
     console.log(this.pageRoles);
     this.roles.getPermissions(this.pageRoles).subscribe(
        Data => {
           this.permissions = Data; console.log(this.permissions);
           console.log(this.permissions);

           this.edit = this.permissions[0].edit;
           this.read = this.permissions[0].read
           this.delete = this.permissions[0].delete
           this.create = this.permissions[0].create
           this.disableButton = this.permissions[0].disableButton

        })


  }

}
