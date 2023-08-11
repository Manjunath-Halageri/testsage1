import { TestBed } from '@angular/core/testing';
import { CtcValidationService } from './ctc-validation.service';

describe('CtcValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CtcValidationService = TestBed.get(CtcValidationService);
    expect(service).toBeTruthy();
  });
});
