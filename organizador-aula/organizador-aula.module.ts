import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizadorElementoComponent } from './organizador-aula/organizador-elemento/organizador-elemento.component';
import {DragDropModule} from 'primeng/dragdrop';
import { ResizableModule } from 'angular-resizable-element';
import { OrganizadorAulaComponent } from './organizador-aula/organizador-aula.component';
import { OrganizadorEntidadesComponent } from './organizador-aula/organizador-entidades/organizador-entidades.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfirmationService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {GrowlModule} from 'primeng/growl';
import { NuevoElementoComponent } from './organizador-aula/organizador-elemento/nuevo-elemento/nuevo-elemento.component';


@NgModule({
  imports: [
    DragDropModule,
    ResizableModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GrowlModule,
    ButtonModule
  ],
  exports: [
    OrganizadorAulaComponent
  ],
  providers: [ConfirmationService],
  declarations: [OrganizadorElementoComponent, OrganizadorAulaComponent, OrganizadorEntidadesComponent, NuevoElementoComponent]
})
export class OrganizadorAulaModule { }


