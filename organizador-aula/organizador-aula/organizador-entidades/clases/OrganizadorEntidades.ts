import { Organizador } from "../../utils/Organizador";
import { Entidad } from "../../modelos/entidad";
import { Elemento } from "../../modelos/elemento";
import { Celda } from "../../modelos/celda";

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
        if(!this.datos.listaEntidades) return;
        let elem: Elemento;
        this.datos.listaEntidades.forEach(lisEnt=>{            
            elem = null;
            if(lisEnt.posicion){
                let elem = this.listaFilas[lisEnt.posicion[0]].celdas[lisEnt.posicion[1]].elemento;
                if(elem){                
                    let ent = new Entidad(lisEnt, elem);
                    elem.entidades.push(ent);
                    this.datos.entidades.push(ent);
                }else if(this.datos.entSinElemento){
                    let elem: Elemento = new Elemento(true, "id_auto", "", "rgba(0,0,0,0)", 1);
                    let x = lisEnt.posicion[0];
                    let y = lisEnt.posicion[1];
                    elem.setPos(x,y,x,y);
                    let celda = this.listaFilas[x].celdas[y];
                    elem.celdas = [[celda]];
                    celda.elemento = elem;
                    let ent = new Entidad(lisEnt, elem);
                    elem.entidades.push(ent);
                    this.datos.entidades.push(ent);                    
                }else{
                    this.datos.entidades.push(new Entidad(lisEnt));    
                }
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
        if(draggedEntidad.elemento && draggedEntidad.elemento.id==="id_auto")
            draggedEntidad.elemento.celdas[0][0].elemento = null;
        else if(draggedEntidad.elemento)                            
            draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);            
        dropElemento.entidades.push(draggedEntidad);
        draggedEntidad.elemento = dropElemento;
    }

    dropOnToolbar(draggedEntidad: Entidad): void{
        if(draggedEntidad.elemento && draggedEntidad.elemento.id==="id_auto")
        draggedEntidad.elemento.celdas[0][0].elemento = null;

        if(!draggedEntidad.elemento) return;        
        draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);        
        
        draggedEntidad.elemento = null;
    }

    dropOnCell(draggedEntidad: Entidad, celda: Celda): void{
        if(draggedEntidad.elemento && draggedEntidad.elemento.id==="id_auto")
            draggedEntidad.elemento.celdas[0][0].elemento = null;
            
        else if(draggedEntidad.elemento)                            
            draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);            

        let elem: Elemento = new Elemento(true, "id_auto", "", "rgba(0,0,0,0)", 1);
        elem.setPos(celda.x, celda.y, celda.x, celda.y);
        elem.celdas = [[celda]];
        celda.elemento = elem;
        draggedEntidad.elemento = elem;
        elem.entidades = [draggedEntidad];
    }
}