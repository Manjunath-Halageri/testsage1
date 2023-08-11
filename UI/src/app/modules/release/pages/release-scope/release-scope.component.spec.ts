import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseScopeComponent } from './release-scope.component';

describe('ReleaseScopeComponent', () => {
  let component: ReleaseScopeComponent;
  let fixture: ComponentFixture<ReleaseScopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseScopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
