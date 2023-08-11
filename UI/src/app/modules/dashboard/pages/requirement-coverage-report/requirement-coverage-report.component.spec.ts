import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementCoverageReportComponent } from './requirement-coverage-report.component';

describe('RequirementCoverageReportComponent', () => {
  let component: RequirementCoverageReportComponent;
  let fixture: ComponentFixture<RequirementCoverageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementCoverageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementCoverageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
