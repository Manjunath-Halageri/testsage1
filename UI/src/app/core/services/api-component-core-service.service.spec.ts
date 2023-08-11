import { TestBed } from '@angular/core/testing';

import { ApiComponentCoreServiceService } from './api-component-core-service.service';

describe('ApiComponentCoreServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiComponentCoreServiceService = TestBed.get(ApiComponentCoreServiceService);
    expect(service).toBeTruthy();
  });
});
