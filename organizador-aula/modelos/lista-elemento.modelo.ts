//Representa un tipo de elemento y sus posiciones iniciales
export interface ListaElemento{
    nombre: string;
    id: string;
    color: string;
    maxEntidades?: number;
    ancho?: number;
    alto?: number;
    posiciones?: Array<Position>
  }
  
  //xy: cuadrado superior izquierdo
  //xy2: cuadrado inferior derecho
  export interface Position{
    xy: [number, number];
    xy2?: [number,number];  
  }
