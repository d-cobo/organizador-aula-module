import { Coordenada } from "./lista-elementos";
import { Entidad } from "./entidad";
import { Celda } from "./celda";

export class Elemento{
    x: number;
    y: number;
    x2:number;
    y2:number;    
    id:string;   
    maxEntidades: number;
    nombre: string;
    color:string; 
    activo: boolean; //Si es un elemento posicionado
    celdas: Celda[][];
    entidades: Entidad[];

    constructor(activo: boolean, id: string, nombre: string, color: string, maxEntidades: number){
        this.activo=activo;
        this.id=id;
        this.nombre=nombre;
        this.color=color;
        this.maxEntidades=maxEntidades;
        this.celdas = [];
        this.entidades = [];
    }

    getElemId():string{
        return `${this.id}_${this.x}_${this.y}`;
    }

    getAncho():number{
        if(this.activo){
            let suma=0;
            suma+=this.celdas[0][0].ancho*0.9;
            this.celdas[0].forEach((c,i)=>{
                if(i!=0) suma+=c.ancho
            });
            return (suma)+(this.celdas[0].length*0.5);
            //return 90+100*(this.y2-this.y)+"%";
        }
        else
            return 0;
    }

    getAlto():number{
        if(this.activo){
            let suma=0;            
            this.celdas.forEach((c,i)=>{
                suma+=c[0].alto;
            });
            return (suma + this.celdas.length*0.5 -10);
            //return 90+100*(this.y2-this.y)+"%";
        }
        else
            return 0;
    }

    getAnchoPx():string{
        return this.getAncho()+"px";
    }

    getAltoPx():string{
        return this.getAlto()+"px";
    }

    getEstilo():object{
        return{
            width: this.getAnchoPx(),
            height: this.getAltoPx()            
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
        }
    }

    getIndexEntidad(entidad: Entidad):number{
        return this.entidades.findIndex(ent=>ent.objeto.equals(entidad.objeto));        
    }


    
}