import { TestBed } from '@angular/core/testing';

import { ShowExecutionReportService } from './show-execution-report.service';

describe('ShowExecutionReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowExecutionReportService = TestBed.get(ShowExecutionReportService);
    expect(service).toBeTruthy();
  });
});
