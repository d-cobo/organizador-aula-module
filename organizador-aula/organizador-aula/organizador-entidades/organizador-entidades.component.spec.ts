import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizadorEntidadesComponent } from './organizador-entidades.component';

describe('OrganizadorEntidadesComponent', () => {
  let component: OrganizadorEntidadesComponent;
  let fixture: ComponentFixture<OrganizadorEntidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizadorEntidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizadorEntidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
