import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepLevelComponent } from './step-level.component';

describe('StepLevelComponent', () => {
  let component: StepLevelComponent;
  let fixture: ComponentFixture<StepLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
