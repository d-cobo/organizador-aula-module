import { Component, OnInit, Input, TemplateRef, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Datos } from '../utils/Datos';
import { OrganizadorEntidades } from './clases/OrganizadorEntidades';
import { Elemento } from '../modelos/elemento';
import { Entidad } from '../modelos/entidad';
import { Subscription } from 'rxjs/Subscription';
import { EventosOrgAulaService } from '../../eventos-org-aula.service';


@Component({
  selector: 'app-organizador-entidades',
  templateUrl: './organizador-entidades.component.html',
  styleUrls: ['./organizador-entidades.component.less']
})
export class OrganizadorEntidadesComponent implements OnInit {
  @ViewChild('mainDiv') mainDiv: ElementRef;
  @ViewChild('tabla') tabla: ElementRef;
  
  @Input('templateBarra') templateBarra: TemplateRef<any>;
  @Input('templateTabla') templateTabla: TemplateRef<any>;
  @Input("datos") datos: Datos;


  
  datosEntidad: string[];
  claseObjetoEntidad: string;
  organizador: OrganizadorEntidades;
  draggedEntidad:Entidad;  
  mostrarBarraLateral: boolean;
  display: boolean;

  constructor(private eventos: EventosOrgAulaService) {    
   }

  ngOnInit() {
    this.mostrarBarraLateral=true;
    this.datosEntidad=[];
    this.organizador = new OrganizadorEntidades();
    this.organizador.datos = this.datos;
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(): void{    
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
  }

  onDrop(elemento: Elemento): void{
    if(elemento)
      this.organizador.dropOnElement(this.draggedEntidad, elemento);
    else
      this.organizador.dropOnToolbar(this.draggedEntidad);
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
      marginLeft: `calc(${percent}% - 2vw)`,
      float: 'left'
    }
  }

  toogleColumnaLateral(): void{
    this.mostrarBarraLateral = this.mostrarBarraLateral ? false : true;
    setTimeout(()=>{
      this.organizador.cambiarSize(this.tabla, this.mainDiv); 
    }, 0);
  }

}
