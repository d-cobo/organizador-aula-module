import { Elemento } from "./elemento";
import { ListaEntidad } from "./lista-entidad";

export class Entidad{    
    objeto: ListaEntidad;
    elemento: Elemento;

    get titulo(): string{
        return this.objeto[this.objeto.atributo_titulo];
    }

    constructor(objeto:ListaEntidad, elemento?: Elemento){
        this.objeto=objeto;
        this.elemento = elemento;
    }
}