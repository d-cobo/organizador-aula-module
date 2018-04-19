import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild, ViewChildren, QueryList, HostListener, EventEmitter, Output, ApplicationRef, TemplateRef, SimpleChanges } from '@angular/core';
import { ResizeEvent, ResizableDirective } from 'angular-resizable-element';
import { Coordenada, ListaElemento, Position } from '../modelos/lista-elementos';
import { Fila } from '../modelos/fila';
import { Celda } from '../modelos/celda';
import { Elemento } from '../modelos/elemento';
import { OrganizadorElementos } from './clases/OrganizadorElementos';
import { Datos } from '../utils/Datos';
import { ConfirmationService, Message } from 'primeng/api';
import { OrganizadorEntidades } from '../organizador-entidades/clases/OrganizadorEntidades';
import { MsgTipo, MsgCodigo, Mensaje } from '../utils/Mensajes';
import { NuevoElementoComponent } from './nuevo-elemento/nuevo-elemento.component';
import { Subscription } from 'rxjs/Subscription';
import { StartingPoint, ResizingElement, Directions } from './clases/interfaces';
import { EventosOrgAulaService } from '../../eventos-org-aula.service';


@Component({
  selector: 'app-organizador-elemento',
  templateUrl: './organizador-elemento.component.html',
  styleUrls: ['./organizador-elemento.component.less']
})

export class OrganizadorElementoComponent implements OnInit {
  
  @Input('datos') datos: Datos;
  @Input('templateElemento') templateElemento: TemplateRef<any>;
  
  @ViewChild('mainDiv') mainDiv: ElementRef;
  @ViewChild('tabla') tabla: ElementRef;

  
  draggedCelda: Celda;  
  dragEvent: DragEvent;
  clickedCelda: Celda;  
  organizador: OrganizadorElementos;
  overElem: any;
  msgs: Message[];
  resizingElement: ResizingElement;
  startingPoint: StartingPoint;
  displayNuevoElemento: boolean;  
  confirmSubscription: Subscription;
  mensajeSubscription: Subscription;
  resizeDir: number;
  readonly ARRIBA: number = Directions.ARRIBA;
  readonly ABAJO: number = Directions.ABAJO;
  readonly IZQUIERDA: number = Directions.IZQUIERDA;
  readonly DERECHA: number = Directions.DERECHA;
  
  

  get style(): Object{
    let size: [number, number] = this.organizador.sizeCelda;
    return {width: `${size[0]}px`, height: `${size[1]}px`};
  }
  constructor(private confirmationService: ConfirmationService, private elementRef: ElementRef, private eventos: EventosOrgAulaService) {}

  ngOnInit() {    
    this.organizador = new OrganizadorElementos();
    this.organizador.datos = this.datos;
    this.displayNuevoElemento=false;
    this.msgs = [];    
    this.organizador.cambiarSize(this.tabla, this.mainDiv);   
   // this.mensajeSubscription = this.eventos.mensajes.subscribe(mens=>this.onMensaje(mens));
    //TODO: poner el listener cogiendo el mainDiv con #mainDiv en el html (bindear con el viewChild)  
    //window.addEventListener('resize', ()=>{this.onResize()});
    
    //this.organizador.inicializar();
  }
  
  


  @HostListener('window:resize', ['$event'])
  onResize(): void{        
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
  }

  ngOnDestroy(){
    //this.mensajeSubscription.unsubscribe();
    if(this.confirmSubscription) this.confirmSubscription.unsubscribe();
  }  

  ngAfterViewInit(){    
    setTimeout(()=>{      
      if(this.organizador.datos.listaElementos && !this.organizador.datos.listaFilas){      
        this.organizador.cambiarSize(this.tabla, this.mainDiv);        
        //this.organizador.inicializar();
        console.log(this.organizador.listaFilas);
        //TODO: Esta bien tener esto aqui?
        let org = new OrganizadorEntidades();
        org.datos=this.datos;
        org.inicializar();
      } 
    }, 0);      
       
  }
/*
  onMensaje(mens: Mensaje){
    if(mens.codigo===MsgCodigo.Cancelar){
      console.log("a");
      this.organizador = new OrganizadorElementos();
      this.organizador.datos = this.datos;
      this.organizador.cambiarSize(this.tabla, this.mainDiv);        
      this.organizador.inicializar();
      this.displayNuevoElemento=false;
    }
  }*/
  ngOnChanges(changes: SimpleChanges): void{    
    if(this.organizador){
      this.organizador.datos = this.datos;
      this.organizador.cambiarSize(this.tabla, this.mainDiv);
    }
   /* this.organizador = new OrganizadorElementos();
    this.organizador.datos = this.datos;
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
    this.organizador.inicializar();
    let org = new OrganizadorEntidades();
    org.datos=this.datos;
    org.inicializar();
    this.displayNuevoElemento=false;*/
  }

  clearMap(): void{
    this.organizador.datos.inicializarFilas();    
  }
  
  //Funcion para el drop
  drop(cel: Celda, event: MouseEvent): void{     
    if(this.resizingElement && this.resizingElement.elem){  
      //this.resize(event);         
      return;
    }
    //cel = this.organizador.getClickedCelda(cel, event.layerX, event.layerY);
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

  toolsDragStart(listElem: ListaElemento): void{
    let celda: Celda=new Celda(-1,-1)
    let elem=new Elemento(false, listElem.id, listElem.nombre, listElem.color, listElem.maxEntidades);
    elem.setPos(0,0, (listElem.alto-1) ,(listElem.ancho-1));
    
    /*elem.x = 0
    elem.y = 0
    elem.x2= elem.x + (listElem.alto-1) 
    elem.y2 = elem.y + (listElem.ancho-1);    */
    console.log(elem);
    //elem.activo=true;
    celda.elemento = elem;
    this.draggedCelda=celda;
  }


  removeElement(celda: Celda): void{
    this.organizador.removeElement(celda.elemento);
  }

  removeElementType(id: string): void{
    if(this.confirmSubscription) this.confirmSubscription.unsubscribe();
    this.confirmSubscription = this.eventos.confirmacion.subscribe(res=>{      
      if(res){
        this.organizador.removeElementType(id);
      }
    });
    
    this.eventos.mensajes.emit({tipo: MsgTipo.AVISO, codigo: MsgCodigo.ConfirmacionEliminarTipoElemento});
    
    
  }

  nuevoElemento(elemento: Elemento): void{
    this.displayNuevoElemento=false;
    if(elemento)
      this.datos.listaElementos.push(elemento);
  }   

  onResizeStart(celda: Celda, event: DragEvent): void{
    this.startingPoint = {izquierda: event.clientX, arriba: event.clientY, ancho: celda.elemento.getAncho(), alto: celda.elemento.getAlto()};    
    console.log(event);
    this.resizingElement = {elem: celda.elemento, htmlElem:  (<HTMLElement>event.target).parentElement};    

  }

  
  onDrag(celda: Celda, dir:number)
  {
    if(!this.dragEvent) return;
    let event=this.dragEvent;
    if(this.draggedCelda) this.draggedCelda=null;

    this.resizeDir=dir;   
    let targElem: HTMLElement = this.resizingElement.htmlElem;
    //ARIBA
    
    if(dir==this.ARRIBA){
      
      if (this.startingPoint.alto - (event.clientY - this.startingPoint.arriba) <= 0) return;
        targElem.style.top = (event.clientY - this.startingPoint.arriba)+"px";
        targElem.style.height = this.startingPoint.alto - (event.clientY - this.startingPoint.arriba)+"px";
        
      //ABAJO
      }else if(dir == this.ABAJO){
        targElem.style.height = this.startingPoint.alto + (event.clientY - this.startingPoint.arriba)+"px";
        
    }else if(dir == this.IZQUIERDA){
      if (this.startingPoint.ancho - (event.clientX - this.startingPoint.izquierda) <= 0) return;
        targElem.style.left = (event.clientX - this.startingPoint.izquierda)+"px";
        targElem.style.width = this.startingPoint.ancho - (event.clientX - this.startingPoint.izquierda)+"px";
        
    }else if(dir == this.DERECHA){      
      
      targElem.style.width = this.startingPoint.ancho + (event.clientX - this.startingPoint.izquierda)+"px";      
      
    }
    
  }

  onDragEnd(): void{
    
    this.organizador.resize(this.resizingElement.elem, this.resizingElement.htmlElem, this.resizeDir, this.startingPoint, this.dragEvent);
    this.resizingElement.elem=null;
  }

  tablaDragEnter(event: DragEvent): void{
    this.dragEvent=event;   
  }


}

