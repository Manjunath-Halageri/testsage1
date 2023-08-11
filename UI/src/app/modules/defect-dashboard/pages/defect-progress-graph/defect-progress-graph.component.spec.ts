import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectProgressGraphComponent } from './defect-progress-graph.component';

describe('DefectProgressGraphComponent', () => {
  let component: DefectProgressGraphComponent;
  let fixture: ComponentFixture<DefectProgressGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectProgressGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectProgressGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
