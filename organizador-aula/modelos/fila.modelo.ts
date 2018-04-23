import { Celda } from "./celda.modelo";

export class Fila{
    x: number;
    celdas:Celda[];    

    constructor(x: number){
        this.celdas = [];
        this.x=x;
    }
}