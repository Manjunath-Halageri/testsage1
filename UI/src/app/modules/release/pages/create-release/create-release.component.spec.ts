import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReleaseComponent } from './create-release.component';

describe('CreateReleaseComponent', () => {
  let component: CreateReleaseComponent;
  let fixture: ComponentFixture<CreateReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
