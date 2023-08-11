import { TestBed } from '@angular/core/testing';

import { TestdataService } from './testdata.service';

describe('TestdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestdataService = TestBed.get(TestdataService);
    expect(service).toBeTruthy();
  });
});
