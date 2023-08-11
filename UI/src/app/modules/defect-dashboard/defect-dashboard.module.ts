import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefectDashboardRoutingModule } from './defect-dashboard-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { DetailedDefectComponent } from './pages/detailed-defect/detailed-defect.component';
import { DefectProgressGraphComponent } from './pages/defect-progress-graph/defect-progress-graph.component';
import { DefectModuleLevelComponent } from './pages/defect-module-level/defect-module-level.component';
import { DefectFeatureLevelComponent } from './pages/defect-feature-level/defect-feature-level.component';

@NgModule({
  declarations: [DetailedDefectComponent, DefectProgressGraphComponent, DefectModuleLevelComponent, DefectFeatureLevelComponent],
  imports: [
    CommonModule, DefectDashboardRoutingModule, HighchartsChartModule, FormsModule, ReactiveFormsModule, ReactiveFormsModule, MatSelectModule, SharedModule, Ng2GoogleChartsModule
  ]
})
export class DefectDashboardModule { }
