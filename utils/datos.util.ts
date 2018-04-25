import { Creador } from "./creador.util";
import { Fila } from "../modelos/fila.modelo";
import { Elemento } from "../modelos/elemento.modelo";
import { ListaElemento } from "../modelos/lista-elemento.modelo";
import { ListaEntidad } from "../modelos/lista-entidad.modelo";
import { Entidad } from "../modelos/entidad.modelo";

//Tiene todos los datos necesarios para la aplicación
export class Datos{
    private creador: Creador; //el creador usado que contiene los datos del tablero
    entSinElemento: boolean; //opcion para permitir entidades sin elementos    
    entidadesCreadas: boolean; //indica si las entidades ya han sido inicializadas o no
    entidades: Entidad[]; //Guarda la lista de entidades; necesario porque puede haber algunas que
                         //no estén en el tablero y asi pues no las tenga el creador

    
    constructor(creador: Creador, entSinElemento?: boolean){
        this.entidadesCreadas = false;
        this.entidades = [];
        this.creador = creador;   
        this.entSinElemento = entSinElemento;     
    }


    set filas(filas:number){        
        this.creador.numFilas = filas;
    }
    get filas():number{
        return this.creador.numFilas;
    }

    set columnas(columnas:number){        
        this.creador.numColumnas = columnas;
    }
    get columnas():number{
        return this.creador.numColumnas;
    }

    get listaElementos(): ListaElemento[]{
        return this.creador.listaElementos;
    }

    set listaElementos(listaElementos: ListaElemento[]){
        this.creador.listaElementos = listaElementos;
    }

    get listaEntidades(): ListaEntidad[]{
        return this.creador.listaEntidades;
    }

    get listaFilas(): Fila[]{
        return this.creador.getListaFilas;
    }

    
    get sizeCelda(): [number, number]{
        return this.creador.size;
    }

    set sizeCelda(size: [number, number]){
        this.creador.setSize(size[0], size[1]);
    }
    
    get minSize(): [number, number]{
        return this.creador.getMinSize;
    }

    set sizeTotal(size: [number, number]){
        this.creador.setTotalSize(size[0], size[1]);
    }

    inicializarFilas(): void{
        this.creador.inicializarFilas();
    }
}