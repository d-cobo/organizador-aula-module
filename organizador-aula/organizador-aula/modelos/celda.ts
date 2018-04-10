import { Elemento } from "./elemento";
import { Entidad } from "./entidad";

export class Celda{
    x:number;
    y:number;
    ancho:number;
    alto: number;
    elemento: Elemento=null;
    
    /*constructor(x:number, y:number, ancho:number, alto:number){
        this.x = x;
        this.y=y;
        this.ancho = ancho;
        this.alto = alto;
        //this.elemento = new Elemento(x,y);        
    }*/
    constructor(x:number, y:number){
        this.x = x;
        this.y=y;        
        //this.elemento = new Elemento(x,y);        
    }

    getAnchoPx(): string{
        return this.ancho+"px";
    }

    getSizePx(): object{
        return {
            width: this.ancho+'px',
            height: this.alto+'px'
          };
    }

    initElemento(): boolean{
        return (this.elemento && this.elemento.x===this.x && this.elemento.y===this.y)
    }
}