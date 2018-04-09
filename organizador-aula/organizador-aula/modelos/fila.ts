import { Celda } from "./celda";

export class Fila{
    x: number;
    celdas:Celda[] = [];    
    constructor(x: number){
        this.x=x;
    }
}