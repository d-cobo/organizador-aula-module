import { Elemento } from "./elemento";
import { ListaEntidad } from "./lista-entidad";

export class Entidad{    
    get titulo(): string{
        return this.objeto[this.objeto.atributo_titulo];
    }
    objeto: ListaEntidad;
    elemento: Elemento;
    constructor(objeto:ListaEntidad, elemento?: Elemento){
        this.objeto=objeto;
        this.elemento = elemento;
    }
}