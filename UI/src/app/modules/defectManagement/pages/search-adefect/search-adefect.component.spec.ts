import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchADefectComponent } from './search-adefect.component';

describe('SearchADefectComponent', () => {
  let component: SearchADefectComponent;
  let fixture: ComponentFixture<SearchADefectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchADefectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchADefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
