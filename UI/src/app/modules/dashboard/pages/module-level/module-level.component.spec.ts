import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLevelComponent } from './module-level.component';

describe('ModuleLevelComponent', () => {
  let component: ModuleLevelComponent;
  let fixture: ComponentFixture<ModuleLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
