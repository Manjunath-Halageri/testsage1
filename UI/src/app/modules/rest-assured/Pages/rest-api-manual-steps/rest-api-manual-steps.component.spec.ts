import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestApiManualStepsComponent } from './rest-api-manual-steps.component';

describe('RestApiManualStepsComponent', () => {
  let component: RestApiManualStepsComponent;
  let fixture: ComponentFixture<RestApiManualStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestApiManualStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestApiManualStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
