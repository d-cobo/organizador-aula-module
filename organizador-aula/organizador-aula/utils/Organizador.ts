import { Datos } from "./Datos";
import { Elemento } from "../modelos/elemento";
import { Fila } from "../modelos/fila";
import { ElementRef } from "@angular/core";

export abstract class Organizador{
    datos: Datos;
    //Distinta inicialización para el organizador de elementos o entidades
    //Varias funciones son comunes, como la de calcular casillas
    abstract inicializar();

    
    get listaFilas():Fila[]{
        return this.datos.listaFilas;
    }

    set size(sizeCelda: [number, number, number, number]){        
        this.datos.creador.setSize(sizeCelda[0], sizeCelda[1]);  
        this.datos.creador.setTotalSize(sizeCelda[2], sizeCelda[3]);  
    }

    get sizeCelda(): [number, number]{
        return [Math.max(this.datos.creador.size[0], this.datos.creador.getMinSize[0]), Math.max(this.datos.creador.size[1], this.datos.creador.getMinSize[1])] ;
    }

    calcularCasillas(tabla: ElementRef, mainDiv: ElementRef): [number, number, number, number]{        
        let ancho:number = Math.floor(tabla.nativeElement.clientWidth*0.99 / (this.datos.columnas));
        let alto:number = Math.floor(mainDiv.nativeElement.clientHeight*0.98 / this.datos.filas);
       return [ancho, alto, tabla.nativeElement.clientWidth*0.99, mainDiv.nativeElement.clientHeight*0.98];
    }

    cambiarSize(tabla: ElementRef, mainDiv: ElementRef): void{
        this.size = this.calcularCasillas(tabla, mainDiv);
    }

    
}