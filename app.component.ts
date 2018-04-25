import { Component, OnInit, EventEmitter } from '@angular/core';
import { Creador } from './organizador-aula/utils/creador.util';
import { OrganizadorAulaComponent } from './organizador-aula/organizador-aula/organizador-aula.component';
import { ListaEntidad } from './organizador-aula/modelos/lista-entidad.modelo';
import { MsgTipo, Mensaje, MsgCodigo } from './organizador-aula/modelos/mensajes.modelo';
import { EventosOrgAulaService } from './organizador-aula/eventos-org-aula.service';
import { Subscription } from 'rxjs/Subscription';
import { ListaElemento } from './organizador-aula/modelos/lista-elemento.modelo';
import { ExportTablero } from './organizador-aula/modelos/tablero-export-interfaces.modelo';
import { ConfiguracionOrganizador, Botones } from './organizador-aula/modelos/configuracion-organizador.modelo';
import { Fila } from './organizador-aula/modelos/fila.modelo';
import { Celda } from './organizador-aula/modelos/celda.modelo';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  title = 'Ejemplo org aulas';
  columnas: number;
  filas: number;
  listaElementos: ListaElemento[];
  listaEntidades: ListaEntidad [];  
  mensajeSubscription: Subscription;
  entidadSubscription: Subscription;
  config: ConfiguracionOrganizador;  
  creador: Creador;
 
readonly btnElementos = Botones.Elementos;
readonly btnEntidades = Botones.Entidades;
readonly btnVisualizar = Botones.Visualizar;
readonly btnGuardar = Botones.Guardar;
readonly btnCancelar = Botones.Cancelar;

  constructor(private eventos: EventosOrgAulaService){}

  ngOnInit(){    
    //num filas y columnas
    this.filas = 7;
    this.columnas = 7;

    //Suscripciones a los eventos que se reciben del modulo 
    this.mensajeSubscription = this.eventos.mensajes.subscribe(mens=>this.onMensaje(mens));
    this.entidadSubscription = this.eventos.clickEntidad.subscribe(ent=>this.mostrarAlumno(ent));

    //La lista de elementos iniciales al módulo. Las posiciones son OPCIONALES, aunque
    //en este ejemplo todos los elementos tengan posiciones.
    this.listaElementos = [
      {
        nombre: 'Mesa',
        id: 'idmesa',
        maxEntidades: 2,
        color: '#cf7f07',
        posiciones: [          
          { xy: [2,0] },
          { xy: [2,2] },
          { xy: [2,4] },
          { xy: [2,6] },
          { xy: [4,0] },
          { xy: [4,2] },
          { xy: [4,4] },
          { xy: [4,6] },
          { xy: [6,0] },
          { xy: [6,2] },
          { xy: [6,4] },
          { xy: [6,6] }          
        ]
      },
      {
        nombre: 'Mesa profesor',
        id: 'idmesaprof',
        color: 'gray',
        posiciones: [
          {
            xy: [0,0],
            xy2: [0, 2]
          }          
        ]
      },
      {
        nombre: 'Pizarra',
        id: 'idpizarra',
        color: 'green',
        ancho: 4,
        posiciones: [
          {
            xy: [0,3]
          }
        ]
      }      
    ];

    //La lista de alumnos que implementan la interfaz ListaEntidad (la clase está
    //definida más abajo)
    let alumnos: AlumnoEnt[] = [];
    alumnos.push(new AlumnoEnt('12345678A', 'Pepe', 'Come mucho'));       
    alumnos.push(new AlumnoEnt('12345678A', 'Pepita', 'Se pelea con pepete'));        
    alumnos.push(new AlumnoEnt('82654321A', 'Pepete', 'otro 3'));
    alumnos.push(new AlumnoEnt('72654321A', 'Carla', 'otro 4'));   
    alumnos.push(new AlumnoEnt('62654321A', 'Josean', 'otro 5'));      
    alumnos.push(new AlumnoEnt('22654521A', 'Lucia', 'otro 6')); 
    alumnos.push(new AlumnoEnt('52654323A', 'Alvaro', 'otro 7'));
    alumnos.push(new AlumnoEnt('35654323A', 'Manolo', 'otro 8')); 
    alumnos.push(new AlumnoEnt('54654323A', 'Lola', 'otro 9'));   
    alumnos.push(new AlumnoEnt('11654323A', 'Sara', 'otro 10'));  
    alumnos.push(new AlumnoEnt('19654323A', 'Josetxo', 'otro 11'));    
    alumnos.push(new AlumnoEnt('75654323A', 'Rubén', 'otro 12'));   
    alumnos.push(new AlumnoEnt('81654323A', 'Arana', 'otro 13')); 
    alumnos.push(new AlumnoEnt('19654323A', 'Moisés', 'otro 14')); 
    alumnos.push(new AlumnoEnt('19654323A', 'Raúl', 'otro 15')); 
    alumnos[0].posicion = [2,0];    
    alumnos[1].posicion = [2,2];    
    alumnos[2].posicion = [2,4];     
    alumnos[3].posicion = [2,6];     
    alumnos[4].posicion = [4,0];       
    alumnos[5].posicion = [4,2];               
    alumnos[6].posicion = [4,4];           
    alumnos[7].posicion = [4,6];         
    alumnos[8].posicion = [6,0];           
    alumnos[9].posicion = [6,2];        
    alumnos[10].posicion = [6,4];         
    alumnos[11].posicion = [6,6];
    this.listaEntidades= alumnos;
    
    // Podemos usar nuestra propia implementación de la clase Creador (CreadorPropio).
    //Si no pasamos este parámetro, se usará la clase CreadorDefault.
    this.creador = new CreadorPropio(this.filas, this.columnas, this.listaElementos, this.listaEntidades, [100, 100]);     

    //La configuracion del modulo. Obligatoria si no se usa una implementación propia de
    //Creador
    this.config = {
      filas: this.filas,       //Obligatorio filas y columnas si NO se usa implementacion propia de Creador
      columnas: this.columnas, //En caso contrario estos dos parámetros son inncesarios e inútiles
      minSize: [70, 20], //ancho x alto
      permisoElementos: true,
      permisoEntidades: true,
      permisoGuardar: true,
      entidadSinElemento: true
    }
  }

  //Destruir las suscripciones
  ngOnDestroy(){
    this.mensajeSubscription.unsubscribe();
    this.entidadSubscription.unsubscribe();
  }


  mostrarAlumno(event: AlumnoEnt){
    console.log("Datos del alumno", event);
  }

  //Al recibir un mensaje itera por los tipos y códigos para saber cual ha recibido
  //y actua de manera acorde
  onMensaje(event: Mensaje){
    if(event.tipo === MsgTipo.AVISO) {
      console.log("WARNING");
      switch(event.codigo){
        case MsgCodigo.ConfirmacionEliminarTipoElemento:
          console.log("¿Seguro que quieres eliminar? ");
          if(confirm("Eliminar?")){
            this.eventos.confirmacion.emit(true);
          }else{
            this.eventos.confirmacion.emit(false);
          }
          break;
      }
    }
    if(event.tipo === MsgTipo.ERROR){
      console.log("ERROR");
      switch(event.codigo){
        case MsgCodigo.CeldaOcupada:
          console.log("Celda ocupada!");
          break;
        case MsgCodigo.ConfigOrCreadorNecesario:
          console.log("Creador o configuracion necesario");
      }
    }

     

    
  }
  
  onExport(tablero: ExportTablero){
    console.log(tablero);
  }


  clickBoton(num: number){    
    this.eventos.clickBoton.emit(num);
  }

  cambioTam(){
    this.eventos.cambioTamano.emit([this.filas, this.columnas]);
  }

}
///////////////////////////////////
//Clases utilizadas
class Alumno{
  id;
  nombre;
  otro;
}

class AlumnoEnt extends Alumno implements ListaEntidad {
  equals(entidad: Object) {
    return entidad['id']===this.id;
  }
  atributo_titulo: string;
  posicion?: [number, number];
  constructor(id: string, nombre: string, otro:string){
    super();    
    this.atributo_titulo='nombre';
    this.id=id;
    this.nombre=nombre;
    this.otro=otro;
  }
}

//Implementacion propia del creador, como ejemplo se hacen algunas cosas diferentes al creador por defecto:
//Por ejemplo, al cambiar el num de filas o columnas, se reinicializan todas las filas eliminando asi todos los elementos
//Ademas se les pone un tamaño fijo a las celdas de 100x100 (en lugar de ajustarse, como hace el CreadorDefault)
class CreadorPropio extends Creador {
  nuevaInstancia(numFilas: number, numColumnas: number, listaElementos?: ListaElemento[], listaEntidades?: ListaEntidad[], minSize?: [number, number]): Creador {
    return new CreadorPropio(numFilas, numColumnas, listaElementos, listaEntidades, minSize);
  }
  setTotalSize(anchoTotal: number, altoTotal: number): void {
    this.sizePantalla= [anchoTotal, altoTotal];
  }
  onFilasChange(): void {
    console.log("filas han cambiado");
    this.inicializarFilas();
  }
  onColumnasChange(): void {
    this.inicializarFilas();
  }
  setSize(ancho: number, alto: number): void {
    this.sizeCelda[0]=ancho;
    this.sizeCelda[1]=alto;
  }


  constructor(numFilas:number, numColumnas:number, listaElementos: ListaElemento[] = null, listaEntidades: ListaEntidad[] = null, minSize: [number, number]){
    super(numFilas, numColumnas, listaElementos, listaEntidades, minSize);
  }

  inicializarFilas(): void {
    this.listaFilas=[];
    for(let f=0; f<this.numFilas; f++){
      this.listaFilas.push(new Fila(f));           
        for(let c=0; c<this.numColumnas; c++){
          let celda = new Celda(f,c);
          celda.ancho=100;
          celda.alto=100;
          this.listaFilas[f].celdas.push(celda);
          
        }
      }
    }
  }



