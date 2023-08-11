import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateReleaseComponent } from './pages/create-release/create-release.component';
import { ReleaseScopeComponent } from './pages/release-scope/release-scope.component';
import { ReleaseRoutingModule } from './release-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [CreateReleaseComponent, ReleaseScopeComponent],
  imports: [
    CommonModule, ReleaseRoutingModule, SharedModule, MatInputModule, FormsModule, ReactiveFormsModule,
    ShContextMenuModule, TreeModule, ContextMenuModule, MatDatepickerModule, MatTableModule,MatCheckboxModule
  ]
})
export class ReleaseModule { }
