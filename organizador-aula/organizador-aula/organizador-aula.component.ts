import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, Output, EventEmitter } from '@angular/core';
import { OrganizadorElementoComponent } from './organizador-elemento/organizador-elemento.component';
import { Datos } from './clases/Datos';
import { Creador, CreadorDefault } from './clases/Creador';
import { Celda } from './modelos/celda';
import { ListaElemento } from './modelos/lista-elementos';
import { ListaEntidad } from './modelos/lista-entidad';
import { Entidad } from './modelos/entidad';
import {Mensaje} from './clases/Mensajes';
@Component({
  selector: 'app-organizador-aula',
  templateUrl: './organizador-aula.component.html',
  styleUrls: ['./organizador-aula.component.less']
})
export class OrganizadorAulaComponent implements OnInit {
  @Input('listaElementos') listaElementos: ListaElemento[];
  @Input('listaEntidades') listaEntidades: ListaEntidad[];
  @Input('filas') filas:number;
  @Input('columnas') columnas: number;
  @Input('templateBarra') templateBarra: TemplateRef<any>;
  @Input('templateTabla') templateTabla: TemplateRef<any>;

  @Output('clickEntidad') clickEntidad: EventEmitter<Object> = new EventEmitter<Object>();
  @Output('mensaje') mensaje: EventEmitter<Mensaje> = new EventEmitter<Mensaje>();

  @ViewChild('txtFilas') txtFilas: ElementRef;
  @ViewChild('txtColumnas') txtColumnas: ElementRef;
  ACT_ELEMENTOS = 0;
  ACT_ENTIDADES = 1;
  activo=0;
  @Input('creador') creador: Creador;
  datos: Datos;
  constructor() { }

  ngOnInit() {

    if(!this.creador){
      this.creador = new CreadorDefault(this.filas, this.columnas, this.listaElementos, this.listaEntidades);
    }
    this.datos = new Datos(this.creador);
    console.log(this.datos);
  }

  guardar(){
    let saved={
      listaEntidades: this.generarListaEntidades(),
      listaElementos: this.generarListaElementos(),
      filas: this.datos.filas,
      columnas: this.datos.columnas
    } 
    /* 
    this.creador.listaEntidades = this.generarListaEntidades();
    this.creador.listaElementos = this.generarListaElementos();
    let saved = JSON.stringify(this.creador);*/
    console.log(saved);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saved));

    //Hacer lo que se quiera con dataStr! En este caso lo descargo como archivo para pruebas
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "exportName" + ".json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  generarListaElementos():ListaElemento[]{
    let listaElementos: ListaElemento[] = [];
    this.datos.listaElementos.forEach(elem=>{
      listaElementos.push({
        id: elem.id,
        nombre: elem.nombre,
        color: elem.color,
        posiciones: []
      })
    })
    this.datos.listaFilas.forEach(fila=>{
      fila.celdas.filter(cel=>cel.initElemento()).forEach(celda=>{
        let elem = listaElementos.find(el => el.id===celda.elemento.id);
        if(elem){
          elem.posiciones.push({xy: [celda.elemento.x, celda.elemento.y], xy2: [celda.elemento.x2, celda.elemento.y2]});
        }
      })
    });
    return listaElementos;
  }
  generarListaEntidades(){
    let listaEntidades: ListaEntidad[];
    listaEntidades=this.datos.listaEntidades;
    /*
    listaEntidades.posiciones=[];
    this.datos.listaFilas.forEach(fila=>{
      fila.celdas.filter(cel=>cel.initElemento()).forEach(celda=>{
        celda.elemento.entidades.forEach(entidad=>{          
          listaEntidades.posiciones.push({id: entidad.id, pos: [celda.x, celda.y]});
        });
      })
    })*/
    return listaEntidades;
  }

  cambiar(){
    console.log(this.txtFilas.nativeElement.value, this.txtColumnas.nativeElement.value);
    this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
    this.creador.numColumnas = parseInt(this.txtColumnas.nativeElement.value);
    //this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
  }

  onClickEntidad(event: Object){
    this.clickEntidad.emit(event);
  }

  onMensaje(event:Mensaje){
    this.mensaje.emit(event);
  }

}



