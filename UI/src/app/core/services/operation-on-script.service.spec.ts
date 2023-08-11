import { TestBed } from '@angular/core/testing';
import { OperationOnScriptService } from './operation-on-script.service';

describe('OperationOnScriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  it('should be created', () => {
    const service: OperationOnScriptService = TestBed.get(OperationOnScriptService);
    expect(service).toBeTruthy();
  });
});
