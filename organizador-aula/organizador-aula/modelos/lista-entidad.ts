export interface ListaEntidad{    
    atributo_titulo: string;
//    objetos: Object[];
    posicion?: [number, number];
    equals(entidad: Object);
    //sort(listaEntidad: ListaEntidad);
}
/*
export interface Posicion{
    id: any;
    pos: [number, number];
}*/