import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateReleaseComponent } from './pages/create-release/create-release.component';
import { ReleaseScopeComponent } from './pages/release-scope/release-scope.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  { path: 'createrelease', component: CreateReleaseComponent, canActivate: [AuthGuard] },
  { path: 'releasescope', component: ReleaseScopeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReleaseRoutingModule { }
