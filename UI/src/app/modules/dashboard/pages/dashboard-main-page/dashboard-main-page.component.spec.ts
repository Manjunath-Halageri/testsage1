import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMainPageComponent } from './dashboard-main-page.component';

describe('DashboardMainPageComponent', () => {
  let component: DashboardMainPageComponent;
  let fixture: ComponentFixture<DashboardMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
