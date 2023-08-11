import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TraceabilityComponent } from './pages/traceability/traceability.component';
import { ManageRequirementComponent } from './pages/manage-requirement/manage-requirement.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  {path:'managerequirement', component: ManageRequirementComponent, canActivate: [AuthGuard] },
  {path:'traceability', component: TraceabilityComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementRoutingModule { }
