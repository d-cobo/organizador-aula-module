import { ListaEntidad } from "../modelos/lista-entidad.modelo";
import { Elemento } from "../modelos/elemento.modelo";
import { ListaElemento } from "./lista-elemento.modelo";



export interface ExportElemento{
    x: number;
    y: number;
    x2:number;
    y2:number;    
    id:string;   
    maxEntidades: number;
    nombre: string;
    color:string; 
}

export interface ExportEntidad{
    objeto: ListaEntidad;
    elemento: ExportElemento;
}

export interface ExportTablero{
    numFilas: number;
    numColumnas: number;
    /*elementos: ExportElemento[];
    entidades: ExportEntidad[];*/
    listaElementos: ListaElemento[];
    listaEntidades: ListaEntidad[];
}