export interface Mensaje{
    tipo: MsgTipo;
    codigo: MsgCodigo;    
}

export enum MsgTipo{
    OK = 0,
    ERROR = -1,
    AVISO = -2
}

export enum MsgCodigo{
    //ERRORES    
    CeldaOcupada=0, //Alguna de las celdas que intenta ocupar un elemento (en drop) esta ocupada
    ConfigOrCreadorNecesario=1,
    ErrorPermisos=2, //No se tiene los permisos necesarios

    //WARNINGS
    ConfirmacionEliminarTipoElemento = 3, //mensaje que pide una confirmacion sobre si eliminar un tipo de elemento

    //OK
    Cancelar = 4 //Se lanza cuando el usuario pulsa cancelar, usado para avisar a los componentes hijos
    
}