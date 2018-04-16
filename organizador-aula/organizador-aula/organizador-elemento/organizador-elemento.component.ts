import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, Input, ViewChild, ViewChildren, QueryList, HostListener, EventEmitter, Output, ApplicationRef } from '@angular/core';
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


@Component({
  selector: 'app-organizador-elemento',
  templateUrl: './organizador-elemento.component.html',
  styleUrls: ['./organizador-elemento.component.less']
})

export class OrganizadorElementoComponent implements OnInit {
  
  @Input('datos') datos: Datos;
  @ViewChild('mainDiv') mainDiv: ElementRef;
  @ViewChild('tabla') tabla: ElementRef;
  @Output('mensaje') mensaje: EventEmitter<Mensaje> = new EventEmitter<Mensaje>();

  
  draggedCelda: Celda;  
  dragEvent: DragEvent;
  clickedCelda: Celda;  
  organizador: OrganizadorElementos;
  overElem: any;
  msgs: Message[] = [];
  resizingElement: {elem, htmlElem};
  startingPoint: {left, top, ancho, alto};
  displayNuevoElemento: boolean = false;
  resizeDir: number;
  directions: {ARRIBA, ABAJO, IZQUIERDA, DERECHA} = {
    ARRIBA: 0,
    ABAJO: 1,
    IZQUIERDA: 2,
    DERECHA: 3
  }
  

  get style(){
    let size: [number, number] = this.organizador.sizeCelda;
    return {width: `${size[0]}px`, height: `${size[1]}px`};
  }
  constructor(private confirmationService: ConfirmationService, private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {    
    this.organizador = new OrganizadorElementos();
    this.organizador.datos = this.datos;
    //TODO: poner el listener cogiendo el mainDiv con #mainDiv en el html (bindear con el viewChild)  
    //window.addEventListener('resize', ()=>{this.onResize()});
  
  }

  @HostListener('window:resize', ['$event'])
  onResize(){        
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
  }

  ngOnDestroy(){
    //console.log("destruction falls upon you");
    //window.removeEventListener('resize', ()=>this.onResize());
  }

  ngAfterViewInit(){    
    setTimeout(()=>{      
      if(this.organizador.datos.listaElementos && !this.organizador.datos.listaFilas){      
        this.organizador.cambiarSize(this.tabla, this.mainDiv);        
        this.organizador.inicializar();
        console.log(this.organizador.listaFilas);
        //TODO: Esta bien tener esto aqui?
        let org = new OrganizadorEntidades();
        org.datos=this.datos;
        org.inicializar();
      } 
    }, 0);      
       
  }

  clearMap(): void{
    this.organizador.datos.inicializarFilas();    
  }
  
  //Funcion para el drop
  drop(cel: Celda, event: MouseEvent){     
    if(this.resizingElement && this.resizingElement.elem){  
      //this.resize(event);         
      return;
    }
    //cel = this.organizador.getClickedCelda(cel, event.layerX, event.layerY);
    if(cel.elemento)      
      cel = this.organizador.getClickedCelda(cel, event.layerX, event.layerY);
    let status: number = this.organizador.drop(cel, this.draggedCelda, this.clickedCelda);
    if(status===MsgTipo.ERROR){
      this.mensaje.emit({tipo: MsgTipo.ERROR, codigo: MsgCodigo.CeldaOcupada});
      //this.msgs = [];
      //this.msgs.push({severity:'error', summary:'Error', detail:'El elemento no cabe en esa posición.'});
    }
    this.clickedCelda=null;
  }

  //Actualiza el elemento que se esta arrastrando
  celdaDragStart(celda: Celda, event: MouseEvent): void{         
    this.clickedCelda = this.organizador.getClickedCelda(celda, event.layerX, event.layerY);
    this.draggedCelda=celda;
  }

  toolsDragStart(listElem: ListaElemento){
    let celda: Celda=new Celda(-1,-1)
    let elem=new Elemento();
    elem.color=listElem.color;
    elem.id=listElem.id;
    elem.x=0;
    elem.y=0;
    elem.x2 = elem.x + (listElem.alto-1);
    elem.y2 = elem.y + (listElem.ancho-1);
    elem.maxEntidades=listElem.maxEntidades;
    //elem.activo=true;
    celda.elemento = elem;
    this.draggedCelda=celda;
  }


  removeElement(celda: Celda): void{
    this.organizador.removeElement(celda);
  }

  removeElementType(id: string){
    this.confirmationService.confirm({
      message: 'Si eliminas un tipo de elemento se eliminarán todos los del mismo tipo que haya '+
               'sobre el tablero, ¿Continuar?',
      accept: () => {
        this.organizador.removeElementType(id);
      }
    });
    
  }

  nuevoElemento(elemento: Elemento){
    this.displayNuevoElemento=false;
    this.datos.listaElementos.push(elemento);
  }   

  onResizeStart(celda: Celda, event: DragEvent){
    this.startingPoint = {left: event.clientX, top: event.clientY, ancho: celda.elemento.getAncho(), alto: celda.elemento.getAlto()};    
    console.log(event);
    this.resizingElement = {elem: celda.elemento, htmlElem:  (<HTMLElement>event.target).parentNode};    

  }

  
  onDrag(celda: Celda, dir:number)
  {
    if(!this.dragEvent) return;
    let event=this.dragEvent;
    if(this.draggedCelda) this.draggedCelda=null;

    this.resizeDir=dir;   
    let targElem: HTMLElement = this.resizingElement.htmlElem;
    //ARIBA
    if(dir==this.directions.ARRIBA){
      
      if (this.startingPoint.alto - (event.clientY - this.startingPoint.top) <= 0) return;
        targElem.style.top = (event.clientY - this.startingPoint.top)+"px";
        targElem.style.height = this.startingPoint.alto - (event.clientY - this.startingPoint.top)+"px";
        
      //ABAJO
      }else if(dir == this.directions.ABAJO){
        targElem.style.height = this.startingPoint.alto + (event.clientY - this.startingPoint.top)+"px";
        
    }else if(dir == this.directions.IZQUIERDA){
      if (this.startingPoint.ancho - (event.clientX - this.startingPoint.left) <= 0) return;
        targElem.style.left = (event.clientX - this.startingPoint.left)+"px";
        targElem.style.width = this.startingPoint.ancho - (event.clientX - this.startingPoint.left)+"px";
        
    }else if(dir == this.directions.DERECHA){      
      
      targElem.style.width = this.startingPoint.ancho + (event.clientX - this.startingPoint.left)+"px";      
      
    }
    
  }

  onDragEnd(){
    
    this.organizador.resize(this.resizingElement.elem, this.resizingElement.htmlElem, this.resizeDir, this.startingPoint, this.dragEvent);
    this.resizingElement.elem=null;
  }

  tablaDragEnter(event: DragEvent){
    this.dragEvent=event;   
  }


}

