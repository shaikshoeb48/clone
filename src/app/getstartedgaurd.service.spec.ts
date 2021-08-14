import { TestBed } from '@angular/core/testing';

import { GetstartedgaurdService } from './getstartedgaurd.service';

describe('GetstartedgaurdService', () => {
  let service: GetstartedgaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetstartedgaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
