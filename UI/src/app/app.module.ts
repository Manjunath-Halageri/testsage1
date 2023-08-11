import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { appRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './modules/login/login.module';
import { AutoLogoutService } from './core/services/autologoutservice';
import { apiServiceComponent } from './core/services/apiService';
import { ConnectToServerService } from './core/services/connect-to-server.service';
import { ObjectServiceComponent } from './core/services/object.service';
import { TestCaseCommonService } from './core/services/test-case-common.service';
import { LoginServiceComponent } from './core/services/login.service';
import { MobileService } from './core/services/mobile.service';
import { ProjectDetailServiceComponent } from './core/services/pDetail.service';
import { ImportServiceComponent } from './core/services/importPage.service';
import { ProjectSelectionServiceComponent } from './core/services/projectSelection.service';
import { ModuleServiceComponent } from './core/services/modulePage.service';
import { FeatureServiceComponent } from './core/services/featurePage.service';
import { GraphReportService } from './core/services/graph-report.service';
import { roleService } from './core/services/roleService';
import { CustomPreloadingStrategy } from './preloading-strategy';
import { CanDeactivateGuard } from './core/services/can-deactivate-guard.service';
import { TokenInterceptorService } from './core/services/authorization.interceptor'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from '../guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';
// import { ObjectLengthPipe } from './core/pipes/object-length.pipe';

// import { SanitizerPipe } from './modules/reports/pages/step-level/SanitizerPipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SideNavComponent,
    ContentLayoutComponent,
  
    // ObjectLengthPipe
    //SanitizerPipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { preloadingStrategy: CustomPreloadingStrategy }),
    BrowserAnimationsModule,
    SharedModule,
    LoginModule,
    HttpClientModule
  ],

  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }, AuthGuard,
    AutoLogoutService, roleService, PreloadAllModules, apiServiceComponent, ConnectToServerService,
    ObjectServiceComponent, TestCaseCommonService, LoginServiceComponent, MobileService,
    ProjectDetailServiceComponent, ImportServiceComponent, CanDeactivateGuard,
    ProjectSelectionServiceComponent, ModuleServiceComponent, FeatureServiceComponent, GraphReportService]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
