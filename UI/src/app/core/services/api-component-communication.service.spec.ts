import { TestBed } from '@angular/core/testing';

import { ApiComponentCommunicationService } from './api-component-communication.service';

describe('ApiComponentCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiComponentCommunicationService = TestBed.get(ApiComponentCommunicationService);
    expect(service).toBeTruthy();
  });
});
