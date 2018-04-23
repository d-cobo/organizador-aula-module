export interface ListaElemento{
    nombre: string;
    id: string;
    color: string;
    maxEntidades?: number;
    ancho?: number;
    alto?: number;
    posiciones?: Array<Position>
  }
  
  export interface Position{
    xy: [number, number];
    xy2?: [number,number];  
  }

  export interface Coordenada{
      id?: string;
      x: number;
      y: number;
      x2?:number;
      y2?:number;
  }