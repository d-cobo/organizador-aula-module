import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrganizadorAulaModule } from './organizador-aula/organizador-aula.module';
import { Creador } from './organizador-aula/utils/creador.util';
import { Fila } from './organizador-aula/modelos/fila.modelo';
import { Celda } from './organizador-aula/modelos/celda.modelo';
import { ListaElemento } from './organizador-aula/modelos/lista-elemento.modelo';
import { ListaEntidad } from './organizador-aula/modelos/lista-entidad.modelo';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    OrganizadorAulaModule,
    BrowserModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


