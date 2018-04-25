//Interfaz para las entidades que se reciben
export interface ListaEntidad{    
    atributo_titulo: string; //Atributo del objeto que se desea que sea 
    posicion?: [number, number]; //Posicion (fila, columna)
    equals(entidad: Object); //Funcion equals a implementar    
}
