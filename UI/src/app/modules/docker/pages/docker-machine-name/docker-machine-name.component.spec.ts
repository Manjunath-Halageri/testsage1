import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerMachineNameComponent } from './docker-machine-name.component';

describe('DockerMachineNameComponent', () => {
  let component: DockerMachineNameComponent;
  let fixture: ComponentFixture<DockerMachineNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerMachineNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerMachineNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
