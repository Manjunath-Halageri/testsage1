import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReuseableFunctionComponent } from './create-reuseable-function.component';

describe('CreateReuseableFunctionComponent', () => {
  let component: CreateReuseableFunctionComponent;
  let fixture: ComponentFixture<CreateReuseableFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReuseableFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReuseableFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
