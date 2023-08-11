import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectNameComponent } from './object-name.component';

describe('ObjectNameComponent', () => {
  let component: ObjectNameComponent;
  let fixture: ComponentFixture<ObjectNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
