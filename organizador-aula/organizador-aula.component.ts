import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OrganizadorElementoComponent } from './organizador-elemento/organizador-elemento.component';
import { Datos } from '../utils/datos.util';
import { Creador } from '../utils/creador.util';
import { Celda } from '../modelos/celda.modelo';
import { ListaElemento } from '../modelos/lista-elemento.modelo';
import { ListaEntidad } from '../modelos/lista-entidad.modelo';
import { Entidad } from '../modelos/entidad.modelo';
import {Mensaje, MsgTipo, MsgCodigo} from '../modelos/mensajes.modelo';
import { ExportTablero } from '../modelos/tablero-export-interfaces.modelo';
import { Elemento } from '../modelos/elemento.modelo';
import { Subscription } from 'rxjs/Subscription';

import { Organizador } from '../utils/organizador.util';
import { EventosOrgAulaService } from '../eventos-org-aula.service';
import { ConfiguracionOrganizador } from '../modelos/conf.modelo';
import { ArgsCreador } from '../modelos/args-creador-interface.modelo';
import { OrganizadorElementos } from '../utils/OrganizadorElementos';
import { OrganizadorEntidades } from '../utils/OrganizadorEntidades';
import { Botones } from '../modelos/botones.modelo';
import { CreadorDefault } from '../utils/creador-default.util';
@Component({
  selector: 'app-organizador-aula',
  templateUrl: './organizador-aula.component.html',
  styleUrls: ['./organizador-aula.component.less']
})
export class OrganizadorAulaComponent implements OnInit, OnDestroy {
  @Input('creador') creador: Creador; //opcional; instancia de una implementacion de Creador
  @Input('templateBarra') templateBarra: TemplateRef<any>; //opt; template de entidades en la barra
  @Input('templateTabla') templateTabla: TemplateRef<any>; //opt; template de entidades en la tabla
  @Input('templateElemento') templateElemento: TemplateRef<any>; //opt; template de elementos
  @Input('configuracion') configuracion: ConfiguracionOrganizador; //oblig; opciones de configuración
  @Input('listaElementos') listaElementos: ListaElemento[]; //opt; lista de elementos iniciales
  @Input('listaEntidades') listaEntidades: ListaEntidad[]; //opt; lista de entidades iniciales

  @Output('onExport') onExport: EventEmitter<ExportTablero>; //devuelve los datos del tablero

  @ViewChild('txtFilas') txtFilas: ElementRef;
  @ViewChild('txtColumnas') txtColumnas: ElementRef;

  //Los diferentes estados/pantallas
  readonly ACT_ELEMENTOS: Botones = Botones.Elementos;
  readonly ACT_ENTIDADES: Botones = Botones.Entidades;
  readonly ACT_VISUALIZAR: Botones = Botones.Visualizar;


  subscriptionClickBoton: Subscription;
  subscriptionCambioTamano: Subscription;
  activo: Botones;  //la pantalla activa actual
  datos: Datos; //datos con el estado del tablero para compartir entre los componentes
  argsCreador: ArgsCreador; //argumentos para construir un creador

  constructor(private eventos: EventosOrgAulaService) {
    this.onExport  = new EventEmitter<ExportTablero>();
  
   }

  ngOnInit() {
    //Si no estan los parametros obligatorios
    if(!((this.configuracion && this.configuracion.filas > 0 && this.configuracion.columnas > 0) || this.creador)){
      this.eventos.mensajes.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.ConfigOrCreadorNecesario});
      return;
    }
    
    //Activa la primera pantalla disponible
    if(this.configuracion && this.configuracion.permisoElementos) this.activo = this.ACT_ELEMENTOS;
    else if(this.configuracion && this.configuracion.permisoEntidades) this.activo = this.ACT_ENTIDADES;
    else this.activo=this.ACT_VISUALIZAR;
        
    if(!this.creador){
      this.creador = new CreadorDefault(this.configuracion.filas, this.configuracion.columnas, this.listaElementos, this.listaEntidades, this.configuracion.minSize);
    }    

    //Guardar estado inicial
    this.argsCreador={
      numFilas: this.creador.numFilas,
      numColumnas: this.creador.numColumnas, 
      listaElementos: this.creador.listaElementos.concat(),
      listaEntidades: this.creador.listaEntidades.concat(),
      minSize: this.creador.getMinSize
    };
    
    this.datos = new Datos(this.creador, (this.configuracion && this.configuracion.entidadSinElemento));    
    //Inicializar las pantallas
    let org: Organizador = new OrganizadorElementos();
    org.datos = this.datos;
    org.inicializar();
    org = new OrganizadorEntidades();
    org.datos = this.datos;
    org.inicializar();
    console.log(this.datos);

    //suscripcion a pulsación de los botones o a cambio de tamaño desde el exterior
    this.subscriptionClickBoton = this.eventos.clickBoton.subscribe(num=>this.onClickBoton(num));
    this.subscriptionCambioTamano = this.eventos.cambioTamano.subscribe(tam=>this.onCambioTamano(tam));
  }

  ngOnDestroy(){
    this.subscriptionClickBoton.unsubscribe();
    this.subscriptionCambioTamano.unsubscribe();
  }

  //guarda el estado de la tabla y la exporta fuera del módulo
  guardar(): void{
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
          let listaElemento: ListaElemento = lisElementos.find(lis=>lis.id===elem.id);
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
    this.argsCreador={
      numFilas: this.datos.filas,
      numColumnas: this.datos.columnas, 
      listaElementos: lisElementos.concat(),
      listaEntidades: lisEntidades.concat(),
      minSize: this.creador.getMinSize
    };    
    this.onExport.emit({numFilas: this.datos.filas, numColumnas: this.datos.columnas, listaElementos: lisElementos, listaEntidades: lisEntidades});
  }
  
  //cambiar tamaño
  cambiar(): void{
    console.log(this.txtFilas.nativeElement.value, this.txtColumnas.nativeElement.value);
    this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
    this.creador.numColumnas = parseInt(this.txtColumnas.nativeElement.value);
    //this.creador.numFilas = parseInt(this.txtFilas.nativeElement.value);
  }

  //Pone el último estado de la tabla guardado (o el inicial en su defecto)
  cancelar(): void{
    
    //Resetear al estado inicial del creador con los datos guardados
    this.creador = this.creador.nuevaInstancia(
      this.argsCreador.numFilas,
      this.argsCreador.numColumnas,
      this.argsCreador.listaElementos,
      this.argsCreador.listaEntidades,
      this.argsCreador.minSize
    )

    //actualizar los datos
    this.datos = new Datos(this.creador, (this.configuracion && this.configuracion.entidadSinElemento));
    this.eventos.mensajes.emit({tipo: MsgTipo.OK, codigo: MsgCodigo.Cancelar})
    let org: Organizador = new OrganizadorElementos();
    org.datos = this.datos;
    org.inicializar();
    org = new OrganizadorEntidades();
    org.datos = this.datos;
    org.inicializar();
    console.log(this.datos);
    
  }

  //si llega un evento de clickBoton del exterior, realiza la acción correspondiente
  onClickBoton(num: Botones){
    console.log(num);
    switch(num){
      case Botones.Elementos:
        if(num===Botones.Elementos && this.configuracion && !this.configuracion.permisoElementos){ 
          this.eventos.mensajes.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.ErrorPermisos});
          return;
        }
      case Botones.Entidades:
        if(num===Botones.Entidades && this.configuracion && !this.configuracion.permisoEntidades){ 
          this.eventos.mensajes.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.ErrorPermisos});
          return;
        }
      case Botones.Visualizar:        
        this.activo = num;
        break;

      case Botones.Cancelar:
        if(this.configuracion && !this.configuracion.permisoGuardar){ 
          this.eventos.mensajes.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.ErrorPermisos});
          return;
        }
        this.cancelar();
        break;
      case Botones.Guardar:
        if(this.configuracion && !this.configuracion.permisoGuardar){ 
          this.eventos.mensajes.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.ErrorPermisos});
          return;
        }
        this.guardar();
        break;      
    }
  }
  
  onCambioTamano(size: [number, number]){
    this.creador.numFilas = size[0];
    this.creador.numColumnas = size[1];
  }



  


}



