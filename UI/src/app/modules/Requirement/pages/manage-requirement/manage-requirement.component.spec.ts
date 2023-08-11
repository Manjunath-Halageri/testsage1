import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRequirementComponent } from './manage-requirement.component';

describe('ManageRequirementComponent', () => {
  let component: ManageRequirementComponent;
  let fixture: ComponentFixture<ManageRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
