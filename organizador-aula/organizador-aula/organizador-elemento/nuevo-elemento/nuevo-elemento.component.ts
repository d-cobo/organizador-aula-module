import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ListaElemento } from '../../modelos/lista-elementos';

@Component({
  selector: 'app-nuevo-elemento',
  templateUrl: './nuevo-elemento.component.html',
  styleUrls: ['./nuevo-elemento.component.less']
})
export class NuevoElementoComponent implements OnInit {
  nuevoElemento: ListaElemento;
  displayNuevoElemento;
  @Output('elemento') elemento: EventEmitter<ListaElemento> = new EventEmitter<ListaElemento>();
  constructor() {    

   }

  ngOnInit() {
    this.nuevoElemento = {id:"", nombre:"", color:"#1111dd", ancho:1, alto:1, maxEntidades: 1};
    this.displayNuevoElemento = true;
  }

  crearNuevoElemento(): void{
    if(this.nuevoElemento.nombre==="" || this.nuevoElemento.id==="" || this.nuevoElemento.maxEntidades<0 || this.nuevoElemento.ancho<=0 || this.nuevoElemento.alto<=0){
      return;
    }    
    this.elemento.emit(this.nuevoElemento);
  }

  onCancel(): void{
    this.elemento.emit(null);
  }

}
