import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLabsComponent } from './mobile-labs.component';

describe('MobileLabsComponent', () => {
  let component: MobileLabsComponent;
  let fixture: ComponentFixture<MobileLabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileLabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
