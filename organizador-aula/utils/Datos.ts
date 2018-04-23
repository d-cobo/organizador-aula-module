import { Creador } from "./Creador";
import { Fila } from "../modelos/fila";
import { Elemento } from "../modelos/elemento";
import { ListaElemento } from "../modelos/lista-elementos";
import { ListaEntidad } from "../modelos/lista-entidad";
import { Entidad } from "../modelos/entidad";

export class Datos{
    //todo echar un ojo a creador
    private creador: Creador;
    entSinElemento: boolean;
    //listaFilas: Fila[];
    entidadesCreadas: boolean;
    entidades: Entidad[];     

    
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
        return this.creador.listaFilas;
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