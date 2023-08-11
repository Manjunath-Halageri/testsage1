import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceTestCaseComponent } from './performance-test-case.component';

describe('PerformanceTestCaseComponent', () => {
  let component: PerformanceTestCaseComponent;
  let fixture: ComponentFixture<PerformanceTestCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceTestCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
