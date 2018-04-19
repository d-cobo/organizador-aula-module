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
import { ConfiguracionOrganizador, Botones } from './organizador-aula/organizador-aula/utils/configuracion-organizador';


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
  config: ConfiguracionOrganizador;
  //listaElementos: Array<ListaElemento>;
  creador: Creador;

readonly btnElementos = Botones.Elementos;
readonly btnEntidades = Botones.Entidades;
readonly btnVisualizar = Botones.Visualizar;
readonly btnGuardar = Botones.Guardar;
readonly btnCancelar = Botones.Cancelar;

  constructor(private eventos: EventosOrgAulaService){}

  ngOnInit(){    
    this.filas = 7;
    this.columnas = 7;
    this.mensajeSubscription = this.eventos.mensajes.subscribe(mens=>this.onMensaje(mens));
    this.entidadSubscription = this.eventos.clickEntidad.subscribe(ent=>this.mostrarAlumno(ent));
    this.listaElementos = [
      {
        nombre: 'Mesa',
        id: 'idmesa',
        maxEntidades: 2,
        color: '#cf7f07',
        posiciones: [          
          { xy: [2,0] },
          { xy: [2,2] },
          { xy: [2,4] },
          { xy: [2,6] },
          { xy: [4,0] },
          { xy: [4,2] },
          { xy: [4,4] },
          { xy: [4,6] },
          { xy: [6,0] },
          { xy: [6,2] },
          { xy: [6,4] },
          { xy: [6,6] }          
        ]
      },
      {
        nombre: 'Mesa profesor',
        id: 'idmesaprof',
        color: 'gray',
        posiciones: [
          {
            xy: [0,0],
            xy2: [0, 2]
          }          
        ]
      },
      {
        nombre: 'Pizarra',
        id: 'idpizarra',
        color: 'green',
        ancho: 4,
        posiciones: [
          {
            xy: [0,3]
          }
        ]
      }      
    ];

    let alumnos: AlumnoEnt[] = [];
    alumnos.push(new AlumnoEnt('12345678A', 'Pepe', 'Come mucho'));       
    alumnos.push(new AlumnoEnt('12345678A', 'Pepita', 'Se pelea con pepete'));        
    alumnos.push(new AlumnoEnt('82654321A', 'Pepete', 'otro 3'));
    alumnos.push(new AlumnoEnt('72654321A', 'Carla', 'otro 4'));   
    alumnos.push(new AlumnoEnt('62654321A', 'Josean', 'otro 5'));      
    alumnos.push(new AlumnoEnt('22654521A', 'Lucia', 'otro 6')); 
    alumnos.push(new AlumnoEnt('52654323A', 'Alvaro', 'otro 7'));
    alumnos.push(new AlumnoEnt('35654323A', 'Manolo', 'otro 8')); 
    alumnos.push(new AlumnoEnt('54654323A', 'Lola', 'otro 9'));   
    alumnos.push(new AlumnoEnt('11654323A', 'Sara', 'otro 10'));  
    alumnos.push(new AlumnoEnt('19654323A', 'Josetxo', 'otro 11'));    
    alumnos.push(new AlumnoEnt('75654323A', 'Rubén', 'otro 12'));   
    alumnos[0].posicion = [2,0];    
    alumnos[1].posicion = [2,2];    
    alumnos[2].posicion = [2,4];     
    alumnos[3].posicion = [2,6];     
    alumnos[4].posicion = [4,0];       
    alumnos[5].posicion = [4,2];               
    alumnos[6].posicion = [4,4];           
    alumnos[7].posicion = [4,6];         
    alumnos[8].posicion = [6,0];           
    alumnos[9].posicion = [6,2];        
    alumnos[10].posicion = [6,4];         
    alumnos[11].posicion = [6,6];
    this.listaEntidades= alumnos; 
    this.creador = new CreadorPropio(this.filas, this.columnas, this.listaElementos, this.listaEntidades, [100, 100]);     
    this.config = {
      filas: this.filas,
      columnas: this.filas,
      minSize: [0, 0],
      permisoElementos: true,
      permisoEntidades: true,
      permisoGuardar: true,
      entidadSinElemento: true,
      mostrarBarraSuperior: false
    }
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
        case MsgCodigo.ConfigOrCreadorNecesario:
          console.log("Creador o configuracion necesario");
      }
    }

     

    
  }

  onExport(tablero: ExportTablero){
    console.log(tablero);
  }

  onConfirmacion(event: EventEmitter<boolean>){
    event.emit(false);
  }

  clickBoton(num: number){    
    this.eventos.clickBoton.emit(num);
  }

  cambioTam(){
    this.eventos.cambioTamano.emit([this.filas, this.columnas]);
  }

}

