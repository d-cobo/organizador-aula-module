import { Organizador } from "../../utils/Organizador";
import { Entidad } from "../../modelos/entidad";
import { Elemento } from "../../modelos/elemento";

export class OrganizadorEntidades extends Organizador{
    attrId: string;
    attrTitulo: string;

    inicializar(): void{
    //    this.mostrarElementos();
        if(!this.datos.entidadesCreadas){
            this.initEntidades();
            this.datos.entidadesCreadas=true;
        }
    }

    initEntidades():void{
        let elem: Elemento;
        this.datos.listaEntidades.forEach(lisEnt=>{            
            elem = null;
            if(lisEnt.posicion){
                let elem = this.listaFilas[lisEnt.posicion[0]].celdas[lisEnt.posicion[1]].elemento;                
                let ent = new Entidad(lisEnt, elem);
                elem.entidades.push(ent);
                this.datos.entidades.push(ent);
            }else{
                this.datos.entidades.push(new Entidad(lisEnt));
            }
                
        })
        
    }

    getEntidadesSinPos(): Entidad[]{
        return this.datos.entidades.filter(ent => ent.elemento == null);
    }

    dropOnElement(draggedEntidad: Entidad, dropElemento: Elemento): void{
        if(dropElemento.entidades.length>=dropElemento.maxEntidades) return;
        if(draggedEntidad.elemento)            
            draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);            
        dropElemento.entidades.push(draggedEntidad);
        draggedEntidad.elemento = dropElemento;
    }

    dropOnToolbar(draggedEntidad: Entidad): void{
        console.log(draggedEntidad);
        if(!draggedEntidad.elemento) return;
        console.log(draggedEntidad.elemento.getIndexEntidad(draggedEntidad));
        draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);        
        
        draggedEntidad.elemento = null;
    }
}