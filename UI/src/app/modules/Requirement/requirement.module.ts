import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraceabilityComponent } from './pages/traceability/traceability.component';
import { ManageRequirementComponent } from './pages/manage-requirement/manage-requirement.component';
import { RequirementRoutingModule } from './requirement-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MatSelectModule } from '@angular/material/select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatTabsModule } from '@angular/material';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { DialogService } from '../../core/services/dialog.service';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [TraceabilityComponent, ManageRequirementComponent],
  imports: [

    CommonModule, RequirementRoutingModule, SharedModule, FormsModule, ReactiveFormsModule,
    ReactiveFormsModule, ShContextMenuModule, NgMultiSelectDropDownModule,
    TreeModule, ContextMenuModule, MatSelectModule, AngularEditorModule, MatTabsModule,
    AmazingTimePickerModule, MatTableModule

  ],
  providers: [DialogService],
})
export class RequirementModule { }
