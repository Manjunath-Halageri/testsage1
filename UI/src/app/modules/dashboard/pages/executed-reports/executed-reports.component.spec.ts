import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutedReportsComponent } from './executed-reports.component';

describe('ExecutedReportsComponent', () => {
  let component: ExecutedReportsComponent;
  let fixture: ComponentFixture<ExecutedReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutedReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
