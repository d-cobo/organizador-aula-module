import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizadorVisualizacionComponent } from './organizador-visualizacion.component';

describe('OrganizadorVisualizacionComponent', () => {
  let component: OrganizadorVisualizacionComponent;
  let fixture: ComponentFixture<OrganizadorVisualizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizadorVisualizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizadorVisualizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
