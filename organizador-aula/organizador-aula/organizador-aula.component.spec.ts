import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizadorAulaComponent } from './organizador-aula.component';

describe('OrganizadorAulaComponent', () => {
  let component: OrganizadorAulaComponent;
  let fixture: ComponentFixture<OrganizadorAulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizadorAulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizadorAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
