import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestApiManualStepsComponent } from './Pages/rest-api-manual-steps/rest-api-manual-steps.component';
import { RestApiTreeStructureComponent } from './Pages/rest-api-tree-structure/rest-api-tree-structure.component';
import { RestApiModFeatScriptCreationComponent } from './Pages/rest-api-mod-feat-script-creation/rest-api-mod-feat-script-creation.component';
import { PendingChangesGuard } from '../../../guard/pending-changes.guard';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  {
    path: 'apiTreeStructure', component: RestApiTreeStructureComponent, canActivate: [AuthGuard],
    children: [
      { path: 'restApiManualSteps/:id', component: RestApiManualStepsComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard] },
      { path: 'apiModFeatScript', component: RestApiModFeatScriptCreationComponent, canActivate: [AuthGuard] }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [PendingChangesGuard],
  exports: [RouterModule]
})
export class RestAssuredRoutingModule { }
