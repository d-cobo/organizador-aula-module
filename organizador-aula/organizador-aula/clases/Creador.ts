import { Fila } from "../modelos/fila";
import { Celda } from "../modelos/celda";
import { Elemento } from "../modelos/elemento";
import { ListaElemento } from "../modelos/lista-elementos";
import { ListaEntidad } from "../modelos/lista-entidad";

export abstract class Creador{
    protected prNumFilas:number;
    protected prNumColumnas:number;
    protected prListaElementos:ListaElemento[];
    protected prListaEntidades:ListaEntidad[];
    listaFilas: Fila[];
    //protected filas: Fila[];
    protected sizeCelda: [number, number] = [0,0];
    protected sizePantalla: [number, number] = [0,0];
    
    constructor(numFilas:number, numColumnas:number, listaElementos: ListaElemento[] = null, listaEntidades: ListaEntidad[] = null){
        this.prNumFilas=numFilas;
        this.prNumColumnas=numColumnas;
        if(listaElementos){
            this.prListaElementos = listaElementos;
        }
        if(listaEntidades){
            this.prListaEntidades=listaEntidades;
        }
    };
    get numFilas(): number{
        return this.prNumFilas;
    }
    set numFilas(numFilas: number){
        this.prNumFilas=numFilas;
        this.onFilasChange();
    }

    get numColumnas(): number{
        return this.prNumColumnas;
    }

    get size(): [number, number]{
        return this.sizeCelda;
    }
    
    set numColumnas(numColumnas: number){
        this.prNumColumnas=numColumnas;
        this.onColumnasChange();
    }
    set listaElementos(listaElementos: ListaElemento[]){
        this.prListaElementos = listaElementos;        
    }

    get listaElementos(): ListaElemento[]{
        return this.prListaElementos;
    }

    set listaEntidades(listaEntidades: ListaEntidad[]){
        this.prListaEntidades = listaEntidades;        
    }

    get listaEntidades(): ListaEntidad[]{
        return this.prListaEntidades;
    }
    abstract onFilasChange(): void;
    abstract onColumnasChange(): void;
    abstract inicializarFilas(): void;
    abstract setSize(anchoCelda:number, altoCelda:number): void;    
    abstract setTotalSize(anchoTotal:number, altoTotal:number): void;    
    
}

export class CreadorDefault extends Creador{
    onFilasChange(): void {
        let newHeight:number = this.listaFilas.length/this.numFilas;     
        if(newHeight>1){
            this.listaFilas = this.listaFilas.slice(0,this.numFilas);
            console.log(this.listaFilas);
            this.listaFilas.forEach(fila=>{
                fila.celdas.filter(cel=> cel.initElemento()).forEach(cel=>{
                    if(cel.elemento.x2>=this.numFilas-1){
                        cel.elemento.x2 = this.numFilas-1;
                        cel.elemento.resizeDown=false;
                    }
                })
            });
        }else if(newHeight<1){       
            let oldlen: number =this.listaFilas.length;       
            this.listaFilas[oldlen-1].celdas.filter(cel=>cel.elemento).forEach(cel=>{
                cel.elemento.resizeDown=true;
            })
            for(let numFila=oldlen; numFila<this.numFilas; numFila++){
                this.listaFilas.push(new Fila(numFila));
                for(let numCol=0; numCol<this.numColumnas;numCol++){
                    this.listaFilas[numFila].celdas.push(new Celda(numFila, numCol));
                }
            }            
        }
        if(newHeight!==1){
            this.setSize(this.sizeCelda[0], this.sizeCelda[1]*newHeight);
            //this.listaFilas.forEach(fila=>{
            //    fila.celdas.forEach(cel=> {cel.alto=cel.alto*newHeight});
            //})
        }
    }
    onColumnasChange(): void{
        let newWidth:number = this.listaFilas[0].celdas.length/this.numColumnas;  
        if(newWidth>1){
            this.listaFilas.forEach(fila=>{
                fila.celdas = fila.celdas.slice(0, this.numColumnas);
                fila.celdas.filter(cel=> cel.initElemento()).forEach(cel=>{
                    if(cel.elemento.y2>=this.numColumnas-1){
                        cel.elemento.y2 = this.numColumnas-1;
                        cel.elemento.resizeRight=false;
                    }
                })
            });
        }else if(newWidth<1){
            
            let oldlen: number = this.listaFilas[0].celdas.length;
            this.listaFilas.forEach(fila=>{
                if(fila.celdas[oldlen-1].elemento){
                    fila.celdas[oldlen-1].elemento.resizeRight=true;
                }
                for(let col=oldlen; col<this.numColumnas;col++){
                    fila.celdas.push(new Celda(fila.x, col));
                }
            })
        }
        if(newWidth!==1){
            this.setSize(this.sizeCelda[0]*newWidth, this.sizeCelda[1]);
        }

    }
    constructor(numFilas:number, numColumnas:number, listaElementos: ListaElemento[] = null, listaEntidades: ListaEntidad[] = null){
        super(numFilas, numColumnas, listaElementos, listaEntidades);
    }
    setSize(anchoCelda?:number, altoCelda?:number): void{        
        if (anchoCelda) this.sizeCelda[0]=anchoCelda;
        if (altoCelda) this.sizeCelda[1]=altoCelda;        
        if(this.listaFilas){            
            this.listaFilas.forEach(fila=>fila.celdas.forEach(cel=>{                                
                cel.ancho=this.sizeCelda[0];               
                
                cel.alto=this.sizeCelda[1];
                /*PRUEBA PARA CAMBIAR TAMAÑOS 
                    if(cel.y==3) cel.ancho*=2;
                    if(cel.x==2) cel.alto*=1.8; 
                */
            }));
        }
    }

    setTotalSize(anchoTotal: number, altoTotal: number): void{
        this.sizePantalla[0]=anchoTotal;
        this.sizePantalla[1]=altoTotal;
    }
    /*inicializarFilas():Fila[]{                
        let filas: Fila[] = [];
        for(let numFila=0; numFila<this.numFilas;numFila++){
            filas.push(new Fila());
            for(let numCol=0; numCol<this.numColumnas;numCol++){
              filas[numFila].celdas.push(new Celda(numFila, numCol, this.sizeCelda[0], this.sizeCelda[1]));
            }
        }
        return filas;
    }*/
    inicializarFilas():void{                        
        this.listaFilas=[];
        for(let numFila=0; numFila<this.numFilas;numFila++){
            this.listaFilas.push(new Fila(numFila));
            for(let numCol=0; numCol<this.numColumnas;numCol++){                
                this.listaFilas[numFila].celdas.push(new Celda(numFila, numCol));
            }
        }
        this.setSize();
        this.actualizarTamano();        
    }

    actualizarTamano(): void{
        let sumAlto: number = 0;
        let sumAncho: number = 0;
        this.listaFilas[0].celdas.forEach(c=>{
            sumAncho+=c.ancho;
        });
        this.listaFilas.forEach(f=>{
            sumAlto+=f.celdas[0].alto;
        });
        this.listaFilas.forEach(f=>f.celdas.forEach(c=>{
            c.ancho = c.ancho * (this.sizePantalla[0] / sumAncho);
            c.alto = c.alto * (this.sizePantalla[1] / sumAlto);
        }))
    }

}