//Representa un tipo de elemento y sus posiciones iniciales
export interface ListaElemento{
    nombre: string; //Nombre del elemento
    id: string; //id unica del elemento
    color: string; //color por defecto del elemento
    maxEntidades?: number; //maximo de entidades asignables (default: 1)
    ancho?: number; //columnas que ocupa el elemento al colocarlo (def: 1)
    alto?: number; //filas que ocupa el elemento al colocarlo (def: 1)
    posiciones?: Array<Position> //Posiciones en las que está este tipo de elemento
  }
  
  //xy: cuadrado superior izquierdo
  //xy2: cuadrado inferior derecho
  export interface Position{
    xy: [number, number];
    xy2?: [number,number];  
  }
