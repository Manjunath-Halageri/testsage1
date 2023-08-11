import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCorrectionComponent } from './auto-correction.component';

describe('AutoCorrectionComponent', () => {
  let component: AutoCorrectionComponent;
  let fixture: ComponentFixture<AutoCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
