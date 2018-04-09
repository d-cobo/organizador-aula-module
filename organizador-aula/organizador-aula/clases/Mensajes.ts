export interface Mensaje{
    tipo: number;
    codigo: number;    
}

export enum MsgTipo{
    OK = 0,
    ERROR = -1,
    AVISO = -2
}

export enum MsgCodigo{
    CeldaOcupada=0 //Alguna de las celdas que intenta ocupar un elemento (en drop) esta ocupada
}