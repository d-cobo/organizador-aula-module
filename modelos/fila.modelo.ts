import { Celda } from "./celda.modelo";

//Representa una fila de la tabla
export class Fila{
    x: number;
    celdas:Celda[];    

    constructor(x: number){
        this.celdas = [];
        this.x=x;
    }
}