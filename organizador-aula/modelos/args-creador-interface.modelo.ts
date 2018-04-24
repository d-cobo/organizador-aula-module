import { ListaElemento } from "./lista-elemento.modelo";
import { ListaEntidad } from "./lista-entidad.modelo";

//argumenos para inicializar un Creador
export interface ArgsCreador{
    numFilas: number,
    numColumnas: number,
    listaElementos: ListaElemento[],
    listaEntidades: ListaEntidad[],
    minSize: [number, number]
}