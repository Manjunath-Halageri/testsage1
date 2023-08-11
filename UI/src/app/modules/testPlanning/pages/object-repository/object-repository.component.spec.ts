import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRepositoryComponent } from './object-repository.component';

describe('ObjectRepositoryComponent', () => {
  let component: ObjectRepositoryComponent;
  let fixture: ComponentFixture<ObjectRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
