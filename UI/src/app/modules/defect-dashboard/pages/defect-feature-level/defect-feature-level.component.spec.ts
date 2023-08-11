import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectFeatureLevelComponent } from './defect-feature-level.component';

describe('DefectFeatureLevelComponent', () => {
  let component: DefectFeatureLevelComponent;
  let fixture: ComponentFixture<DefectFeatureLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectFeatureLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectFeatureLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
