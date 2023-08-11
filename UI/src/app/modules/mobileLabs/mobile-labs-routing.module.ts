import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileLabsComponent } from './pages/mobile-labs/mobile-labs.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  { path: '', component: MobileLabsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileLabsRoutingModule { }
