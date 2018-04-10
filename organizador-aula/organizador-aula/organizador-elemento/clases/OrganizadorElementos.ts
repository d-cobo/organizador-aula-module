import { Organizador } from "../../clases/Organizador";
import { Fila } from "../../modelos/fila";
import { Elemento } from "../../modelos/elemento";
import { ElementRef } from "@angular/core";
import { Celda } from "../../modelos/celda";
import { Coordenada } from "../../modelos/lista-elementos";
import { MsgTipo } from "../../clases/Mensajes";

export class OrganizadorElementos extends Organizador{


    inicializar():void{        
      if(!this.datos.listaFilas){
        this.datos.inicializarFilas();
        this.initElementos();
        this.comprobarResizeElementos();
      }
    }


    initElementos(): void{
      
        this.datos.listaElementos.forEach( (lisElem) => {   
            if(!lisElem.ancho) lisElem.ancho = 1;
            if(!lisElem.alto) lisElem.alto = 1;    
            if(!lisElem.maxEntidades) lisElem.maxEntidades=1;        
            if(lisElem.posiciones){
              lisElem.posiciones.forEach((pos) => {
                  if(!pos.xy2){
                    pos.xy2=pos.xy;
                  }              
                  //let elemento: Elemento = this.getElemento(pos.xy[0], pos.xy[1]); 
                  let elemento:Elemento = new Elemento();
                  elemento.setPos(pos.xy[0], pos.xy[1],pos.xy2[0], pos.xy2[1]);      
                  this.setCeldasOcupadas(elemento); 
                  elemento.activo=true;                
                  elemento.id = lisElem.id;
                  elemento.nombre = lisElem.nombre;
                  elemento.color = lisElem.color;   
                  elemento.maxEntidades = lisElem.maxEntidades;
                      
                  
              });
            }
        });
      }

      comprobarResizeElementos(): void{       
        this.listaFilas.forEach(fila=>{
          fila.celdas.filter(c=>c.initElemento()).forEach(cel=>{
            this.comprobarResize(cel.elemento);
          })
        })    
      }

      comprobarResize(elem: Elemento): void{
    
        elem.resizeRight=true;
        if(!this.listaFilas[elem.x].celdas[elem.y+1]){  //   elem.y$1==$2his.datos.columnas-1){
          elem.resizeRight=false;
        }else{
          for(let fila=elem.x;fila<=elem.x2;fila++){
            if(this.celdaOcupada(fila, elem.y2+1)){
              
              elem.resizeRight=false;
            }
          }
        }
    
        elem.resizeDown=true;
        if(!this.listaFilas[elem.x+1]){
          elem.resizeDown=false;
        }else{
          for(let col=elem.y;col<=elem.y2;col++){
            if(this.celdaOcupada(elem.x2+1,col)){
              elem.resizeDown=false;
            }
          }
        }
    }

    setCeldasOcupadas (elemento: Elemento): void{
        elemento.celdas=[];
        for(let fila=elemento.x;fila<=elemento.x2;fila++){
          let cel: number = elemento.celdas.push([]) - 1;
          for(let col=elemento.y;col<=elemento.y2;col++){        
            this.listaFilas[fila].celdas[col].elemento= elemento;
            elemento.celdas[cel].push(this.listaFilas[fila].celdas[col]);
          }
        }
        
    }
      
  celdaOcupada(x:number, y:number, elem: Elemento=null): boolean{
    //No comprobar la casilla actual   
    if(!this.listaFilas[x] || !this.listaFilas[x].celdas[y]) return true;

    return (this.listaFilas[x].celdas[y].elemento && this.listaFilas[x].celdas[y].elemento!=elem);
  }

  cambiarReferencias(elem: Elemento, coords: number[][]):void{
    let elemCoords: number[][] = elem.getCoorCeldas();
    coords.forEach(coor=>{
        if(!(elemCoords.find(el=> el[0]==coor[0] && el[1]==coor[1]))){
          this.listaFilas[coor[0]].celdas[coor[1]].elemento = null;
        }
    })
    
  }

  getElemento(x:number, y:number): Elemento{
    return this.listaFilas[x].celdas[y].elemento;
  }


  removeElement(celda: Celda){
    
    if(celda.elemento.entidades){      
      celda.elemento.entidades.forEach(ent=>{ent.elemento=null});
    }
    celda.elemento.getCoorCeldas().forEach(pos=>{
      this.listaFilas[pos[0]].celdas[pos[1]].elemento=null;
      //this.elementos = this.elementos.filter(el=>el.x != pos[0] || el.y != pos[1])
    })    
    //Y comprobamos de nuevo los resizes
    this.comprobarResizeElementos();    
  }


  resizeHorizontal(elem: Elemento, dir: number):void{
    elem.y2+=dir;
    //Ampliando hacia la derecha
    if(dir<0){
      for(let fila=elem.x;fila<=elem.x2;fila++){
        this.listaFilas[fila].celdas[elem.y2-dir].elemento = null;
        
      }
    }
    this.setCeldasOcupadas(elem);
    this.comprobarResizeElementos();
    //this.comprobarResize(this.coords[index], div);
  }

  resizeVertical(elem: Elemento, dir: number):void{
    elem.x2+=dir;
    //Ampliando hacia abajo
    if(dir<0){
      for(let col=elem.y;col<=elem.y2;col++){
        this.listaFilas[elem.x2-dir].celdas[col].elemento = null;
      }
    }
    this.setCeldasOcupadas(elem);
    this.comprobarResizeElementos();
    //this.comprobarResize(this.coords[index], div);
  }


  drop(cel: Celda, draggedCelda: Celda, clickedCelda: Celda): number{    
    
    let coord: Coordenada = null;
    //Si estas moviendo un elemento de la barra izquierda a una casilla ocupada return
    let posx: number;
    let posy: number;
    if(cel.elemento && !draggedCelda.elemento.activo) return MsgTipo.ERROR;            
    let coor: any = null;    
    if(!draggedCelda.elemento.activo){
      posx=cel.x;
      posy= cel.y;
      //draggedCelda.elemento.setPos(cel.x, cel.y, draggedCelda.elemento.getAncho, cel.y);      
    }else{            
      //this.setCeldasOcupadas(this.draggedCelda.elemento.getPos(), true);
      coor = draggedCelda.elemento.getCoorCeldas();
      posx=draggedCelda.elemento.x + (cel.x - clickedCelda.x);
      posy= draggedCelda.elemento.y + (cel.y - clickedCelda.y);

    }
    let posx2:number = posx+draggedCelda.elemento.getAlto();
    let posy2: number =  posy+draggedCelda.elemento.getAncho();
    for(let fila=posx;fila<=posx2;fila++){
      for(let col=posy; col<=posy2; col++){          
        if(this.celdaOcupada(fila,col,draggedCelda.elemento)) return MsgTipo.ERROR;
      }
    }
    draggedCelda.elemento.setPos(
      posx,
      posy,
      posx2,
      posy2);
    
    this.setCeldasOcupadas(draggedCelda.elemento);        
    draggedCelda.elemento.activo = true;    
    //Despues de todo hay que volver a comprobar los resizes de los elementos
    if(coor){
      this.cambiarReferencias(draggedCelda.elemento, coor);
    }
    this.comprobarResizeElementos();    
    //console.log(this.listaFilas);    
    return MsgTipo.OK;
  }

  getClickedCelda(celdaInicial: Celda, posX: number, posY: number): Celda{
    let fila: Fila = this.getClickedFila(celdaInicial, posY);
    let ind = celdaInicial.y;
    while(posX>0){
      posX-=fila.celdas[ind].ancho;
      ind++;
    }    
    //console.log(fila.celdas[ind-1]);
    return fila.celdas[ind-1];

  }

  getClickedFila(celda: Celda, posY: number): Fila{
    let ind = celda.x;    
    while(posY>0){
      posY-=this.datos.listaFilas[ind].celdas[celda.y].alto;
      ind++;
    }
    return this.datos.listaFilas[ind-1];
  }
  
}