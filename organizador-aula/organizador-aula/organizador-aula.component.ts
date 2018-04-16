import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, Output, EventEmitter } from '@angular/core';
import { OrganizadorElementoComponent } from './organizador-elemento/organizador-elemento.component';
import { Datos } from './utils/Datos';
import { Creador, CreadorDefault } from './utils/Creador';
import { Celda } from './modelos/celda';
import { ListaElemento } from './modelos/lista-elementos';
import { ListaEntidad } from './modelos/lista-entidad';
import { Entidad } from './modelos/entidad';
import {Mensaje} from './utils/Mensajes';
import { ExportTablero, ExportElemento } from './utils/TableroExportInterfaces';
import { Elemento } from './modelos/elemento';
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
  @Output('onExport') onExport: EventEmitter<ExportTablero> = new EventEmitter<ExportTablero>();

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
    let exportTablero: ExportTablero = {numFilas:this.datos.creador.numFilas, numColumnas: this.datos.creador.numColumnas,
       elementos: [], entidades: []};    
    this.datos.listaFilas.forEach(f=>
      f.celdas.filter(celda=>celda.initElemento()).forEach(celda=>{
        let elem: Elemento = celda.elemento;
        let exportElemento: ExportElemento = {x: elem.x, y: elem.y, x2: elem.x2, y2: elem.y2,
          nombre: elem.nombre, id: elem.id, color: elem.color, maxEntidades: elem.maxEntidades}
        elem.entidades.forEach(entidad=>{
          exportTablero.entidades.push({elemento: exportElemento, objeto: entidad.objeto});
        })
        exportTablero.elementos.push(exportElemento);
      })
    );
    this.datos.entidades.filter(ent => ent.elemento == null).forEach(entidad=>{
      exportTablero.entidades.push({elemento: null, objeto: entidad.objeto});
    });    
    this.onExport.emit(exportTablero);
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



