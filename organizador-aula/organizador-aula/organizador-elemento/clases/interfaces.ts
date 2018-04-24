import { Elemento } from "../../../modelos/elemento.modelo";

//Punto inicial para el resize
export interface StartingPoint{
    arriba: number;
    izquierda: number;
    ancho: number;
    alto: number;
}

//Elemento que se está cambiando de tamaño
export interface ResizingElement{
    elem: Elemento;
    htmlElem: HTMLElement;
}

//Direciones del resize
export enum Directions{
    ARRIBA = 0,
    ABAJO = 1,
    IZQUIERDA = 2,
    DERECHA = 3
}
