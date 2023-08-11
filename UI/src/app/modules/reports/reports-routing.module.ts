import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeatureLevelComponent } from './pages/feature-level/feature-level.component';
import { ScriptLevelComponent } from './pages/script-level/script-level.component';
import { StepLevelComponent } from './pages/step-level/step-level.component';
///import { SuiteComponent } from '../testExecution/pages/suite/suite.component';
import { SuitelevelComponent } from './pages/suite-level/suite-level.component';

const routes: Routes = [
  {path:'suitelevel/featurelevel', component: FeatureLevelComponent},
  {path: 'suitelevel/featurelevel/scriptlevel', component: ScriptLevelComponent},
  {path:'suitelevel/featurelevel/scriptlevel/steplevel', component: StepLevelComponent},
  {path: 'suitelevel', component: SuitelevelComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
