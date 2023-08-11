import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockerComponent } from './pages/docker/docker.component';
import { SharedModule } from '../../shared/shared.module';
import { DockerRoutingModule } from './docker-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { DockerMachineNameComponent } from './pages/docker-machine-name/docker-machine-name.component';
import { DialogService } from '../../core/services/dialog.service';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule, MatIconModule, MatDialogModule, MatButtonModule, MatTableModule, MatSelectModule } from '@angular/material';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [DockerComponent, DockerMachineNameComponent],
  imports: [
    CommonModule,
    DockerRoutingModule,
    SharedModule, MatProgressButtonsModule, MatProgressSpinnerModule,
    FormsModule, ReactiveFormsModule, ShContextMenuModule,
    MatTabsModule, AmazingTimePickerModule, ReactiveFormsModule,
    Ng2GoogleChartsModule, MatTableModule, MatIconModule, MatDialogModule, MatButtonModule, MatSelectModule,
    NgxSpinnerModule

  ],
  providers: [DialogService]

})
export class DockerModule { }
