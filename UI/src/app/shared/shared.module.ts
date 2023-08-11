import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MaterialModule } from './material.module';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { ObjectNameComponent } from './components/object-name/object-name.component';
@NgModule({
  declarations: [ControlMessagesComponent,ObjectNameComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    ShContextMenuModule,
    RouterModule
  ],
  exports:[ControlMessagesComponent,CommonModule,RouterModule,FormsModule,ReactiveFormsModule,RouterModule
  ]
})

export class SharedModule { }
