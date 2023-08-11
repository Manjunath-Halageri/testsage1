import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { OrganizationCreationComponent } from './pages/organization-creation/organization-creation.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [LoginComponent, OrganizationCreationComponent, ProjectListComponent, CreateProjectComponent],
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule,
    FormsModule, ReactiveFormsModule, ShContextMenuModule, Ng2SearchPipeModule
  ]
})
export class LoginModule { }
