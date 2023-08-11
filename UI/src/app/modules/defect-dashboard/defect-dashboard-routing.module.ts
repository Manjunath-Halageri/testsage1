import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefectProgressGraphComponent } from './pages/defect-progress-graph/defect-progress-graph.component';
import { DetailedDefectComponent } from './pages/detailed-defect/detailed-defect.component';
import { DefectModuleLevelComponent } from './pages/defect-module-level/defect-module-level.component';
import { DefectFeatureLevelComponent } from './pages/defect-feature-level/defect-feature-level.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  { path: 'defectprogress', component: DefectProgressGraphComponent, canActivate: [AuthGuard] },
  {
    path: 'detaileddefect', component: DetailedDefectComponent, canActivate: [AuthGuard],
    children: [
      { path: 'Defectmodulelevel', component: DefectModuleLevelComponent, canActivate: [AuthGuard] },
      { path: 'Defectmodulelevel/Defectfeaturelevel', component: DefectFeatureLevelComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DefectDashboardRoutingModule { }
