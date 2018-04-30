
import { Entidad } from "./entidad.modelo";
import { Elemento } from "./elemento.modelo";

//Representa una celda de la tabla
export class Celda{
    x:number;
    y:number;
    ancho:number;
    alto: number;
    elemento: Elemento;
    droppable: boolean;

    constructor(x:number, y:number, droppable?: boolean){
        this.x = x;
        this.y=y;      
        this.elemento=null;  
        if(droppable===undefined) this.droppable = true;
        else this.droppable=false;
    }

    get pDroppable(): string{
        if(this.droppable) return 'elementos';
        return null;
    }

    getAnchoPx(): string{
        return this.ancho+"px";
    }

    getSizePx(): object{
        return {
            width: this.ancho+'px',
            height: this.alto+'px',
            minWidth: this.ancho+'px',
            minHeight: this.alto+'px'
          };
    }

    initElemento(): boolean{
        return (this.elemento && this.elemento.x===this.x && this.elemento.y===this.y)
    }
}