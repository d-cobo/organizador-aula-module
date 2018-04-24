
//Opciones de configuracion para el módulo
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

//Numeración de los botones de cambio de pantalla / tamaño / cancelar guardar
export enum Botones{
    Elementos=0,
    Entidades=1,
    Visualizar=2,
    Cancelar=3,
    Guardar=4,
    Cambiar=5    
}