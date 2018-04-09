import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrganizadorAulaModule } from './organizador-aula/organizador-aula.module';
import { Creador } from './organizador-aula/organizador-aula/clases/Creador';
import { Fila } from './organizador-aula/organizador-aula/modelos/fila';
import { Celda } from './organizador-aula/organizador-aula/modelos/celda';
import { ListaElemento } from './organizador-aula/organizador-aula/modelos/lista-elementos';
import { ListaEntidad } from './organizador-aula/organizador-aula/modelos/lista-entidad';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    OrganizadorAulaModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

//solo para probar
class Alumno{
  id;
  nombre;
  otro;
}

export class AlumnoEnt extends Alumno implements ListaEntidad {
  equals(entidad: Object) {
    return entidad["id"]===this.id;
  }
  atributo_titulo: string;
  posicion?: [number, number];
  constructor(){
    super();
    //this.atributo_id="id";
    this.atributo_titulo="nombre";
  }
}

export class CreadorPropio extends Creador {
  onFilasChange(): void {
    console.log("asdasd");
    this.inicializarFilas();
  }
  onColumnasChange(): void {
    this.inicializarFilas();
  }
  setSize(ancho: number, alto: number): void {
    this.sizeCelda[0]=ancho;
    this.sizeCelda[1]=alto;
  }


  constructor(numFilas:number, numColumnas:number, listaElementos: ListaElemento[] = null, listaEntidades: ListaEntidad[] = null){
    super(numFilas, numColumnas, listaElementos, listaEntidades);
  }

  inicializarFilas(): void {
    this.listaFilas=[];
    for(let f=0; f<this.numFilas; f++){
      this.listaFilas.push(new Fila(f));
      if(f==7){
        this.listaFilas[f].celdas.push(new Celda(f,0,this.sizeCelda[0]*7 + 7*0.5, this.sizeCelda[1]));
      }else{
        for(let c=0; c<this.numColumnas; c++){
          this.listaFilas[f].celdas.push(new Celda(f,c,this.sizeCelda[0], this.sizeCelda[1]));
        }
      }
    }
  }
}
