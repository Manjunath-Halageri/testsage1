import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgressGraphComponent } from './pages/progress-graph/progress-graph.component';
import { ExecutedReportsComponent } from './pages/executed-reports/executed-reports.component';
import { DetailedReportsComponent } from './pages/detailed-reports/detailed-reports.component';
import { ModuleLevelComponent } from './pages/module-level/module-level.component';
import { FeatureLevelComponent } from './pages/feature-level/feature-level.component';
import { ScriptLevelComponent } from './pages/script-level/script-level.component';
import { DefectProgressComponent } from './pages/defect-progress/defect-progress.component';
import { DefectModuleLevelComponent } from './pages/defect-module-level/defect-module-level.component';
import { DefectFeatureLevelComponent } from './pages/defect-feature-level/defect-feature-level.component';
import { DefectHierarchyComponent } from './pages/defect-hierarchy/defect-hierarchy.component';
import { DashboardMainPageComponent } from './pages/dashboard-main-page/dashboard-main-page.component';
import { RequirementCoverageReportComponent } from './pages/requirement-coverage-report/requirement-coverage-report.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  { path: 'dashboardMain', component: DashboardMainPageComponent, canActivate: [AuthGuard] },
  { path: 'requirementReport', component: RequirementCoverageReportComponent, canActivate: [AuthGuard] },
  { path: 'progressgraph', component: ProgressGraphComponent, canActivate: [AuthGuard] },
  { path: 'executedreports', component: ExecutedReportsComponent, canActivate: [AuthGuard] },
  {
    path: 'detailedreports', component: DetailedReportsComponent, canActivate: [AuthGuard],
    children: [
      { path: 'modulereports', component: ModuleLevelComponent, canActivate: [AuthGuard] },
      { path: 'modulereports/featurereports', component: FeatureLevelComponent, canActivate: [AuthGuard] },
      { path: 'modulereports/featurereports/scriptreports', component: ScriptLevelComponent, canActivate: [AuthGuard] }

    ]
  },
  { path: 'defectProgress', component: DefectProgressComponent, canActivate: [AuthGuard] },
  {
    path: 'defecthierarchy', component: DefectHierarchyComponent, canActivate: [AuthGuard],
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
export class DashboardRoutingModule { }
