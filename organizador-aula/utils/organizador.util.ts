import { Datos } from "./datos.util";
import { Elemento } from "../modelos/elemento.modelo";
import { Fila } from "../modelos/fila.modelo";
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
        this.datos.sizeCelda = [sizeCelda[0], sizeCelda[1]]; //(sizeCelda[0], sizeCelda[1]);  
        this.datos.sizeTotal = [sizeCelda[2], sizeCelda[3]];  
    }

    get sizeCelda(): [number, number]{
        return [Math.max(this.datos.sizeCelda[0], this.datos.minSize[0]), Math.max(this.datos.sizeCelda[1], this.datos.minSize[1])] ;
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