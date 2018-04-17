import { TestBed, inject } from '@angular/core/testing';

import { EventosOrgAulaService } from './eventos-org-aula.service';

describe('EventosOrgAulaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventosOrgAulaService]
    });
  });

  it('should be created', inject([EventosOrgAulaService], (service: EventosOrgAulaService) => {
    expect(service).toBeTruthy();
  }));
});
