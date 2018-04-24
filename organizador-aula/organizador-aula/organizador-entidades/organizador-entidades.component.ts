import { Component, OnInit, Input, TemplateRef, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Datos } from '../../utils/datos.util';
import { OrganizadorEntidades } from './clases/OrganizadorEntidades';
import { Elemento } from '../../modelos/elemento.modelo';
import { Entidad } from '../../modelos/entidad.modelo';
import { Subscription } from 'rxjs/Subscription';
import { EventosOrgAulaService } from '../../eventos-org-aula.service';
import { Celda } from '../../modelos/celda.modelo';
import { OrganizadorElementos } from '../organizador-elemento/clases/OrganizadorElementos';


@Component({
  selector: 'app-organizador-entidades',
  templateUrl: './organizador-entidades.component.html',
  styleUrls: ['./organizador-entidades.component.less']
})
export class OrganizadorEntidadesComponent implements OnInit {
  @ViewChild('mainDiv') mainDiv: ElementRef;
  @ViewChild('tabla') tabla: ElementRef;
  
  @Input('templateBarra') templateBarra: TemplateRef<any>; //template de las entidades en la barra
  @Input('templateElemento') templateElemento: TemplateRef<any>; //temp de los elementos
  @Input('templateTabla') templateTabla: TemplateRef<any>; //temp de las entidades en la tabla
  
  prDatos: Datos;
  
  //Datos compartidos con la info de la tabla, si se actualizan recargarlos en el organizador
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

  organizador: OrganizadorEntidades; //El organizador que lleva a cabo la mayoria de las funciones
  draggedEntidad:Entidad;   //Entidad que esta siendo arrastrada
  mostrarBarraLateral: boolean; //Muestra/oculta barra lateral
  filtro: string; //Filtra elementos por su atributo de titulo, bindeada al input de la vista

  constructor(private eventos: EventosOrgAulaService) {    
   }

  //inicializa las variables
  ngOnInit() {
    this.mostrarBarraLateral=true;    
    this.organizador = new OrganizadorEntidades();
    this.organizador.datos = this.datos;
    this.filtro="";
    setTimeout(()=>{
      this.organizador.cambiarSize(this.tabla, this.mainDiv);    
    }, 0);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(): void{    
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
  }


//llama a la función de drop correspondiente del organizador según donde caigas
  onDrop(celda: Celda): void{
    if(celda && celda.elemento)
      this.organizador.dropOnElement(this.draggedEntidad, celda.elemento);
    else if(celda){
      this.organizador.dropOnCell(this.draggedEntidad, celda);
    }else{
      this.organizador.dropOnToolbar(this.draggedEntidad);
    }
  }

  onDrag(entidad: Entidad): void{
    this.draggedEntidad=entidad;
  }

  //al hacer clcik en entidad
  mostrarDatos(entidad: Entidad): void{
    this.eventos.clickEntidad.emit(entidad.objeto);
  }

  //muestra u oculta la columna lateral
  toogleColumnaLateral(): void{
    this.mostrarBarraLateral = this.mostrarBarraLateral ? false : true;
    setTimeout(()=>{
      this.organizador.cambiarSize(this.tabla, this.mainDiv); 
    }, 0);
  }

  //llama a la funcion de obtener las entidas nulas y las filtra con el texto del filtro
  getEntidadesSinPos(): Entidad[]{
    return this.organizador.getEntidadesSinPos().filter(ent=>ent.titulo.toUpperCase().includes(this.filtro.toUpperCase()));
  }

  //determina si se puede hacer drop en una celda  
  droppable(cel: Celda): boolean{
    if(this.organizador.datos.entSinElemento) return true;
    else if(cel.elemento) return true;
    else return false;
  }

}
