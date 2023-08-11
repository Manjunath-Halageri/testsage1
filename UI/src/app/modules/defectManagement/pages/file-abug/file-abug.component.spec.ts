import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileABugComponent } from './file-abug.component';

describe('FileABugComponent', () => {
  let component: FileABugComponent;
  let fixture: ComponentFixture<FileABugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileABugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileABugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
