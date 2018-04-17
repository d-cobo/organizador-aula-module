import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { OrganizadorAulaComponent } from './organizador-aula/organizador-aula/organizador-aula.component';
import { Creador, CreadorDefault } from './organizador-aula/organizador-aula/utils/Creador';
import {  CreadorPropio, AlumnoEnt } from './app.module';
import { ListaEntidad } from './organizador-aula/organizador-aula/modelos/lista-entidad';
import { MsgTipo, Mensaje, MsgCodigo } from './organizador-aula/organizador-aula/utils/Mensajes';
import { EventosOrgAulaService } from './organizador-aula/eventos-org-aula.service';
import { Subscription } from 'rxjs/Subscription';
import { ListaElemento } from './organizador-aula/organizador-aula/modelos/lista-elementos';
import { ExportTablero } from './organizador-aula/organizador-aula/utils/TableroExportInterfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('txt') txt: ElementRef;
  title = 'app';
  columnas: number;
  filas: number;
  listaElementos: ListaElemento[];
  listaEntidades: ListaEntidad [];
  cargado: boolean = true;
  mensajeSubscription: Subscription;
  entidadSubscription: Subscription;
  //listaElementos: Array<ListaElemento>;
  creador: Creador;

  constructor(private eventos: EventosOrgAulaService){}

  ngOnInit(){
    this.filas = 7;
    this.columnas = 7;
    this.mensajeSubscription = this.eventos.mensajes.subscribe(mens=>this.onMensaje(mens));
    this.entidadSubscription = this.eventos.clickEntidad.subscribe(ent=>this.mostrarAlumno(ent));
    this.listaElementos = [
      {
        nombre: 'nombremesa',
        id: 'idmesa',
        maxEntidades: 3,
        color: '#cf7f07',
        posiciones: [
          {
            xy: [1,1],
            xy2: [2, 2]
          },
          {
            xy: [0,6]
          },
          {
            xy: [3,4]
          }
        ]
      },
      {
        nombre: 'otro',
        id: 'idotro',
        color: 'gray',
        posiciones: [
          {
            xy: [3,5],
            xy2: [5, 5]
          },
          {
            xy: [4,4]
          }
        ]
      },
      {
        nombre: 'proyector',
        id: 'idproyector',
        color: 'green',
        posiciones: [
          {
            xy: [0,3]
          }
        ]
      }      
    ];

    let alumnos: AlumnoEnt[] = [];
    alumnos.push(new AlumnoEnt());    
    alumnos[0].id='12345678A';
    alumnos[0].nombre='pepe';
    alumnos[0].otro='Come mucho';
    alumnos.push(new AlumnoEnt());
    alumnos[1].id='87654321A';
    alumnos[1].nombre='pepita';  
    alumnos[1].otro='Se pelea con pepete';  
    alumnos.push(new AlumnoEnt());
    alumnos[2].id='82654321A';
    alumnos[2].nombre='pepete';    
    alumnos[2].otro='No hace la tarea';
    alumnos.push(new AlumnoEnt());
    alumnos[3].id='72654321A';
    alumnos[3].nombre='carla';    
    alumnos[3].otro='asdfasd';
    alumnos.push(new AlumnoEnt());
    alumnos[4].id='62654321A';
    alumnos[4].nombre='josean';    
    alumnos[4].otro='zzzasd';
    this.listaEntidades= alumnos;      
    //  let a = JSON.parse('{"sizeCelda":[202,114],"prNumFilas":7,"prNumColumnas":7,"prListaElementos":[{"id":"idproyector","nombre":"proyector","color":"green","posiciones":[{"xy":[0,3],"xy2":[0,3]}]},{"id":"idmesa","nombre":"nombremesa","color":"#cf7f07","posiciones":[{"xy":[0,6],"xy2":[0,6]},{"xy":[1,1],"xy2":[2,2]},{"xy":[3,4],"xy2":[3,4]}]},{"id":"idotro","nombre":"otro","color":"gray","posiciones":[{"xy":[3,5],"xy2":[5,5]},{"xy":[4,4],"xy2":[4,4]}]}],"prListaEntidades":{"id":"id","titulo":"nombre","objetos":[{"id":"12345678A","nombre":"pepe","otro":"Come mucho"},{"id":"87654321A","nombre":"pepita","otro":"Se pelea con pepete"},{"id":"82654321A","nombre":"pepete","otro":"No hace la tarea"}],"posiciones":[{"id":"12345678A","pos":[1,1]}]}}')
    //  console.log(a);
    //this.creador = new CreadorPropio(this.filas, this.columnas, this.listaElementos, this.listaEntidades);
    //this.creador = new CreadorPropio(a.prNumFilas, a.prNumColumnas, a.prListaElementos, a.prlistaEntidades);
    
    
/*
    let c = 'id';
    let v = '87654321A';
    console.log(alumnos.find(al => al[c$1==$2));*/
  }

  ngOnDestroy(){
    this.mensajeSubscription.unsubscribe();
  }


  mostrarAlumno(event: AlumnoEnt){
    console.log("funsioooona!", event);
  }

  onMensaje(event: Mensaje){
    if(event.tipo == MsgTipo.AVISO) {
      console.log("WARNING");
      switch(event.codigo){
        case MsgCodigo.ConfirmacionEliminarTipoElemento:
          console.log("¿Seguro que quieres eliminar? ");
          if(confirm("Eliminar?")){
            this.eventos.confirmacion.emit(true);
          }else{
            this.eventos.confirmacion.emit(false);
          }
          break;
      }
    }
    if(event.tipo == MsgTipo.ERROR){
      console.log("ERROR");
      switch(event.codigo){
        case MsgCodigo.CeldaOcupada:
          console.log("Celda ocupada!");
          break;
      }
    }

     

    
  }

  onExport(tablero: ExportTablero){
    console.log(tablero);
  }

  onConfirmacion(event: EventEmitter<boolean>){
    event.emit(false);
  }
}

