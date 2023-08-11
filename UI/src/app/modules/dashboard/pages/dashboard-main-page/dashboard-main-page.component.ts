import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-main-page',
  templateUrl: './dashboard-main-page.component.html',
  styleUrls: ['./dashboard-main-page.component.css','../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class DashboardMainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  // Test_Execution:any;
  // TestCase_Report:any;
  // Hierarchy_Test_Execution:any;
  // Defect_Progress:any;
  // Defect_Hierarchy:any;

  dropdownData(moduleSelected){
    console.log(moduleSelected)
    if(moduleSelected == "Test Execution"){
      this.router.navigate(['/projectdetail/dashboard/progressgraph']);
    }
    else if(moduleSelected == "TestCase Report"){
      this.router.navigate(['/projectdetail/dashboard/executedreports']);
    }
    else if(moduleSelected == "Hierarchy Test Execution"){
      this.router.navigate(['/projectdetail/dashboard/detailedreports']);
    }
    else if(moduleSelected == "Defect Progress"){
      this.router.navigate(['/projectdetail/dashboard/defectProgress']);
    }
    else{
      this.router.navigate(['/projectdetail/dashboard/defecthierarchy']);
    }
  }
}
