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

    set sizeCelda(sizeCelda: [number, number]){        
        this.datos.creador.setSize(sizeCelda[0], sizeCelda[1]);                
    }

    get sizeCelda(): [number, number]{
        return this.datos.creador.size;
    }

    calcularCasillas(tabla: ElementRef, mainDiv: ElementRef): [number, number]{        
        let ancho:number = Math.floor(tabla.nativeElement.clientWidth*0.9 / this.datos.columnas);
        let alto:number = Math.floor(mainDiv.nativeElement.clientHeight / this.datos.filas);
       return [ancho, alto];
    }

    cambiarSize(tabla: ElementRef, mainDiv: ElementRef): void{
        this.sizeCelda = this.calcularCasillas(tabla, mainDiv);
    }

    
}