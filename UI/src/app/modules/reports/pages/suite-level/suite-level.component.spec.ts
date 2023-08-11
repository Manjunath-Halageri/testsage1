import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitelevelComponent } from './suite-level.component';

describe('SuiteLevelComponent', () => {
  let component: SuitelevelComponent;
  let fixture: ComponentFixture<SuitelevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuitelevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitelevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
