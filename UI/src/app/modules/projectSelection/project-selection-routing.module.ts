import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectSelectionComponent } from './pages/project-selection/project-selection.component';
import { AuthGuard } from '../../../guard/auth.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ProjectDetailsComponent } from '../projectDetails/pages/project-details/project-details.component';



const routes: Routes = [
  { path: 'forgotPassword', component: ForgotPasswordComponent},
  { path: 'userProfile', component: UserProfileComponent ,canActivate: [AuthGuard]},
  { path: 'projectSelection', component: ProjectSelectionComponent ,canActivate: [AuthGuard]},
  { path: 'projectDetail', component: ProjectDetailsComponent ,canActivate: [AuthGuard]},

  { path: '',loadChildren: () => import('../projectDetails/project-details.module').then(m => m.ProjectDetailsModule) },
  
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectSelectionRoutingModule { }
