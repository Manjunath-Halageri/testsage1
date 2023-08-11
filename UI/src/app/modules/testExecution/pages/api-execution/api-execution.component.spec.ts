import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiExecutionComponent } from './api-execution.component';

describe('ApiExecutionComponent', () => {
  let component: ApiExecutionComponent;
  let fixture: ComponentFixture<ApiExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
