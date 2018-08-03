import { TestBed, inject } from '@angular/core/testing';

import { DefaultsService } from './defaults.service';

describe('DefaultsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaultsService]
    });
  });

  it('should be created', inject([DefaultsService], (service: DefaultsService) => {
    expect(service).toBeTruthy();
  }));
});
