import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseValidationComponent } from './response-validation.component';

describe('ResponseValidationComponent', () => {
  let component: ResponseValidationComponent;
  let fixture: ComponentFixture<ResponseValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
