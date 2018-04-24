import { Entidad } from "./entidad.modelo";
import { Celda } from "./celda.modelo";

//Representa a un elemento del tablero
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
    celdas: Celda[][]; //Celdas que lo contienen
    entidades: Entidad[]; //Entidades asignadas a el

    constructor(activo: boolean, id: string, nombre: string, color: string, maxEntidades: number){
        this.activo=activo;
        this.id=id;
        this.nombre=nombre;
        this.color=color;
        this.maxEntidades=maxEntidades;
        this.celdas = [];
        this.entidades = [];
    }

    //Funciones que calculan el ancho y el alto del elemento segun los tamaños de las celdas
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

    //Para un ngStyle; asigna ancho y alto a un elemento
    getEstilo():object{
        return{
            width: this.getAnchoPx(),
            height: this.getAltoPx()            
        }
    }

    //devuelve una lista con las coordenadas de sus celdas
    getCoorCeldas():number[][]{
        let lista: number[][]=[];
        this.celdas.forEach(f=>f.forEach(cel=>
            lista.push([cel.x, cel.y])
        ));              
        return lista;
    }

    setPos(x:number, y:number, x2:number, y2: number):void{
        this.x = x;
        this.y=y;
        this.x2=x2;
        this.y2=y2;
    }

    
    //para ngClass segun elemento esté activo o no
    getClasses():object{
        return{
            elemento: true,
            activo: this.activo,
            inactivo: !this.activo,            
        }
    }

    //Devuelve el indice de una entidad de la lista
    getIndexEntidad(entidad: Entidad):number{
        return this.entidades.findIndex(ent=>ent.objeto.equals(entidad.objeto));        
    }

    //Crea un elemento vacío/automático para entidades colocadas en celdas sin elemento
    static getElementoVacio(): Elemento{
        return new Elemento(true, 'id_auto', '', '', 1);
    }


    
}