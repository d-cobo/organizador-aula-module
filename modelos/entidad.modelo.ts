import { Elemento } from "./elemento.modelo";
import { ListaEntidad } from "./lista-entidad.modelo";

//Representa a cada entidad
export class Entidad{    
    //un objeto que implementa la interfaz ListaEntidad
    objeto: ListaEntidad;
    //El elemento al que esta asignada
    elemento: Elemento;

    //Devuelve el valor de la propiedad del objeto asignada como titulo
    get titulo(): string{
        return this.objeto[this.objeto.atributo_titulo];
    }

    constructor(objeto:ListaEntidad, elemento?: Elemento){
        this.objeto=objeto;
        this.elemento = elemento;
    }
}