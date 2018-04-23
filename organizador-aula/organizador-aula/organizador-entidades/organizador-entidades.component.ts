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
  
  @Input('templateBarra') templateBarra: TemplateRef<any>;
  @Input('templateElemento') templateElemento: TemplateRef<any>;
  @Input('templateTabla') templateTabla: TemplateRef<any>;
  
  prDatos: Datos;
  
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



  
  datosEntidad: string[];
  claseObjetoEntidad: string;
  organizador: OrganizadorEntidades;
  draggedEntidad:Entidad;  
  mostrarBarraLateral: boolean;
  display: boolean;
  filtro: string;

  constructor(private eventos: EventosOrgAulaService) {    
   }

  ngOnInit() {
    this.mostrarBarraLateral=true;
    this.datosEntidad=[];
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

  mostrarDatos(entidad: Entidad): void{
    this.eventos.clickEntidad.emit(entidad.objeto);

  }

  getEstilo(entidad: Entidad): object{
    let percent: number = 100/(entidad.elemento.entidades.length+1);
    return {
      //marginLeft: `calc(${percent}% - 2vw)`,
      float: 'left'
    }
  }

  toogleColumnaLateral(): void{
    this.mostrarBarraLateral = this.mostrarBarraLateral ? false : true;
    setTimeout(()=>{
      this.organizador.cambiarSize(this.tabla, this.mainDiv); 
    }, 0);
  }

  getEntidadesSinPos(): Entidad[]{
    return this.organizador.getEntidadesSinPos().filter(ent=>ent.titulo.toUpperCase().includes(this.filtro.toUpperCase()));
  }

  droppable(cel: Celda): boolean{
    if(this.organizador.datos.entSinElemento) return true;
    else if(cel.elemento) return true;
    else return false;
  }

}
