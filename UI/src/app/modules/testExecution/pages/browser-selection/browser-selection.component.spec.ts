import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserSelectionComponent } from './browser-selection.component';

describe('BrowserSelectionComponent', () => {
  let component: BrowserSelectionComponent;
  let fixture: ComponentFixture<BrowserSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
