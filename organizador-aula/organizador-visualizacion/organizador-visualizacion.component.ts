import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef, HostListener } from '@angular/core';
import { Datos } from '../../utils/datos.util';
import { Entidad } from '../../modelos/entidad.modelo';
import { EventosOrgAulaService } from '../../eventos-org-aula.service';
import { OrganizadorEntidades } from '../../utils/OrganizadorEntidades';

@Component({
  selector: 'app-organizador-visualizacion',
  templateUrl: './organizador-visualizacion.component.html',
  styleUrls: ['./organizador-visualizacion.component.less']
})
//Component para la visualización del tablero
export class OrganizadorVisualizacionComponent implements OnInit {

  @ViewChild('mainDiv') mainDiv: ElementRef;
  @ViewChild('tabla') tabla: ElementRef;
  
  @Input('templateBarra') templateBarra: TemplateRef<any>;
  @Input('templateElemento') templateElemento: TemplateRef<any>;
  @Input('templateTabla') templateTabla: TemplateRef<any>;
  
  prDatos: Datos;
  //Actualiza los datos compartidos en el organizador si hay un cambio
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



  
  claseObjetoEntidad: string;
  organizador: OrganizadorEntidades;

  constructor(private eventos: EventosOrgAulaService){}

  //Inicia los datos
  ngOnInit() {
    this.organizador = new OrganizadorEntidades();
    this.organizador.datos = this.datos;
    this.onResize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(): void{    
    this.organizador.cambiarSize(this.tabla, this.mainDiv);        
  }

 

  //click en entidad envia un mensaje con sus datos
  mostrarDatos(entidad: Entidad): void{
    this.eventos.clickEntidad.emit(entidad.objeto);
  }



}
