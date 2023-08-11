import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestApiModFeatScriptCreationComponent } from './rest-api-mod-feat-script-creation.component';

describe('RestApiModFeatScriptCreationComponent', () => {
  let component: RestApiModFeatScriptCreationComponent;
  let fixture: ComponentFixture<RestApiModFeatScriptCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestApiModFeatScriptCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestApiModFeatScriptCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
