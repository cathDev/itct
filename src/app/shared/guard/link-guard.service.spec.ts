import { TestBed } from '@angular/core/testing';

import { LinkGuardService } from './link-guard.service';

describe('LinkGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinkGuardService = TestBed.get(LinkGuardService);
    expect(service).toBeTruthy();
  });
});
