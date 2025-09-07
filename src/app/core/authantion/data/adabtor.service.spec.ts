import { TestBed } from '@angular/core/testing';

import { AdabtorService } from './adabtor.service';

describe('AdabtorService', () => {
  let service: AdabtorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdabtorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
