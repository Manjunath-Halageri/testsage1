import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectProgressComponent } from './defect-progress.component';

describe('DefectProgressComponent', () => {
  let component: DefectProgressComponent;
  let fixture: ComponentFixture<DefectProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
