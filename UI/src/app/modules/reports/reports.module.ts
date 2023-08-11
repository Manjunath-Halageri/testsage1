import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepLevelComponent } from './pages/step-level/step-level.component';
import { SuitelevelComponent } from './pages/suite-level/suite-level.component';
import { ScriptLevelComponent } from './pages/script-level/script-level.component';
import { FeatureLevelComponent } from './pages/feature-level/feature-level.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { MatConfirmDialogComponent } from '../../core/mat-confirm-dialog/mat-confirm-dialog.component';
import { MaterialModule } from '../../shared/material.module';


@NgModule({
  declarations: [StepLevelComponent, SuitelevelComponent, ScriptLevelComponent, FeatureLevelComponent,
    ],
  imports: [
    CommonModule,
    ReportsRoutingModule, MaterialModule,
    SharedModule, FormsModule, ReactiveFormsModule, ShContextMenuModule,
    AmazingTimePickerModule, HttpModule, HttpClientModule, ReactiveFormsModule,
    Ng2GoogleChartsModule],

  entryComponents: []
})
export class ReportsModule { }
