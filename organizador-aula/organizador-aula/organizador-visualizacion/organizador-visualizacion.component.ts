import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef, HostListener } from '@angular/core';
import { Datos } from '../utils/Datos';
import { OrganizadorEntidades } from '../organizador-entidades/clases/OrganizadorEntidades';
import { Entidad } from '../modelos/entidad';
import { EventosOrgAulaService } from '../../eventos-org-aula.service';
import { OrganizadorElementos } from '../organizador-elemento/clases/OrganizadorElementos';

@Component({
  selector: 'app-organizador-visualizacion',
  templateUrl: './organizador-visualizacion.component.html',
  styleUrls: ['./organizador-visualizacion.component.less']
})
export class OrganizadorVisualizacionComponent implements OnInit {

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

  constructor(private eventos: EventosOrgAulaService){}

  ngOnInit() {
    this.mostrarBarraLateral=true;
    this.datosEntidad=[];
    this.organizador = new OrganizadorEntidades();
    this.organizador.datos = this.datos;
    this.onResize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(): void{    
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
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


}
