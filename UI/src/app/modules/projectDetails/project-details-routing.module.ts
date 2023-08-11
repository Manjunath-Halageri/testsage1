import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { AuthGuard } from '../../../guard/auth.guard';
import { UserProfileComponent } from '../projectSelection/pages/user-profile/user-profile.component';


const routes: Routes = [
  {
    path: 'projectdetail', component: ProjectDetailsComponent, canActivate: [AuthGuard],

    children: [
      { path: 'testplanning', data: { preload: true }, loadChildren: () => import('../testPlanning/test-planning.module').then(m => m.TestPlanningModule), canActivate: [AuthGuard] },
      { path: 'testExecution', data: { preload: true }, loadChildren: () => import('../testExecution/test-execution.module').then(m => m.TestExecutionModule), canActivate: [AuthGuard] },
      { path: 'docker', data: { preload: true }, loadChildren: () => import('../docker/docker.module').then(m => m.DockerModule), canActivate: [AuthGuard] },
      { path: 'reports', data: { preload: true }, loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule) },
      { path: 'MobileComponent', data: { preload: true }, loadChildren: () => import('../mobileLabs/mobile-labs.module').then(m => m.MobileLabsModule), canActivate: [AuthGuard] },
      { path: 'requirement', data: { preload: true }, loadChildren: () => import('../Requirement/requirement.module').then(m => m.RequirementModule), canActivate: [AuthGuard] },
      { path: 'release', loadChildren: () => import('../release/release.module').then(m => m.ReleaseModule), canActivate: [AuthGuard] },
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
      { path: 'defectManagement', data: { preload: true }, loadChildren: () => import('../defectManagement/defect-management.module').then(m => m.DefectManagementModule), canActivate: [AuthGuard] },
      { path: 'restAssured', loadChildren: () => import('../rest-assured/rest-assured.module').then(m => m.RestAssuredModule), canActivate: [AuthGuard] },
       {path: 'SearchComponent', data:{preload:true},loadChildren: () => import('../search/search.module').then(m => m.SearchModule), canActivate: [AuthGuard]}
    ]
  },
  { path: 'userProfile', component: UserProfileComponent ,canActivate: [AuthGuard], }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectDetailsRoutingModule { }
