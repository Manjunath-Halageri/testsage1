import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DefectManagementRoutingModule } from './defect-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileABugComponent } from './pages/file-abug/file-abug.component';
import { SearchADefectComponent } from './pages/search-adefect/search-adefect.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [FileABugComponent, SearchADefectComponent],
  imports: [
    CommonModule,
    SharedModule,
    DefectManagementRoutingModule,
    FormsModule, ReactiveFormsModule, MatButtonModule, MatTableModule,
    NgxSpinnerModule
  ]
})
export class DefectManagementModule { }
