import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { LoginComponent } from './modules/login/pages/login/login.component';

export const appRoutes: Routes = [

  { path: '', component:LoginComponent }

];
