export interface ListaEntidad{    
    atributo_titulo: string;
    posicion?: [number, number];
    equals(entidad: Object);
    //sort(listaEntidad: ListaEntidad);
}
