import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObjectRepositoryComponent } from './pages/object-repository/object-repository.component';
import { CreateTestCaseComponent } from './pages/create-test-case/create-test-case.component';
import { CreateReuseableFunctionComponent } from './pages/create-reuseable-function/create-reuseable-function.component';
import { ScriptExportComponent } from './pages/script-export/script-export.component';
import { CanDeactivateGuard } from '../../core/services/can-deactivate-guard.service';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  { path: 'objRepo', component: ObjectRepositoryComponent, canActivate: [AuthGuard] },
  { path: 'CreateTestCase', component: CreateTestCaseComponent, canDeactivate: [CanDeactivateGuard], canActivate: [AuthGuard] },
  { path: 'CreateReusableFunction', component: CreateReuseableFunctionComponent, canDeactivate: [CanDeactivateGuard], canActivate: [AuthGuard] },
  { path: 'ScriptExportComponent', component: ScriptExportComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestPlanningRoutingModule { }
