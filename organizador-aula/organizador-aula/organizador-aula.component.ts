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
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-organizador-aula',
  templateUrl: './organizador-aula.component.html',
  styleUrls: ['./organizador-aula.component.less']
})
export class OrganizadorAulaComponent implements OnInit {
  @Input('creador') creador: Creador;
  @Input('listaElementos') listaElementos: ListaElemento[];
  @Input('listaEntidades') listaEntidades: ListaEntidad[];
  @Input('filas') filas:number;
  @Input('columnas') columnas: number;
  @Input('templateBarra') templateBarra: TemplateRef<any>;
  @Input('templateTabla') templateTabla: TemplateRef<any>;
  @Input('minSize') minSize: [number, number];


  @Output('onExport') onExport: EventEmitter<ExportTablero>;

  @ViewChild('txtFilas') txtFilas: ElementRef;
  @ViewChild('txtColumnas') txtColumnas: ElementRef;

  readonly ACT_ELEMENTOS: number = 0;
  readonly ACT_ENTIDADES: number = 1;
  activo: number;  
  datos: Datos;
  constructor() {
    this.onExport  = new EventEmitter<ExportTablero>();
  
   }

  ngOnInit() {
    this.activo = this.ACT_ELEMENTOS;
    if(!this.creador){
      this.creador = new CreadorDefault(this.filas, this.columnas, this.listaElementos, this.listaEntidades, this.minSize);
    }
    this.datos = new Datos(this.creador);
    console.log(this.datos);
  }

  guardar(): void{
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

  cambiar(): void{
    console.log(this.txtFilas.nativeElement.value, this.txtColumnas.nativeElement.value);
    this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
    this.creador.numColumnas = parseInt(this.txtColumnas.nativeElement.value);
    //this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
  }



}



