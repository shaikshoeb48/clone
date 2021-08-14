import { TestBed } from '@angular/core/testing';

import { TeluguService } from './telugu.service';

describe('TeluguService', () => {
  let service: TeluguService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeluguService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
