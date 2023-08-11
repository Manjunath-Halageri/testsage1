import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureLevelComponent } from './feature-level.component';

describe('FeatureLevelComponent', () => {
  let component: FeatureLevelComponent;
  let fixture: ComponentFixture<FeatureLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
