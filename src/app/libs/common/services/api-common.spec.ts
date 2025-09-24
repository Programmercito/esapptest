import { TestBed } from '@angular/core/testing';

import { ApiCommon } from './api-common';

describe('ApiCommon', () => {
  let service: ApiCommon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCommon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
