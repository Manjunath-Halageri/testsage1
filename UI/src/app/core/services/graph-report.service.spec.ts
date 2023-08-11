import { TestBed } from '@angular/core/testing';

import { GraphReportService } from './graph-report.service';

describe('GraphReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphReportService = TestBed.get(GraphReportService);
    expect(service).toBeTruthy();
  });
});
