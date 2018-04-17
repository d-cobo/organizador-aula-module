import { Elemento } from "../../modelos/elemento";

export interface StartingPoint{
    arriba: number;
    izquierda: number;
    ancho: number;
    alto: number;
}

export interface ResizingElement{
    elem: Elemento;
    htmlElem: HTMLElement;
}

export enum Directions{
    ARRIBA = 0,
    ABAJO = 1,
    IZQUIERDA = 2,
    DERECHA = 3
}
