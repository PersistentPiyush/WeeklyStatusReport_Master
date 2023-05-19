import { TestBed } from '@angular/core/testing';

import { PptServiceService } from './ppt-service.service';

describe('PptServiceService', () => {
  let service: PptServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PptServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
