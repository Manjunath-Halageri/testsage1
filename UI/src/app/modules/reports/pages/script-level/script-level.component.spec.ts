import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptLevelComponent } from './script-level.component';

describe('ScriptLevelComponent', () => {
  let component: ScriptLevelComponent;
  let fixture: ComponentFixture<ScriptLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
