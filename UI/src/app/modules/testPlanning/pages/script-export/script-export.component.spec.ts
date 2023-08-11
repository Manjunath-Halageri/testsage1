import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptExportComponent } from './script-export.component';

describe('ScriptExportComponent', () => {
  let component: ScriptExportComponent;
  let fixture: ComponentFixture<ScriptExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
