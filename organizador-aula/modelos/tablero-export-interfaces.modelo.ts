import { ListaEntidad } from "../modelos/lista-entidad.modelo";
import { Elemento } from "../modelos/elemento.modelo";
import { ListaElemento } from "./lista-elemento.modelo";

//Para exportar el tablero con lo necesario: tamaño y listas de elementos y entidades
export interface ExportTablero{
    numFilas: number;
    numColumnas: number;
    listaElementos: ListaElemento[];
    listaEntidades: ListaEntidad[];
}