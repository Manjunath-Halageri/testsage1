import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCreationComponent } from './organization-creation.component';

describe('OrganizationCreationComponent', () => {
  let component: OrganizationCreationComponent;
  let fixture: ComponentFixture<OrganizationCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
