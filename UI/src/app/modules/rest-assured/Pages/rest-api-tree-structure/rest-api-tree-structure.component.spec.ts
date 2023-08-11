import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestApiTreeStructureComponent } from './rest-api-tree-structure.component';

describe('RestApiTreeStructureComponent', () => {
  let component: RestApiTreeStructureComponent;
  let fixture: ComponentFixture<RestApiTreeStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestApiTreeStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestApiTreeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
