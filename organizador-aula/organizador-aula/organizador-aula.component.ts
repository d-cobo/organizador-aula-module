import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, Output, EventEmitter } from '@angular/core';
import { OrganizadorElementoComponent } from './organizador-elemento/organizador-elemento.component';
import { Datos } from './utils/Datos';
import { Creador, CreadorDefault } from './utils/Creador';
import { Celda } from './modelos/celda';
import { ListaElemento } from './modelos/lista-elementos';
import { ListaEntidad } from './modelos/lista-entidad';
import { Entidad } from './modelos/entidad';
import {Mensaje, MsgTipo, MsgCodigo} from './utils/Mensajes';
import { ExportTablero, ExportElemento } from './utils/TableroExportInterfaces';
import { Elemento } from './modelos/elemento';
import { Subscription } from 'rxjs/Subscription';
import { ConfiguracionOrganizador } from './modelos/configuracion-organizador';
import { OrganizadorElementos } from './organizador-elemento/clases/OrganizadorElementos';
import { OrganizadorEntidades } from './organizador-entidades/clases/OrganizadorEntidades';
import { Organizador } from './utils/Organizador';
import { EventosOrgAulaService } from '../eventos-org-aula.service';
@Component({
  selector: 'app-organizador-aula',
  templateUrl: './organizador-aula.component.html',
  styleUrls: ['./organizador-aula.component.less']
})
export class OrganizadorAulaComponent implements OnInit {
  @Input('creador') creador: Creador;
  @Input('templateBarra') templateBarra: TemplateRef<any>;
  @Input('templateTabla') templateTabla: TemplateRef<any>;
  @Input('templateElemento') templateElemento: TemplateRef<any>;
  @Input('configuracion') configuracion: ConfiguracionOrganizador;

  @Output('onExport') onExport: EventEmitter<ExportTablero>;

  @ViewChild('txtFilas') txtFilas: ElementRef;
  @ViewChild('txtColumnas') txtColumnas: ElementRef;

  readonly ACT_ELEMENTOS: number = 0;
  readonly ACT_ENTIDADES: number = 1;
  readonly ACT_VISUALIZAR: number = 2;
  activo: number;  
  datos: Datos;
  argsCreador: [number, number, ListaElemento[], ListaEntidad[], [number, number]];

  constructor(private eventos: EventosOrgAulaService) {
    this.onExport  = new EventEmitter<ExportTablero>();
  
   }

  ngOnInit() {
    if(!((this.configuracion && this.configuracion.filas > 0 && this.configuracion.columnas > 0) || this.creador)){
      this.eventos.mensajes.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.ConfigOrCreadorNecesario});
      return;
    }
    if(this.configuracion && this.configuracion.permisoElementos) this.activo = this.ACT_ELEMENTOS;
    else if(this.configuracion && this.configuracion.permisoEntidades) this.activo = this.ACT_ENTIDADES;
    else this.activo=this.ACT_VISUALIZAR;
    
    if(!this.creador){
      this.creador = new CreadorDefault(this.configuracion.filas, this.configuracion.columnas, this.configuracion.listaElementos, this.configuracion.listaEntidades, this.configuracion.minSize);
    }    
    //Guardar estado inicial
    this.argsCreador=[this.creador.numFilas, this.creador.numColumnas, this.creador.listaElementos.concat(), this.creador.listaEntidades.concat(), this.creador.getMinSize];
    
    this.datos = new Datos(this.creador, (this.configuracion && this.configuracion.entidadSinElemento));    
    //Inicializar las pantallas
    let org: Organizador = new OrganizadorElementos();
    org.datos = this.datos;
    org.inicializar();
    org = new OrganizadorEntidades();
    org.datos = this.datos;
    org.inicializar();
    console.log(this.datos);
  }

  guardar(): void{
    /*let exportTablero: ExportTablero = {numFilas:this.datos.creador.numFilas, numColumnas: this.datos.creador.numColumnas,
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
    this.onExport.emit(exportTablero);*/    
    let lisElementos: ListaElemento[] = [];
    let lisEntidades: ListaEntidad[] = [];
    this.datos.listaElementos.forEach(lisElem=>{
      lisElementos.push({
        nombre: lisElem.nombre,
        id: lisElem.id,
        color: lisElem.color,
        maxEntidades: lisElem.maxEntidades,        
        alto: lisElem.alto,
        ancho: lisElem.ancho,        
      })
    });
    this.datos.listaFilas.forEach(fila=>
      fila.celdas.filter(celda=>celda.initElemento()).forEach(celda=>{
          let elem: Elemento = celda.elemento;
          let listaElemento: ListaElemento = lisElementos.find(lis=>lis.id==elem.id);
          if(listaElemento){
            if(!listaElemento.posiciones){            
              listaElemento.posiciones = [];
            }
            listaElemento.posiciones.push({xy: [elem.x, elem.y], xy2: [elem.x2, elem.y2]});
          }
      
      })
    )
    this.datos.entidades.forEach(ent=>{
      let pos: [number, number] = null;
      if(ent.elemento)
        pos=[ent.elemento.x, ent.elemento.y]
      ent.objeto.posicion=pos;
      lisEntidades.push(ent.objeto);
    })    
    this.argsCreador = [this.datos.filas, this.datos.columnas, lisElementos.concat(), lisEntidades.concat(), this.creador.getMinSize];
    this.onExport.emit({numFilas: this.datos.filas, numColumnas: this.datos.columnas, listaElementos: lisElementos, listaEntidades: lisEntidades});
  }
  
  cambiar(): void{
    console.log(this.txtFilas.nativeElement.value, this.txtColumnas.nativeElement.value);
    this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
    this.creador.numColumnas = parseInt(this.txtColumnas.nativeElement.value);
    //this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
  }

  cancelar(): void{
    
    //Resetear al estado inicial
    this.creador = Object.create(this.creador.constructor.prototype);    
    this.creador.constructor.apply(this.creador, this.argsCreador);    
    this.datos = new Datos(this.creador, (this.configuracion && this.configuracion.entidadSinElemento));
    this.eventos.mensajes.emit({tipo: MsgTipo.OK, codigo: MsgCodigo.Cancelar})
    let org: Organizador = new OrganizadorElementos();
    org.datos = this.datos;
    org.inicializar();
    org = new OrganizadorEntidades();
    org.datos = this.datos;
    org.inicializar();
    console.log(this.datos);
    /*let tab = this.activo;
    this.activo=-1;
    setTimeout(()=>{
    this.activo=tab;
    },0);*/
    
  }

  


}



