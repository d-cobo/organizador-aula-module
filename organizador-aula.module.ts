import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizadorElementoComponent } from './organizador-aula/organizador-elemento/organizador-elemento.component';
import {DragDropModule} from 'primeng/dragdrop';
import { OrganizadorAulaComponent } from './organizador-aula/organizador-aula.component';
import { OrganizadorEntidadesComponent } from './organizador-aula/organizador-entidades/organizador-entidades.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
//import {BrowserModule} from '@angular/platform-browser';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfirmationService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import { NuevoElementoComponent } from './organizador-aula/organizador-elemento/nuevo-elemento/nuevo-elemento.component';
import { EventosOrgAulaService } from './eventos-org-aula.service';
import { OrganizadorVisualizacionComponent } from './organizador-aula/organizador-visualizacion/organizador-visualizacion.component';


@NgModule({
  imports: [
    DragDropModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
//    BrowserModule,
 //   BrowserAnimationsModule,
    FormsModule,
    ButtonModule
  ],
  exports: [
    OrganizadorAulaComponent
  ],
  providers: [ConfirmationService, EventosOrgAulaService],
  declarations: [OrganizadorElementoComponent, OrganizadorAulaComponent, OrganizadorEntidadesComponent, NuevoElementoComponent, OrganizadorVisualizacionComponent]
})
export class OrganizadorAulaModule { }


