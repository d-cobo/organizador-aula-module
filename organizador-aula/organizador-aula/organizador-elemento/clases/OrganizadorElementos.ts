import { Organizador } from "../../../utils/Organizador";
import { Fila } from "../../../modelos/fila.modelo";
import { Elemento } from "../../../modelos/elemento.modelo";
import { ElementRef } from "@angular/core";
import { Celda } from "../../../modelos/celda.modelo";
import { Coordenada } from "../../../modelos/lista-elemento.modelo";
import { MsgTipo } from "../../../modelos/mensajes.modelo";
import { StartingPoint, Directions } from "./interfaces";
import { EventosOrgAulaService } from "../../../eventos-org-aula.service";

export class OrganizadorElementos extends Organizador{
//todo que es privado y que no

    inicializar():void{        
      if(!this.datos.listaFilas){
        this.datos.inicializarFilas();
        this.initElementos();

      }
    }


    initElementos(): void{
      if(!this.datos.listaElementos){
        return;
      }
      this.datos.listaElementos.forEach( (lisElem) => {   
        if(!lisElem.ancho) lisElem.ancho = 1;
        if(!lisElem.alto) lisElem.alto = 1;    
        if(!lisElem.maxEntidades) lisElem.maxEntidades=1;        
        if(lisElem.posiciones){
          lisElem.posiciones.forEach((pos) => {
              if(!pos.xy2){
                pos.xy2 = [pos.xy[0]+(lisElem.alto-1), pos.xy[1]+(lisElem.ancho-1)];
              }              
              //let elemento: Elemento = this.getElemento(pos.xy[0], pos.xy[1]); 
              let elemento:Elemento = new Elemento(true, lisElem.id, lisElem.nombre, lisElem.color, lisElem.maxEntidades);
              elemento.setPos(pos.xy[0], pos.xy[1],pos.xy2[0], pos.xy2[1]);      
              this.setCeldasOcupadas(elemento);                   
          });
        }
      });
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
    //Si la casilla está fuera del tablero retorna que está ocupada    
    if(!this.listaFilas[x] || !this.listaFilas[x].celdas[y]) return true;

    return (this.listaFilas[x].celdas[y].elemento && this.listaFilas[x].celdas[y].elemento!=elem);
  }

  cambiarReferencias(elem: Elemento, coords: number[][]):void{
    let elemCoords: number[][] = elem.getCoorCeldas();
    coords.forEach(coor=>{
        if(!(elemCoords.find(el=> el[0]==coor[0] && el[1]==coor[1]))){
          this.listaFilas[coor[0]].celdas[coor[1]].elemento = null;
        }
    });    
  }

  getElemento(x:number, y:number): Elemento{
    return this.listaFilas[x].celdas[y].elemento;
  }


  removeElement(elemento: Elemento): void{
    
    elemento.celdas.forEach(fila=>fila.forEach(celda=>{
      celda.elemento=null;
    }));      

    if(elemento.entidades){      
      elemento.entidades.forEach(ent=>{ent.elemento=null});
      if(this.datos.entSinElemento){
        let elem: Elemento = Elemento.getElementoVacio();
        console.log(elem);
        elem.setPos(elemento.x, elemento.y, elemento.x, elemento.y);
        
        elemento.entidades[0].elemento = elem;
        elemento.celdas[0][0].elemento = elem;
        elem.celdas=[[elemento.celdas[0][0]]];
        elem.entidades=[elemento.entidades[0]];
      }
    }

    
  }



  drop(cel: Celda, draggedCelda: Celda, clickedCelda: Celda): number{    
    
    let coord: Coordenada = null;
    //Si estas moviendo un elemento de la barra izquierda a una casilla ocupada return
    let posx: number;
    let posy: number;
    
    if(cel.elemento && cel.elemento.id=="id_auto" && (!draggedCelda.elemento.entidades || draggedCelda.elemento.entidades.length==0)){
      cel.elemento.entidades[0].elemento = draggedCelda.elemento;
      draggedCelda.elemento.entidades = cel.elemento.entidades;
      cel.elemento = draggedCelda.elemento;
      
    }else{
      if(cel.elemento && !draggedCelda.elemento.activo) return MsgTipo.ERROR;            
    }
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
    let posx2:number = posx+draggedCelda.elemento.x2 - draggedCelda.elemento.x;
    let posy2: number =  posy+draggedCelda.elemento.y2 - draggedCelda.elemento.y;    
    if(this.celdasOcupadas(posx, posx2, posy, posy2, draggedCelda.elemento)) return MsgTipo.ERROR;      
    draggedCelda.elemento.setPos(
      posx,
      posy,
      posx2,
      posy2);
    
    this.setCeldasOcupadas(draggedCelda.elemento);        
    draggedCelda.elemento.activo = true;    
    //Si lo estás moviendo desde otro sitio
    if(coor){
      //pone las referencias elemento de las celdas que ya no lo contienen a null
      this.cambiarReferencias(draggedCelda.elemento, coor);
    }
  
    console.log(this.listaFilas);    
    return MsgTipo.OK;
  }

  celdasOcupadas(x: number,x2: number,y: number,y2: number, elem: Elemento): boolean{
    for(let fila=x;fila<=x2;fila++){
      for(let col=y; col<=y2; col++){          
        if(this.celdaOcupada(fila,col,elem)) return true;
      }
    }
    return false;
  }

  //Obtiene la celda actual en función de donde se ha clicado o donde está el ratón
  getClickedCelda(celdaInicial: Celda, posX: number, posY: number): Celda{
    
    //obtiene la fila sobre la que estás  
    let fila: Fila = this.getClickedFila(celdaInicial, posY);

    //Si es una fila auxiliar la devuelve
    if(!fila.celdas[0].ancho) return fila.celdas[0];

    //Si no calcula la celda en la que está de forma analoga a la funcion getClickedFila comentada abajo
    let ind: number = celdaInicial.y;
    
    if(posX>0){
      while(posX>0){
        posX-=fila.celdas[ind].ancho;
        ind++;
      }    
      ind--;
    }else if(posX<0){
      while(posX<0){
        posX+=fila.celdas[ind].ancho;
        ind--;
      }          
    }
    
    if(ind < 0){
      return new Celda(0, -1);            
    }else if(ind >= fila.celdas.length){      
      return new Celda(0,fila.celdas.length);      
    }
    else
      return fila.celdas[ind];
    

  }
  //Obtiene la fila actual
  getClickedFila(celda: Celda, posY: number): Fila{
    let ind = celda.x;    
    //posY es la diferencia desde el punto inicial de referencia al actual. Se va sumando/restando
    //el alto de la fila mientras haya diferencia hasta llegar a la actual
    if(posY>0){
      while(posY>0){                
        posY-=this.datos.listaFilas[ind].celdas[celda.y].alto;                
        ind++;
      }
      ind--;
    }else if(posY<0){
      while(posY<0){
        posY+=this.datos.listaFilas[ind].celdas[celda.y].alto;
        ind--;
      }
      
    }
    
    //Si la celda está fuera del tablero devuelve una fila auxiliar con una celda.x = -1 o length
    if(ind < 0){
      let auxFila = new Fila(0);
      auxFila.celdas.push(new Celda(-1,0));
      return auxFila;
    }else if(ind >= this.datos.listaFilas.length){
      let auxFila = new Fila(0);
      auxFila.celdas.push(new Celda(this.datos.listaFilas.length,0));
      return auxFila;
    }
    else
      return this.datos.listaFilas[ind];
  }

  
  resize(elem: Elemento, htmlElem: HTMLElement, resizeDir: number,
    startingPoint: StartingPoint, event: MouseEvent): void
  {
    let celdaActual: Celda;    
     //ARRIBA
    if(resizeDir==Directions.ARRIBA){
      try{
        celdaActual = this.getClickedCelda(elem.celdas[0][0],  0, event.clientY - startingPoint.arriba);
      }catch{
        celdaActual=elem.celdas[0][0];
      }
      let difX: number;
      let posx = celdaActual.x;
      if(posx > elem.x2){        
        posx = elem.x2;
      }      
      difX = posx - elem.x;
    
      if(difX>0){        
        for(let fila=0; fila<difX; fila++){
          elem.celdas[fila].forEach(c=>c.elemento=null);
        }
      }else if(difX<0){
        if(this.celdasOcupadas(posx, elem.x2, elem.y, elem.y2, elem)){          
          posx=elem.x;
          difX=0;
        }
      }
      elem.x = posx;                       
      if(difX==0){
        this.setDefaultStyle(elem, htmlElem);       
      }
      
      
    }
    //ABAJO
    else if(resizeDir==Directions.ABAJO){
      let celdaInicial: Celda = elem.celdas[elem.celdas.length-1][0];        
      let posx2:number; 
    //  try{
        celdaActual = this.getClickedCelda(celdaInicial,  0, event.clientY - startingPoint.arriba);
        posx2 = celdaActual.x+1;      
        console.log("try", posx2);
    //  }catch{
      //   posx2 = elem.x2;
      //   console.log("ca", posx2);
      // }      
      
      if(posx2 < elem.x){        
        posx2 = elem.x;
      }   
      let difX: number = elem.x2 - posx2;
      if(difX>0){
        let ind: number = elem.celdas.length-1;
        for(let fila=ind; fila>=ind-difX; fila--){
          console.log(fila, elem.celdas);
          elem.celdas[fila].forEach(c=>c.elemento=null);
        }
      }else if(difX<0){
        if(this.celdasOcupadas(elem.x, posx2, elem.y, elem.y2, elem)){          
          posx2=elem.x2;
          difX=0;
        }
      }
      elem.x2 = posx2; 
      if(difX==0){
        this.setDefaultStyle(elem, htmlElem);      
      }
    } 
    //IZQUIERDA
    else if(resizeDir==Directions.IZQUIERDA){
      try{
        celdaActual = this.getClickedCelda(elem.celdas[0][0],  event.clientX - startingPoint.izquierda, 0);
      }catch{
        celdaActual=elem.celdas[0][0];
      }
      console.log(celdaActual);
      let difY: number;
      let posy = celdaActual.y;
      if(posy > elem.y2){        
        posy = elem.y2;
      }      
      difY = posy - elem.y;

    // let difY: number = cel.y - elem.y;
      if(difY>0){        
        elem.celdas.forEach(f=>{
          for(let celda=0; celda<difY; celda++){
            f[celda].elemento=null;
          }
        });
      }else if(difY<0){
        if(this.celdasOcupadas(elem.x, elem.x2, posy, elem.y2, elem)){          
          posy=elem.y;
          difY=0;
        }
      }

      elem.y = posy;
      if(difY==0){
        this.setDefaultStyle(elem, htmlElem);
      }
    }  
    //DERECHA
    else if(resizeDir==Directions.DERECHA){
      let celdaInicial: Celda = elem.celdas[0][elem.celdas[0].length-1];        
      let posy2:number; 
      try{
        celdaActual = this.getClickedCelda(celdaInicial,  event.clientX - startingPoint.izquierda, 0);
        posy2 = celdaActual.y+1;      
      }catch{
        posy2 = elem.y2;
      }      
      
      if(posy2 < elem.y){        
        posy2 = elem.y;
      }   
      let difY: number = elem.y2 - posy2;
      if(difY>0){
        let ind: number = elem.celdas[0].length-1;
        elem.celdas.forEach(f=>{
          for(let celda=ind; celda>=ind-difY; celda--){            
            f[celda].elemento=null;
          }
        })        
      }else if(difY<0){
        if(this.celdasOcupadas(elem.x, elem.x2, elem.y, posy2, elem)){          
          posy2=elem.y2;
          difY=0;
        }
      }
      elem.y2 = posy2; 
      if(difY==0){
        this.setDefaultStyle(elem, htmlElem);      
      }
    }       

    //FINAL
    this.setCeldasOcupadas(elem);     
    elem = null;
  }

  //Pone el estilo que debe tener al elemento en caso de que no se haya resizeado (no coge auto.
  //el ngStyle)
  setDefaultStyle(elem: Elemento, target: HTMLElement): void{
    target.style.top="0px";
    target.style.left="0px";
    target.style.width= elem.getAnchoPx();
    target.style.height = elem.getAltoPx();  
  }

  removeElementType(id: string): void {
    this.listaFilas.forEach(f=>
      f.celdas.filter(c=>c.initElemento() && c.elemento.id===id).forEach(c=>{
        this.removeElement(c.elemento);
      })
    );
    this.datos.listaElementos = this.datos.listaElementos.filter(el => el.id!==id);
  }
  
}