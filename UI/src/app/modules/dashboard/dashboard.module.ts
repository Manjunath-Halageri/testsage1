import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressGraphComponent } from './pages/progress-graph/progress-graph.component';
import { ExecutedReportsComponent } from './pages/executed-reports/executed-reports.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { DetailedReportsComponent } from './pages/detailed-reports/detailed-reports.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ModuleLevelComponent } from './pages/module-level/module-level.component';
import { FeatureLevelComponent } from './pages/feature-level/feature-level.component';
import { ScriptLevelComponent } from './pages/script-level/script-level.component';
import { DefectProgressComponent } from './pages/defect-progress/defect-progress.component';
import { DefectHierarchyComponent } from './pages/defect-hierarchy/defect-hierarchy.component';
import { DefectModuleLevelComponent } from './pages/defect-module-level/defect-module-level.component';
import { DefectFeatureLevelComponent } from './pages/defect-feature-level/defect-feature-level.component';
import { DashboardMainPageComponent } from './pages/dashboard-main-page/dashboard-main-page.component';
import { RequirementCoverageReportComponent } from './pages/requirement-coverage-report/requirement-coverage-report.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [ProgressGraphComponent, ExecutedReportsComponent, DetailedReportsComponent, ModuleLevelComponent, FeatureLevelComponent, ScriptLevelComponent, DefectProgressComponent, DefectHierarchyComponent, DefectModuleLevelComponent, DefectFeatureLevelComponent, DashboardMainPageComponent, RequirementCoverageReportComponent],
  imports: [
    CommonModule,DashboardRoutingModule,HighchartsChartModule,FormsModule, ReactiveFormsModule, ReactiveFormsModule,MatSelectModule,SharedModule,Ng2GoogleChartsModule,MaterialModule
  ]
})
export class DashboardModule { }
