import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExecutionComponent } from './pages/execution/execution.component';
import { AutoCorrectionComponent } from './pages/auto-correction/auto-correction.component';
import { SchedulerListComponent } from './pages/scheduler-list/scheduler-list.component';
import { SuiteComponent } from './pages/suite/suite.component';
import { SelectionComponent } from './pages/selection/selection.component';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { ApiExecutionComponent } from './pages/api-execution/api-execution.component';
import { PerformanceTestCaseComponent } from './pages/performance-test-case/performance-test-case.component';
import { BrowserSelectionComponent } from './pages/browser-selection/browser-selection.component';
import { AuthGuard } from '../../../guard/auth.guard';
import { CanDeactivateGuard } from '../../core/services/can-deactivate-guard.service';

const routes: Routes = [
  { path: 'testExcecutionComponent', component: SelectionComponent , canActivate: [AuthGuard]},
  { path: 'createsuitecomponent', component: SuiteComponent, canActivate: [AuthGuard] },
  { path: 'executionComponent', component: ExecutionComponent , canActivate: [AuthGuard]},
  { path : 'AutoCorrectionComponent',component:AutoCorrectionComponent, canActivate: [AuthGuard]},
  { path: 'Schedulerlist', component: SchedulerListComponent, canActivate: [AuthGuard]  },
  { path: 'Tracking', component: TrackingComponent  , canActivate: [AuthGuard]},
  { path: 'apiExecution', component: ApiExecutionComponent , canActivate: [AuthGuard] },
  { path: 'performance', component: PerformanceTestCaseComponent ,canDeactivate: [CanDeactivateGuard], canActivate: [AuthGuard] },
  {path: 'browserSelection', component : BrowserSelectionComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestExecutionRoutingModule { }
