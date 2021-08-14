import { TestBed } from '@angular/core/testing';

import { HindiService } from './hindi.service';

describe('HindiService', () => {
  let service: HindiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HindiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
