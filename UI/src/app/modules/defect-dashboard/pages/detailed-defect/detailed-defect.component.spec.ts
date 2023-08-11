import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedDefectComponent } from './detailed-defect.component';

describe('DetailedDefectComponent', () => {
  let component: DetailedDefectComponent;
  let fixture: ComponentFixture<DetailedDefectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedDefectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedDefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
