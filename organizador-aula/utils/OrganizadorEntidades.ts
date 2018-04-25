import { Organizador } from "./organizador.util";
import { Elemento } from "../modelos/elemento.modelo";
import { Entidad } from "../modelos/entidad.modelo";
import { Celda } from "../modelos/celda.modelo";


export class OrganizadorEntidades extends Organizador{
    attrId: string;
    attrTitulo: string;

    //Inicializa las entidades si no lo están
    inicializar(): void{
    //    this.mostrarElementos();
        if(!this.datos.entidadesCreadas){
            this.initEntidades();
            this.datos.entidadesCreadas=true;
        }
    }

    //Por cada listaEntidad recibida, crea una nueva entidad y si tiene posición se la asigna al elemento
    //de esa posición
    initEntidades():void{
        if(!this.datos.listaEntidades) return;
        let elem: Elemento;
        this.datos.listaEntidades.forEach(lisEnt=>{            
            elem = null;
            if(lisEnt.posicion){
                let elem = this.listaFilas[lisEnt.posicion[0]].celdas[lisEnt.posicion[1]].elemento;
                if(elem){   //Si existe un elemento que esté en esa posición
                    let ent = new Entidad(lisEnt, elem);
                    elem.entidades.push(ent);
                    this.datos.entidades.push(ent);
                }else if(this.datos.entSinElemento){ //Si no existe pero tiene posición, si está activada la opción correspondiente,
                    let elem: Elemento = Elemento.getElementoVacio(); //crea un elemento vacío y se lo asigna
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

    //Entidades no asignadas
    getEntidadesSinPos(): Entidad[]{
        return this.datos.entidades.filter(ent => ent.elemento == null);
    }

    //Al caer sobre un elemento le asigna la entidad al elemento, si cabe
    dropOnElement(draggedEntidad: Entidad, dropElemento: Elemento): void{
        if(dropElemento.entidades.length>=dropElemento.maxEntidades) return;
        if(draggedEntidad.elemento && draggedEntidad.elemento.id==="id_auto")
            draggedEntidad.elemento.celdas[0][0].elemento = null;
        else if(draggedEntidad.elemento)                            
            draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);            
        dropElemento.entidades.push(draggedEntidad);
        draggedEntidad.elemento = dropElemento;
    }

    //Pone el elemento de la entidad a nulo para que se vuelva a la barra lateral
    dropOnToolbar(draggedEntidad: Entidad): void{
        if(draggedEntidad.elemento && draggedEntidad.elemento.id==="id_auto")
        draggedEntidad.elemento.celdas[0][0].elemento = null;

        if(!draggedEntidad.elemento) return;        
        draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);        
        
        draggedEntidad.elemento = null;
    }

    //Si está activada la opción de entidades sin elemento, al hacer drop de una entidad en una
    //celda se crea un elemento vacío y le asigna la entidad
    dropOnCell(draggedEntidad: Entidad, celda: Celda): void{
        if(draggedEntidad.elemento && draggedEntidad.elemento.id==="id_auto")
            draggedEntidad.elemento.celdas[0][0].elemento = null;
            
        else if(draggedEntidad.elemento)                            
            draggedEntidad.elemento.entidades.splice(draggedEntidad.elemento.getIndexEntidad(draggedEntidad), 1);            

        let elem: Elemento = Elemento.getElementoVacio();
        elem.setPos(celda.x, celda.y, celda.x, celda.y);
        elem.celdas = [[celda]];
        celda.elemento = elem;
        draggedEntidad.elemento = elem;
        elem.entidades = [draggedEntidad];
    }
}