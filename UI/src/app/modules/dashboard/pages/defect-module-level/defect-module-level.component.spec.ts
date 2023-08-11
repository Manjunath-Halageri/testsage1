import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectModuleLevelComponent } from './defect-module-level.component';

describe('DefectModuleLevelComponent', () => {
  let component: DefectModuleLevelComponent;
  let fixture: ComponentFixture<DefectModuleLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectModuleLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectModuleLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
