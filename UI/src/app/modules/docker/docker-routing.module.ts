import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DockerComponent } from './pages/docker/docker.component';
import { DockerMachineNameComponent } from './pages/docker-machine-name/docker-machine-name.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  { path: 'dockerComponent', component: DockerComponent, canActivate: [AuthGuard] },
  { path: 'dockerComponent/dockerMachineNameComponent', component: DockerMachineNameComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerRoutingModule { }
