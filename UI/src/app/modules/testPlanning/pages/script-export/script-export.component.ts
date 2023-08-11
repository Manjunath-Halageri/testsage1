import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExportFunctionalityService } from '../../../../core/services/export-functionality.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
@Component({
  selector: 'app-script-export',
  templateUrl: './script-export.component.html',
  styleUrls: ['./script-export.component.css','../../../../layout/css/parent.css'],
  // providers:[ExportFunctionalityService]
})
export class ScriptExportComponent implements OnInit {

  scriptExport:FormGroup;
  exportProjectName:String;
  pushStatus:String;
  localResp:any;
  tempDisabled:boolean;
  myUsername:String;

  constructor( private fb: FormBuilder,
    private exportSerKey:ExportFunctionalityService,
    private decoratorServiceKey:DecoratorService)
    { 
      
    this.scriptExport = fb.group({
      'userPassword':['', Validators.required],
      'userGitRepo':['', Validators.required],
      'userComments':['', Validators.required]

    })
    this.tempDisabled = false;
  }

  ngOnInit() {
    this.exportProjectName = sessionStorage.getItem('key');
    let UserName = sessionStorage.getItem('importedDetails');
        let parsedUserName = JSON.parse(UserName)
        this.myUsername = parsedUserName[0].userName
  }
  onFocus(){
    this.pushStatus = "";
    document.getElementById("statusDisplay").style.color = 'Green';
  }
  

  /*Logic Discription: Used to Push the generated Scripts under that project:
  it requires some parameters like: username,password,comments and git repository to validate the git account and 
  displayes the message to the user
  */
  exportToGitRepo(){
    this.pushStatus = "Check in is In-Progress...!!! Please Wait";
    // this.startTimer()
    this.tempDisabled = true;
    this.scriptExport.value.exportProjectName = this.exportProjectName;
    console.log(this.exportProjectName)
    this.scriptExport.value.userComments = `${this.scriptExport.value.userComments},Comments by ${this.myUsername} a Test Sage User`;
    console.log(this.scriptExport.value.userComments)
    this.exportSerKey.exporToRepo(this.scriptExport.value).
    subscribe(resp=>{
      console.log(resp)
      this.localResp = resp;
      this.tempDisabled = false;
      // this. pauseTimer()
      this.scriptExport.reset();
      if(this.localResp.Error !== undefined){
        document.getElementById("statusDisplay").style.color = 'red';
        this.pushStatus = this.localResp.Error;
      }
      else
      {
        this.decoratorServiceKey.saveSnackbar(this.localResp, '', 'save-snackbar');
        this.pushStatus = "";
      }
     
      
      
    })

  }

  timeLeft: number;
  interval;
  stopExecution:boolean;
  startTimer() {
    this.timeLeft = 25;
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
          if(this.timeLeft == 0){
              // document.getElementById("activateDockerButton").click();
              return this. pauseTimer()
          }
        } else {
          this.timeLeft = 25;
        }
      },1000)
    }
  
    pauseTimer() {
      clearInterval(this.interval);
      this.timeLeft = 25;
    }

    resetValues(){
      this.tempDisabled = false;
      // this. pauseTimer()
      this.scriptExport.reset();
    }

}
