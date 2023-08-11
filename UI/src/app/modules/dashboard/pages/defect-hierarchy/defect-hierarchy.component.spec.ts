import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectHierarchyComponent } from './defect-hierarchy.component';

describe('DefectHierarchyComponent', () => {
  let component: DefectHierarchyComponent;
  let fixture: ComponentFixture<DefectHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
