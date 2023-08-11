import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSelectionComponent } from './pages/project-selection/project-selection.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { MatTabsModule, MatDialogModule } from '@angular/material';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ProjectSelectionRoutingModule } from './project-selection-routing.module';
import { MatConfirmDialogComponent } from '../../core/mat-confirm-dialog/mat-confirm-dialog.component';
import { DialogService } from '../../core/services/dialog.service';
import { MatTableModule } from '@angular/material/table';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';




@NgModule({
  declarations: [ProjectSelectionComponent, MatConfirmDialogComponent, UserProfileComponent, ForgotPasswordComponent],
  imports: [
    CommonModule, SharedModule, FormsModule, ReactiveFormsModule, ShContextMenuModule,
    MatTabsModule, AmazingTimePickerModule, ReactiveFormsModule,
    MatDialogModule, Ng2GoogleChartsModule, ProjectSelectionRoutingModule, MatTableModule
  ],
  entryComponents: [MatConfirmDialogComponent],
  providers: [DialogService],
})
export class ProjectSelectionModule { }
