import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrganizadorAulaModule } from './organizador-aula/organizador-aula.module';
import { Creador } from './organizador-aula/organizador-aula/utils/Creador';
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
  constructor(id: string, nombre: string, otro:string){
    super();
    //this.atributo_id="id";
    this.atributo_titulo="nombre";
    this.id=id;
    this.nombre=nombre;
    this.otro=otro;
  }
}

export class CreadorPropio extends Creador {
  setTotalSize(anchoTotal: number, altoTotal: number): void {
    this.sizePantalla= [anchoTotal, altoTotal];
  }
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


  constructor(numFilas:number, numColumnas:number, listaElementos: ListaElemento[] = null, listaEntidades: ListaEntidad[] = null, minSize: [number, number]){
    super(numFilas, numColumnas, listaElementos, listaEntidades, minSize);
  }

  inicializarFilas(): void {
    this.listaFilas=[];
    for(let f=0; f<this.numFilas; f++){
      this.listaFilas.push(new Fila(f));           
        for(let c=0; c<this.numColumnas; c++){
          let celda = new Celda(f,c);
          celda.ancho=100;
          celda.alto=100;
          this.listaFilas[f].celdas.push(celda);
          
        }
      }
    }
  }

