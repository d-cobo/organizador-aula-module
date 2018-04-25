import { Fila } from "../modelos/fila.modelo";
import { Celda } from "../modelos/celda.modelo";
import { Elemento } from "../modelos/elemento.modelo";
import { ListaElemento } from "../modelos/lista-elemento.modelo";
import { ListaEntidad } from "../modelos/lista-entidad.modelo";

//Clase abstracta que se encarga de inicializar las celdas del tablero y actualizar el tamaño
export abstract class Creador{
    protected prNumFilas:number; //numero de filas
    protected prNumColumnas:number; //numero de columnas
    protected prListaElementos:ListaElemento[]; //lista de elementos inicial
    protected prListaEntidades:ListaEntidad[]; //lista de entidades inicial
    protected minSize: [number, number]; //tamaño minimo de celda
    protected listaFilas: Fila[]; //lista de filas (el tablero)    
    protected sizeCelda: [number, number]; //tamaño de una celda
    protected sizePantalla: [number, number]; //tamaño total de la pantalla para calculos
    
    //inicializa las propiedades
    constructor(numFilas:number, numColumnas:number,  listaElementos?: ListaElemento[], listaEntidades?: ListaEntidad[], minSize?: [number, number]){
       
        this.prNumFilas=numFilas;
        this.prNumColumnas=numColumnas;
        if(listaElementos){
            this.prListaElementos = listaElementos;
        }
        if(listaEntidades){
            this.prListaEntidades=listaEntidades;
        }
        this.minSize = minSize!=undefined ? minSize : [0, 0];
        this.sizeCelda= [0,0];
        this.sizePantalla = [0,0];        
    };

    
    //getters y setters
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

    get getMinSize(): [number, number]{
        return this.minSize;
    }

    get getListaFilas(): Fila[]{
        return this.listaFilas;
    }

    
    //funciones a implementar
    abstract nuevaInstancia(numFilas:number, numColumnas:number, listaElementos?: ListaElemento[], listaEntidades?: ListaEntidad[], minSize?: [number, number]): Creador;
    abstract onFilasChange(): void;
    abstract onColumnasChange(): void;
    abstract inicializarFilas(): void;
    abstract setSize(anchoCelda:number, altoCelda:number): void;    
    abstract setTotalSize(anchoTotal:number, altoTotal:number): void;        
}
