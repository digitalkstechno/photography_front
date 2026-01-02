import { TestBed } from '@angular/core/testing';

import { PatientNoticeService } from './patient-notice.service';

describe('PatientNoticeService', () => {
  let service: PatientNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
