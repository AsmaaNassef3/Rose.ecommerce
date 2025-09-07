import { TestBed } from '@angular/core/testing';

import { AuthDataLayerService } from './auth-data-layer.service';

describe('AuthDataLayerService', () => {
  let service: AuthDataLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthDataLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
