import { ListaElemento } from "./lista-elementos";
import { ListaEntidad } from "./lista-entidad";

export interface ConfiguracionOrganizador{
    filas: number,
    columnas: number,
    minSize?: [number, number],
    listaElementos?: ListaElemento[],
    listaEntidades?: ListaEntidad[],
    permisoElementos?: boolean,
    permisoEntidades?: boolean,
    permisoGuardar?: boolean,
    entidadSinElemento?: boolean
}