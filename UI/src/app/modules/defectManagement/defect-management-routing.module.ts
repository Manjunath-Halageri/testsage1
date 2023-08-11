import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileABugComponent } from './pages/file-abug/file-abug.component';
import { SearchADefectComponent } from './pages/search-adefect/search-adefect.component';
import { AuthGuard } from '../../../guard/auth.guard';

const routes: Routes = [
  {path:'fileADefect' , component: FileABugComponent, canActivate: [AuthGuard]},
  {path:'searchADefect' , component: SearchADefectComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefectManagementRoutingModule { }
