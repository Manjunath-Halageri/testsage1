import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OrganizationCreationComponent } from './pages/organization-creation/organization-creation.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { AuthGuard } from '../../../guard/auth.guard'

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'OrganizationCreation', component: OrganizationCreationComponent, canActivate: [AuthGuard] },
  { path: 'CreateProject', component: CreateProjectComponent, canActivate: [AuthGuard] },
  { path: 'ProjectList', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: '',loadChildren: () => import('../projectDetails/project-details.module').then(m => m.ProjectDetailsModule), canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
