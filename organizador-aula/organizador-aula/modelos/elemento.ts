import { Coordenada } from "./lista-elementos";
import { Entidad } from "./entidad";

export class Elemento{
    x: number;
    y: number;
    x2:number;
    y2:number;    
    id:string;   
    maxEntidades: number;
    nombre: string;
    color:string; 
    activo: boolean = false;
    entidades: Entidad[] = [];
    resizeRight:boolean=true;    
    resizeDown: boolean=true;

    

    getElemId():string{
        return `${this.id}_${this.x}_${this.y}`;
    }

    getAncho():number{
        return this.y2-this.y;
    }

    getAlto():number{
        return this.x2-this.x;
    }

    getAnchoPx():string{
        if(this.activo)
            return 90+100*(this.y2-this.y)+"%";
        else
            return '0';
    }

    getAltoPx():string{
        if(this.activo)
            return 90+100*(this.x2-this.x)+"%";
        else
            return '0';
    }

    getEstilo():object{
        return{
            width: this.getAnchoPx(),
            height: this.getAltoPx(),
            backgroundColor: this.color
        }
    }

    getCoorCeldas():number[][]{
        let lista: number[][]=[];
        for(let fila=this.x; fila<=this.x2; fila++){            
            for(let col=this.y;col<=this.y2;col++){
              lista.push([fila, col]);
            }
          }
          return lista;
    }

    setPos(x:number, y:number, x2:number, y2: number):void{
        this.x = x;
        this.y=y;
        this.x2=x2;
        this.y2=y2;
    }

    

    getClasses():object{
        return{
            elemento: true,
            activo: this.activo,
            inactivo: !this.activo,
            noRight: !this.resizeRight,
            noDown: !this.resizeDown,
            noUp: this.x2===this.x,
            noLeft:   this.y2===this.y
        }
    }

    getIndexEntidad(entidad: Entidad):number{
        return this.entidades.findIndex(ent=>ent.objeto.equals(entidad.objeto));        
    }
    
}