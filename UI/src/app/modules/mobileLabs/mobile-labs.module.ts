import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileLabsComponent } from './pages/mobile-labs/mobile-labs.component';
import { SharedModule } from '../../shared/shared.module';
import { MobileLabsRoutingModule } from './mobile-labs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MobileLabsComponent],
  imports: [
    CommonModule,
    MobileLabsRoutingModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
  ]
})
export class MobileLabsModule { }
