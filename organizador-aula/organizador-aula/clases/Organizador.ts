import { Datos } from "./Datos";
import { Elemento } from "../modelos/elemento";
import { Fila } from "../modelos/fila";
import { ElementRef } from "@angular/core";

export abstract class Organizador{
    datos: Datos;
    //prSizeCelda: [number, number];
    abstract inicializar();
        //if(!this.datos.listaFilas)
        //    this.datos.inicializarFilas();        

    

    get listaFilas():Fila[]{
        return this.datos.listaFilas;
    }

    set size(sizeCelda: [number, number, number, number]){        
        this.datos.creador.setSize(sizeCelda[0], sizeCelda[1]);  
        this.datos.creador.setTotalSize(sizeCelda[2], sizeCelda[3]);  
    }

    get sizeCelda(): [number, number]{
        return this.datos.creador.size;
    }

    calcularCasillas(tabla: ElementRef, mainDiv: ElementRef): [number, number, number, number]{        
        let ancho:number = Math.floor(tabla.nativeElement.clientWidth*0.9 / (this.datos.columnas));
        let alto:number = Math.floor(mainDiv.nativeElement.clientHeight / this.datos.filas);
       return [ancho, alto, tabla.nativeElement.clientWidth*0.9, mainDiv.nativeElement.clientHeight];
    }

    cambiarSize(tabla: ElementRef, mainDiv: ElementRef): void{
        this.size = this.calcularCasillas(tabla, mainDiv);
    }

    
}