import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionComponent } from './pages/selection/selection.component';
import { SuiteComponent } from './pages/suite/suite.component';
import { ExecutionComponent } from './pages/execution/execution.component';
import { SchedulerListComponent } from './pages/scheduler-list/scheduler-list.component';
import { AutoCorrectionComponent } from './pages/auto-correction/auto-correction.component';
import { TestExecutionRoutingModule } from './test-execution-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { MatTabsModule, MatIconModule, MatDialogModule, MatButtonModule, MatTableModule, MatSelectModule } from '@angular/material';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { DialogService } from '../../core/services/dialog.service';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { ApiExecutionComponent } from './pages/api-execution/api-execution.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { PerformanceTestCaseComponent } from './pages/performance-test-case/performance-test-case.component';
import { BrowserSelectionComponent } from './pages/browser-selection/browser-selection.component';
import { MaterialModule } from '../../shared/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [SelectionComponent, SuiteComponent, ExecutionComponent, SchedulerListComponent, AutoCorrectionComponent, TrackingComponent, ApiExecutionComponent, PerformanceTestCaseComponent, BrowserSelectionComponent],
  imports: [
    CommonModule,
    TestExecutionRoutingModule, ShContextMenuModule, NgMultiSelectDropDownModule,
    TreeModule, ContextMenuModule,
    SharedModule, FormsModule, ReactiveFormsModule, AmazingTimePickerModule, ReactiveFormsModule, MatButtonModule, MatTableModule, MatSelectModule, MaterialModule,
    Ng2GoogleChartsModule, AmazingTimePickerModule, MatTabsModule,NgxSpinnerModule, MatIconModule, ShContextMenuModule, MatDialogModule,MatSortModule],
  entryComponents: [SuiteComponent],
  providers: [DialogService]
})
export class TestExecutionModule { }
