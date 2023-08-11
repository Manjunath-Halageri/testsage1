import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectDetailsRoutingModule } from './project-details-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { MatTabsModule, MatDialogModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule, MatBadgeModule, MatCardModule, MatToolbarModule } from '@angular/material';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { UserProfileComponent } from '../projectSelection/pages/user-profile/user-profile.component';
import { MatConfirmDialogComponent } from '../../core/mat-confirm-dialog/mat-confirm-dialog.component';
import { DialogService } from '../../core/services/dialog.service';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [ProjectDetailsComponent, UserProfileComponent, MatConfirmDialogComponent],
  imports: [
    CommonModule,
    ProjectDetailsRoutingModule,
    SharedModule,
    FormsModule, ReactiveFormsModule, ShContextMenuModule,
    AmazingTimePickerModule, ReactiveFormsModule,
    Ng2GoogleChartsModule, MatDialogModule, MatIconModule, MatMenuModule,
    MatToolbarModule, MatTabsModule, MatSelectModule,
    MatIconModule, MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    MatTableModule
  ],
  entryComponents: [MatConfirmDialogComponent],
  providers: [DialogService],
})
export class ProjectDetailsModule { }
