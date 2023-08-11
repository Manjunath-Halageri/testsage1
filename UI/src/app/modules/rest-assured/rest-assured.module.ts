import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestApiTreeStructureComponent } from './Pages/rest-api-tree-structure/rest-api-tree-structure.component';
import { RestApiModFeatScriptCreationComponent } from './Pages/rest-api-mod-feat-script-creation/rest-api-mod-feat-script-creation.component';
import { RestApiManualStepsComponent } from './Pages/rest-api-manual-steps/rest-api-manual-steps.component';
import { RestAssuredRoutingModule } from './rest-assured-routing.module';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { DialogService } from '../../core/services/dialog.service';
import { ResponseValidationComponent } from './pages/response-validation/response-validation.component';
import { MatIconModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PendingChangesGuard } from '../../../guard/pending-changes.guard';
import { ObjectLengthPipe } from '../../core/pipes/object-length.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [RestApiTreeStructureComponent, RestApiModFeatScriptCreationComponent, RestApiManualStepsComponent,
     ResponseValidationComponent,ObjectLengthPipe],
  imports: [
    CommonModule,
    RestAssuredRoutingModule,
    MatSelectModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
    AmazingTimePickerModule, ReactiveFormsModule,
    Ng2GoogleChartsModule, AmazingTimePickerModule, ShContextMenuModule, NgMultiSelectDropDownModule,
    TreeModule, ContextMenuModule, MatDialogModule, MatChipsModule, MatIconModule, MatAutocompleteModule,
    NgxSpinnerModule
  ],
  providers: [DialogService, PendingChangesGuard],
})
export class RestAssuredModule { }
