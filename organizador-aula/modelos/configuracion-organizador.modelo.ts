
//Opciones de configuracion para el módulo
export interface ConfiguracionOrganizador{
    filas?: number, //Numero de filas del tablero
    columnas?: number, //Numero de columnas del tablero
    minSize?: [number, number], //Tamaño minimo (ancho, alto) de las celdas
    //Los siguientes permisos por defecto serán falsos si no se especifican
    permisoElementos?: boolean, //Permiso para editar los elementos del tablero
    permisoEntidades?: boolean, //Permiso para editar las entidades del tablero
    permisoGuardar?: boolean, //Permiso para guardar los cambios del tablero 
    entidadSinElemento?: boolean, //Permiso para poner entidades sin elemento en el tablero 

    mostrarBarraSuperior?: boolean //Mostrar la barra de herramientas superior 
                                   //(por defecto se muestra)
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