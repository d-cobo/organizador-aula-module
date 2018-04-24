import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild, ViewChildren, QueryList, HostListener, EventEmitter, Output, ApplicationRef, TemplateRef, SimpleChanges, OnDestroy } from '@angular/core';
import { ResizeEvent, ResizableDirective } from 'angular-resizable-element';
import { ListaElemento, Position } from '../../modelos/lista-elemento.modelo';
import { Fila } from '../../modelos/fila.modelo';
import { Celda } from '../../modelos/celda.modelo';
import { Elemento } from '../../modelos/elemento.modelo';
import { OrganizadorElementos } from './clases/OrganizadorElementos';
import { Datos } from '../../utils/datos.util';
import { ConfirmationService, Message } from 'primeng/api';
import { OrganizadorEntidades } from '../organizador-entidades/clases/OrganizadorEntidades';
import { MsgTipo, MsgCodigo, Mensaje } from '../../modelos/mensajes.modelo';
import { NuevoElementoComponent } from './nuevo-elemento/nuevo-elemento.component';
import { Subscription } from 'rxjs/Subscription';
import { StartingPoint, ResizingElement, Directions } from './clases/interfaces';
import { EventosOrgAulaService } from '../../eventos-org-aula.service';


@Component({
  selector: 'app-organizador-elemento',
  templateUrl: './organizador-elemento.component.html',
  styleUrls: ['./organizador-elemento.component.less']
})

export class OrganizadorElementoComponent implements OnInit, OnDestroy {
  
  
  prDatos: Datos;
  
  //clase datos para tener/compartir los elementos y demás entre los componentes
  @Input('datos')
  set datos(datos:Datos){
    this.prDatos=datos;
    if(this.organizador){
      this.organizador.datos = datos;
      this.organizador.cambiarSize(this.tabla, this.mainDiv);
    }
  }

  get datos(): Datos{
    return this.prDatos;
  }

  @Input('templateElemento') templateElemento: TemplateRef<any>;
  
  @ViewChild('mainDiv') mainDiv: ElementRef;
  @ViewChild('tabla') tabla: ElementRef;

  
  organizador: OrganizadorElementos; //El organizador que tiene todas las funciones y demas
  draggedCelda: Celda;  //Celda arrastrada al hacer drag&drop
  dragEvent: DragEvent; //Evento del drag para tener posiciones
  clickedCelda: Celda;  // Celda clicada cuando vas a mover un elemento para saber como ponerlo cuando caiga  
  resizingElement: ResizingElement; //Elemento que se está resizeando
  startingPoint: StartingPoint; //Punto inicial del resize
  displayNuevoElemento: boolean;  //Mostrar la ventana de crear nuevo elemento?
  confirmSubscription: Subscription; //Suscripcion al evento de confirmacion
  //mensajeSubscription: Subscription; //Sub al evento de mensajes
  //Direccion del resize
  resizeDir: Directions;

  //Direcciones
  readonly ARRIBA: Directions = Directions.ARRIBA;
  readonly ABAJO: Directions = Directions.ABAJO;
  readonly IZQUIERDA: Directions = Directions.IZQUIERDA;
  readonly DERECHA: Directions = Directions.DERECHA;
  
  

  constructor(private eventos: EventosOrgAulaService) {}

  //Crea el organizador y ajusta el tamaño
  ngOnInit() {    
    this.organizador = new OrganizadorElementos();
    this.organizador.datos = this.datos;
    this.displayNuevoElemento=false;    
    this.organizador.cambiarSize(this.tabla, this.mainDiv);   
  }
  
  //cambia el tamaño de la tabla si cambia el de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(): void{        
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
  }

  //destruye las subscripciones
  ngOnDestroy(){
    //this.mensajeSubscription.unsubscribe();
    if(this.confirmSubscription) this.confirmSubscription.unsubscribe();
  }  


  get style(): Object{
    let size: [number, number] = this.organizador.sizeCelda;
    return {width: `${size[0]}px`, height: `${size[1]}px`};
  }


  //Funcion para el drop
  drop(cel: Celda, event: MouseEvent): void{     
    //Si el drop viene durante un resize se sale
    if(this.resizingElement && this.resizingElement.elem){        
      return;
    }

    //Si no calcula en que celda se ha caido y llama a la función de drop del org    
    if(cel.elemento)      
      cel = this.organizador.getClickedCelda(cel, event.layerX, event.layerY);
    let status: number = this.organizador.drop(cel, this.draggedCelda, this.clickedCelda);
    if(status===MsgTipo.ERROR){
      this.eventos.mensajes.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.CeldaOcupada});      
    }
    this.clickedCelda=null;
  }

  //Actualiza el elemento que se esta arrastrando
  celdaDragStart(celda: Celda, event: MouseEvent): void{         
    this.clickedCelda = this.organizador.getClickedCelda(celda, event.layerX, event.layerY);
    this.draggedCelda=celda;
  }

  //Coge un elemento de la toolbar
  toolsDragStart(listElem: ListaElemento): void{
    let celda: Celda=new Celda(-1,-1)
    let elem=new Elemento(false, listElem.id, listElem.nombre, listElem.color, listElem.maxEntidades);
    elem.setPos(0,0, (listElem.alto-1) ,(listElem.ancho-1));
    console.log(elem);
    celda.elemento = elem;
    this.draggedCelda=celda;
  }


  //Eliminar a un elem
  removeElement(celda: Celda): void{
    this.organizador.removeElement(celda.elemento);
  }

  //TODO: ConfirmSubscription cambiar añadir a qué estás confirmando
  removeElementType(id: string): void{
    if(this.confirmSubscription) this.confirmSubscription.unsubscribe();
    this.confirmSubscription = this.eventos.confirmacion.subscribe(res=>{      
      if(res){
        this.organizador.removeElementType(id);
      }
    });
    
    this.eventos.mensajes.emit({tipo: MsgTipo.AVISO, codigo: MsgCodigo.ConfirmacionEliminarTipoElemento});
    
  }

  //recibe un elemento del componente nuevo elemento y lo añade a la lista
  nuevoElemento(elemento: ListaElemento): void{
    this.displayNuevoElemento=false;
    if(elemento)
      this.datos.listaElementos.push(elemento);
  }   

  //al empezar un resize pone el starting point y el resizing element
  onResizeStart(celda: Celda, event: DragEvent): void{
    this.startingPoint = {izquierda: event.clientX, arriba: event.clientY, ancho: celda.elemento.getAncho(), alto: celda.elemento.getAlto()};    
    console.log(event);
    this.resizingElement = {elem: celda.elemento, htmlElem:  (<HTMLElement>event.target).parentElement};    

  }

  //durante el drag de un resize actualiza el tamaño/posicion de un elemento
  onDrag(celda: Celda, dir:Directions)
  {
    if(!this.dragEvent) return;
    let event=this.dragEvent;
    if(this.draggedCelda) this.draggedCelda=null;

    this.resizeDir=dir;   
    let targElem: HTMLElement = this.resizingElement.htmlElem;
    //ARIBA
    
    if(dir===this.ARRIBA){
      
      if (this.startingPoint.alto - (event.clientY - this.startingPoint.arriba) <= 0) return;
        targElem.style.top = (event.clientY - this.startingPoint.arriba)+"px";
        targElem.style.height = this.startingPoint.alto - (event.clientY - this.startingPoint.arriba)+"px";
        
      //ABAJO
      }else if(dir === this.ABAJO){
        targElem.style.height = this.startingPoint.alto + (event.clientY - this.startingPoint.arriba)+"px";
        
    }else if(dir === this.IZQUIERDA){
      if (this.startingPoint.ancho - (event.clientX - this.startingPoint.izquierda) <= 0) return;
        targElem.style.left = (event.clientX - this.startingPoint.izquierda)+"px";
        targElem.style.width = this.startingPoint.ancho - (event.clientX - this.startingPoint.izquierda)+"px";
        
    }else if(dir === this.DERECHA){      
      
      targElem.style.width = this.startingPoint.ancho + (event.clientX - this.startingPoint.izquierda)+"px";      
      
    }
    
  }

  //al acabar llama a la función de resize del organizador para que actualize el elemento como corresponda
  onDragEnd(): void{
    
    this.organizador.resize(this.resizingElement.elem, this.resizingElement.htmlElem, this.resizeDir, this.startingPoint, this.dragEvent);
    this.resizingElement.elem=null;
  }

  


}

