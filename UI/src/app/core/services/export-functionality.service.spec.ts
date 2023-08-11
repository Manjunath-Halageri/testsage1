import { TestBed } from '@angular/core/testing';
import { ExportFunctionalityService } from './export-functionality.service';

describe('ExportFunctionalityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportFunctionalityService = TestBed.get(ExportFunctionalityService);
    expect(service).toBeTruthy();
  });
});
