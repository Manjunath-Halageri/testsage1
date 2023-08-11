import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTestCaseComponent } from './pages/create-test-case/create-test-case.component';
import { CreateReuseableFunctionComponent } from './pages/create-reuseable-function/create-reuseable-function.component';
import { ObjectRepositoryComponent } from './pages/object-repository/object-repository.component';
import { TestPlanningRoutingModule } from './test-planning-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { SharedModule } from '../../shared/shared.module';
import { DialogService } from '../../core/services/dialog.service';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ScriptExportComponent } from './pages/script-export/script-export.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [CreateTestCaseComponent,
    CreateReuseableFunctionComponent, ObjectRepositoryComponent, ScriptExportComponent],
  imports: [
    // BrowserModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    SharedModule,
    TestPlanningRoutingModule,
    FormsModule, ReactiveFormsModule,
    AmazingTimePickerModule, ReactiveFormsModule,
    Ng2GoogleChartsModule, AmazingTimePickerModule, ShContextMenuModule, NgMultiSelectDropDownModule,
    TreeModule, ContextMenuModule, MatTableModule, MatCheckboxModule, NgxPaginationModule,NgxSpinnerModule
  ],
  providers: [DialogService],
  // entryComponents:[VariableModalComponent]
})
export class TestPlanningModule { }
