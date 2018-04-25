import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizadorElementoComponent } from './organizador-elemento.component';

describe('OrganizadorElementoComponent', () => {
  let component: OrganizadorElementoComponent;
  let fixture: ComponentFixture<OrganizadorElementoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizadorElementoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizadorElementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
