

export interface ConfiguracionOrganizador{
    filas: number,
    columnas: number,
    minSize?: [number, number],
    permisoElementos?: boolean,
    permisoEntidades?: boolean,
    permisoGuardar?: boolean,
    entidadSinElemento?: boolean,
    mostrarBarraSuperior?: boolean
}

export enum Botones{
    Elementos=0,
    Entidades=1,
    Visualizar=2,
    Cancelar=3,
    Guardar=4,
    Cambiar=5    
}