import { Creador } from "./creador.util";
import { Celda } from "../modelos/celda.modelo";
import { Fila } from "../modelos/fila.modelo";
import { ListaElemento } from "../modelos/lista-elemento.modelo";
import { ListaEntidad } from "../modelos/lista-entidad.modelo";

//implementacion de Creador por defecto
export class CreadorDefault extends Creador{

    //devuelve una nueva instancia de CreadorDefault con los datos que recibe
    nuevaInstancia(numFilas: number, numColumnas: number, listaElementos?: ListaElemento[], listaEntidades?: ListaEntidad[], minSize?: [number, number]): Creador {
        return new CreadorDefault(numFilas, numColumnas, listaElementos, listaEntidades, minSize);
    }

    //Si cambia el número de filas actualiza los elementos para que se adecuen y el tamaño de las celdas
    onFilasChange(): void {
        let newHeight:number = this.listaFilas.length/this.numFilas;               
        if(newHeight>1){
            this.listaFilas.filter(f=>f.x >= this.numFilas).forEach(f=>{
                f.celdas.filter(c=>c.initElemento()).forEach(c=>{                    
                    c.elemento.entidades.forEach(ent=>ent.elemento=null);
                })
            })
            this.listaFilas = this.listaFilas.slice(0,this.numFilas);
             
            console.log(this.listaFilas);
            this.listaFilas.forEach(fila=>{
                fila.celdas.filter(cel=> cel.initElemento()).forEach(cel=>{
                    if(cel.elemento.x2>=this.numFilas-1){
                        cel.elemento.x2 = this.numFilas-1;
                        cel.elemento.celdas = cel.elemento.celdas.filter(c=>c[0].x<this.numFilas);
                        console.log(cel.elemento.celdas);
                        if(cel.elemento.celdas.length===0) cel.elemento.entidades.forEach(ent=> ent.elemento=null);
                    }
                })
            });
        }else if(newHeight<1){       
            let oldlen: number =this.listaFilas.length;       
            this.listaFilas[oldlen-1].celdas.filter(cel=>cel.elemento).forEach(cel=>{
                
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
        }
    }
    //Lo mismo con el numero de columnas
    onColumnasChange(): void{
        let newWidth:number = this.listaFilas[0].celdas.length/this.numColumnas;          
        if(newWidth>1){
            this.listaFilas.forEach(fila=>{
                fila.celdas.filter(c=>c.initElemento() && c.y >= this.numColumnas).forEach(c=>{                    
                    c.elemento.entidades.forEach(ent=>ent.elemento=null);
                })
                fila.celdas = fila.celdas.slice(0, this.numColumnas);
                fila.celdas.filter(cel=> cel.initElemento()).forEach(cel=>{
                    if(cel.elemento.y2>this.numColumnas-1){
                        cel.elemento.y2 = this.numColumnas-1;                        
                        cel.elemento.celdas.forEach((f, index)=>{ 
                                                       
                            cel.elemento.celdas[index] = f.filter(c=>c.y<this.numColumnas);                          
                        })
                        console.log(cel.elemento.celdas);
                        
                    }
                })
            });
        }else if(newWidth<1){
            
            let oldlen: number = this.listaFilas[0].celdas.length;
            this.listaFilas.forEach(fila=>{
                if(fila.celdas[oldlen-1].elemento){
                    
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
    
    //El constructor no realiza ninguna operacion extra
    constructor(numFilas:number, numColumnas:number, listaElementos?: ListaElemento[], listaEntidades?: ListaEntidad[], minSize?: [number, number]){
        super(numFilas, numColumnas, listaElementos, listaEntidades, minSize);
    }

    //Pone el tamaño de la pantalla al recibido
    setTotalSize(anchoTotal: number, altoTotal: number): void{
        this.sizePantalla[0]=anchoTotal;
        this.sizePantalla[1]=altoTotal;
    }

    //Pone el tamaño de las celdas al maximo entre el minSize y el recibido
    setSize(anchoCelda?:number, altoCelda?:number): void{        
        if (anchoCelda) this.sizeCelda[0]=anchoCelda;
        if (altoCelda) this.sizeCelda[1]=altoCelda;        
        if(this.listaFilas){            
            this.listaFilas.forEach(fila=>fila.celdas.forEach(cel=>{                                
                cel.ancho=Math.max(this.sizeCelda[0], this.minSize[0]);                               
                cel.alto=Math.max(this.sizeCelda[1], this.minSize[1]);
                /*PRUEBA PARA CAMBIAR TAMAÑOS 
                    if(cel.y===3) cel.ancho*=2;
                    if(cel.x===2) cel.alto*=1.8; 
                */
            }));
        }
    }


    //Inicializa las filas y celdas del tablero y les pone el tamaño
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

    //Actualiza el tamaño si suman más que el total de la pantalla para que no se pasen de largo
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