import { Scene } from 'phaser';
import { player } from '../player'
import { derrumbe } from '../derrumbe'
import { time } from '../time'
//import ee from '@/ee'

//CONSTANTES
const PROBABILIDAD_COFRES = 20;
const PROBABILIDAD_ARTEFACTOS = 20;
const PROBABILIDAD_DERRUMBE = 10;
const MINUTO_PELIGRO = 1;
const MINUTO_DERRUMBE_TOTAL = 5;
const PROBABILIDAD_DERRUMBE_TOTAL = 3; //0.3% de 300 segundos (5*60)

//VARIABLES
let player1;
let player2;
let player1Controls;
let player2Controls;
let objectKeys;
//let time = 0;
let tiempo;
let previousTime_artifact = 0;
let previousTime_chest = 0;
let previousTime_derrumbe = 0;
let previousTime_derrumbe_total = 0;
let reloj;
let spawns = [[200,300], [300,270], [400,260], [510,320], [600,230], [740,290], [740,120], [640,90], [540,110], [440,120], [340,140], [860,210], [1060,300]]; // [1060,150] = salida, [240,150] = tienda
let spawnsOcupados = [];
let posTienda = [240,150];
let posSalida = [1060,165];
let artefactos = [];
let cofres = [];
let shapes;
let estado = "playing";

//Variables de texto del inventario
let p1Artefactos;
let p2Artefactos;

let p1Fragmentos;
let p2Fragmentos;

let p1Edulcorantes;
let p2Edulcorantes;

let p1Imanes;
let p2Imanes;

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' });
  }

  create () {
    console.log("Starting PlayScene ...");
    shapes = this.cache.json.get('shapes');
    this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height);
    //this.game.physics.gravity.y = 0;
    this.matter.world.disableGravity();

    //AÑADIR FONDO
    let background = this.matter.add.sprite(0,0,'sheet', 'background.png', {shape: shapes.background});
    background.setDepth(-1);

    //AÑADIR MAPA
    let ground = this.matter.add.sprite(600, 240, 'sheet', 'mapa.png', {shape: shapes.mapa});
    ground.setScale(1.2);
    ground.setDepth(1);
    let ground_background = this.matter.add.sprite(30, 30, 'sheet', 'mapa_fondo.png', {shape: shapes.mapa_fondo});
    ground_background.setScale(1.19);
    ground_background.setDepth(0);

    //TIMER INTERNO EN SEGUNDOS
    tiempo = new time();
    var timeline = this.time.addEvent({
        delay: 300,
        callback: this.timer,
        callbackScope: this,
        loop: true
    })

    //RELOJ DE LA PANTALLA
    reloj = this.add.text(1020, 20, '00:00', { font: "60px Arial", fill: "#000000", align: "center" });

    //AÑADIR FICHA DEL JUGADOR 1
    player1 = new player(this.matter, 1, shapes, "Jugador 1", tiempo);

    //AÑADIR FICHA DEL JUGADOR 1
    player2 = new player(this.matter, 2, shapes, "Jugador 2", tiempo);

    //AÑADIR FONDOS DEL INVENTARIO
    let inventario_background1 = this.matter.add.sprite(150, 410, 'sheet', 'inventario_fondo.png', {shape: shapes.inventario_fondo});
    inventario_background1.setScale(1.4);

    let inventario_background2 = this.matter.add.sprite(700, 410, 'sheet', 'inventario_fondo.png', {shape: shapes.inventario_fondo});
    inventario_background2.setScale(1.4);

    //AÑADIR TIENDA
    let shop = this.matter.add.sprite(posTienda[0], posTienda[1], 'sheet', 'tienda.png', {shape: shapes.tienda});
    shop.setScale(0.7);
    shop.setDepth(2);
    player1.añadirColisionTienda(shop,this);
    player2.añadirColisionTienda(shop,this);

    //AÑADIR ESCALERA
    let escalera = this.matter.add.sprite(posSalida[0], posSalida[1], 'sheet', 'escalera.png', {shape: shapes.escalera});
    escalera.setScale(0.6);
    escalera.setDepth(0);
    player1.añadirColisionEscalera(escalera,this);
    player2.añadirColisionEscalera(escalera,this);

    //INICIALIZAR INVENTARIO EN LA PANTALLA
      //Nombres
      this.add.text(170, 420, player1.getNombre(), { font: "30px Arial", fill: "#000000", align: "center" });
      this.add.text(720, 420, player2.getNombre(), { font: "30px Arial", fill: "#000000", align: "center" });

      //Iconos
      this.add.sprite(745, 500, 'sheet', 'verde.png').setScale(0.8);
      this.add.sprite(195, 500, 'sheet', 'azul.png').setScale(0.8);

      //Artefactos
      p1Artefactos = this.add.text(835, 465, player2.getArtefactos(), { font: "30px Arial", fill: "#000000", align: "center" });
      p2Artefactos = this.add.text(280, 465, player1.getArtefactos(), { font: "30px Arial", fill: "#000000", align: "center" });

      this.add.sprite(250, 480, 'sheet', 'artefacto.png').setScale(0.3);
      this.add.sprite(805, 480, 'sheet', 'artefacto.png').setScale(0.3);

      //Fragmentos
      p1Fragmentos = this.add.text(830, 515, player2.getFragmentos(), { font: "30px Arial", fill: "#000000", align: "center" });
      p2Fragmentos = this.add.text(280, 515, player1.getFragmentos(), { font: "30px Arial", fill: "#000000", align: "center" });

      this.add.sprite(250, 530, 'sheet', 'frag_artefacto.png').setScale(0.3);
      this.add.sprite(805, 530, 'sheet', 'frag_artefacto.png').setScale(0.3);

      //Edulcorantes
      p1Edulcorantes = this.add.text(980, 465, player2.getEdulcorantes(), { font: "30px Arial", fill: "#000000", align: "center" });
      p2Edulcorantes = this.add.text(430, 465, player1.getEdulcorantes(), { font: "30px Arial", fill: "#000000", align: "center" });

      this.add.sprite(400, 480, 'sheet', 'edulcorante.png').setScale(0.3);
      this.add.sprite(950, 480, 'sheet', 'edulcorante.png').setScale(0.3);

      //Teclas edulcorantes
      this.add.text(340, 465, 'Q', { font: "30px Arial", fill: "#FF0000", align: "center" });
      this.add.text(900, 465, '-', { font: "30px Arial", fill: "#FF0000", align: "center" });

      //Imanes
      p1Imanes = this.add.text(980, 515, player1.getImanes(), { font: "30px Arial", fill: "#000000", align: "center" });
      p2Imanes = this.add.text(430, 515, player1.getImanes(), { font: "30px Arial", fill: "#000000", align: "center" });

      this.add.sprite(400, 530, 'sheet', 'iman.png').setScale(0.3);
      this.add.sprite(950, 530, 'sheet', 'iman.png').setScale(0.3);

      //Teclas imanes
      this.add.text(340, 515, 'E', { font: "30px Arial", fill: "#FF0000", align: "center" });
      this.add.text(860, 515, 'Shift', { font: "30px Arial", fill: "#FF0000", align: "center" });

    //CONSEGUIR LA INSTANCIAS DEL TECLADO
    //cursors = this.input.keyboard.createCursorKeys();

    player1Controls = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.UP,
        'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
        'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
        'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
        'object1': 189,
        'object2': Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });

    player2Controls = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D,
        'object1': Phaser.Input.Keyboard.KeyCodes.Q,
        'object2': Phaser.Input.Keyboard.KeyCodes.E,
    });

    /*objectKeys = this.input.keyboard.addKeys({
        'q': Phaser.Input.Keyboard.KeyCodes.Q,
        'e': Phaser.Input.Keyboard.KeyCodes.E,
        'left': Phaser.Input.Keyboard.KeyCodes.SHIFT,
        'right': 189,
    })*/

    //SPAWNS A FALSE
    spawns.forEach(function(val,index) {
      spawnsOcupados.push(false);
    })

    //this.spawnArtefactos();
    /*const bomb = this.physics.add.image(400, 200, 'bomb');
    bomb.setCollideWorldBounds(true);
    bomb.body.onWorldBounds = true; // enable worldbounds collision event
    bomb.setBounce(1);
    bomb.setVelocity(200, 20);

    this.physics.world.on('worldbounds', function(body){
      ee.emit("colision");
    },this);*/

  }

  update () {

      if(estado == "playing") {
          //Actualizar reloj de la pantalla
          this.actualizarReloj();
          //Comprobar si el jugador 1 ha pulsado alguna de sus teclas
          this.inputsJug1(player1);

          //Comprobar si el jugador 2 ha pulsado alguna de sus teclas
          this.inputsJug2(player2);

          //Generar artefactos
          this.spawnArtefactos();

          //Generar cofres
          this.spawnCofres();

          //Derrumbar nodos
          this.derrumbeNodos();

          //Derrumbe total
          this.derrumbeTotal();

          //Actualizar inventario
          this.actualizarInventario();

          //Comprobar si los jugadores tienen el edulcorante activado
          if (player1.getEdulcoranteActivado()) player1.actualizarEfectoEdulcorante(tiempo.getTime());
          if (player2.getEdulcoranteActivado()) player2.actualizarEfectoEdulcorante(tiempo.getTime());

          //Comprobar si los jugadores han salido
          if(player1.getSalido() && player2.getSalido()) {
              estado = "ending";

          }
      }
      else if(estado == "ending") this.finPartida();
  }

  actualizarInventario(){
      //Artefactos
      p1Artefactos.setText(player1.getArtefactos());
      p2Artefactos.setText(player2.getArtefactos());

      //Fragmentos
      p1Fragmentos.setText(player1.getFragmentos());
      p2Fragmentos.setText(player2.getFragmentos());

      //Edulcorantes
      p1Edulcorantes.setText(player1.getEdulcorantes());
      p2Edulcorantes.setText(player2.getEdulcorantes());

      //Imanes
      p1Imanes.setText(player1.getImanes());
      p2Imanes.setText(player2.getImanes());
  }

  actualizarReloj(){
      //Funcion que calcula los minutos y segundos y despues los actualiza en el reloj de la pantalla

      //Calcular los minutos y segundos
      let minutos = Math.trunc(tiempo.getTime() / 60);
      let segundos = Math.trunc(tiempo.getTime() % 60);

      //Normalizar a dos digitos
      if(minutos < 10) minutos = "0" + minutos;
      if(segundos < 10) segundos = "0" + segundos;

      //Actualizar el reloj
      reloj.setText(minutos + ":" + segundos);

      if(minutos == MINUTO_PELIGRO) reloj.setStyle({ font: "60px Arial", fill: "#FF0000", align: "center" });
      else if(minutos == MINUTO_DERRUMBE_TOTAL) this.finPartida();
  }

  spawnCofres(){
      //Funcion que se encarga de generar cofres en uno de los puntos de spawn disponibles de forma aleatoria
      //cada segundo segun {PROBABILIDAD_COFRES}

      let matter = this.matter;
      let originalThis = this;

      //Ha pasado un segundo
      if(tiempo.getTime() - previousTime_chest >= 1) {
          previousTime_chest = tiempo.getTime();
          let random = this.getRandomArbitrary(0, 100);

          //probabilidad de generar un artefacto en un spawn
          if (random < PROBABILIDAD_COFRES) {
              //Elegir aleatoriamente en donde poner el artefacto
              random = this.getRandomArbitrary(0, spawns.length);
              let res = false;
              let count = 0;

              //While para encontrar una posicion libre
              while (!res && count < spawns.length) {
                  if (!spawnsOcupados[random]) {
                      //Generamos un cofre en la posicion del spawn[random]
                      let cofre = this.matter.add.sprite(spawns[random][0], spawns[random][1], 'sheet', 'cofre_cerrado.png', {shape: shapes.cofre_cerrado});
                      cofre.setScale(0.7);
                      cofre.setDepth(0);
                      cofres.push(cofre);

                      //Añadir colisiones
                      player1.añadirColisionCofres(cofre, this, random, spawnsOcupados);
                      player2.añadirColisionCofres(cofre, this, random, spawnsOcupados);

                      //Poner res a true para salir del bucle
                      res = true;

                      //Marcar posicion como utilizada
                      spawnsOcupados[random] = true;
                  }
                  //Posicion ocupada, generar nueva posicion
                  else {
                      random = this.getRandomArbitrary(0, spawns.length);
                      count++;
                  }
              }
          }
      }
  }

  spawnArtefactos(){
      //Funcion que se encarga de generar artefactos en uno de los puntos de spawn disponibles de forma aleatoria
      //cada segundo segun {PROBABILIDAD_ARTEFACTOS}

      let matter = this.matter;
      let originalThis = this;

      //Ha pasado un segundo
      if(tiempo.getTime() - previousTime_artifact >= 1){
          previousTime_artifact = tiempo.getTime();
          let random = this.getRandomArbitrary(0,100);

          //console.log("random: " + random);
          //probabilidad de generar un artefacto en un spawn
          if(random < PROBABILIDAD_ARTEFACTOS){
              //Elegir aleatoriamente en donde poner el artefacto
              random = this.getRandomArbitrary(0,spawns.length);
              //console.log("Position: " + random);
              let res = false;
              let count = 0;

              //While para encontrar una posicion libre
              while(!res && count < spawns.length){
                  if (!spawnsOcupados[random]){
                      //console.log("Hola " + random);
                      //Generamos un artefacto en la posicion del spawn[random]
                      let artefacto = this.matter.add.sprite(spawns[random][0], spawns[random][1], 'sheet', 'artefacto.png', {shape: shapes.artefacto});
                      artefacto.setScale(0.5);
                      artefacto.setDepth(0);
                      artefactos.push(artefacto);

                      //Añadir colisiones
                      player1.añadirColisionArtefactos(artefacto, this, random, spawnsOcupados);
                      player2.añadirColisionArtefactos(artefacto, this, random, spawnsOcupados);

                      //Poner res a true para salir del bucle
                      res = true;

                      //Marcar posicion como utilizada
                      spawnsOcupados[random] = true;
                  }
                  //Posicion ocupada, generar nueva posicion
                  else {
                      random = this.getRandomArbitrary(0,spawns.length);
                      count++;
                  }
              }
          }
      }
  }

  derrumbeNodos(){
      //Funcion que ira derrumbando nodos aleatoriamente
      //cada segundo segun {PROBABILIDAD_DERRUMBE}

      let matter = this.matter;
      let originalThis = this;

      //Ha pasado un segundo
      if(tiempo.getTime() - previousTime_derrumbe >= 1){
          previousTime_derrumbe = tiempo.getTime();
          let random = this.getRandomArbitrary(0, 100);

          //probabilidad de generar un artefacto en un spawn
          if(random < PROBABILIDAD_DERRUMBE){
              //Elegir aleatoriamente en donde poner el derrumbe

              random = this.getRandomArbitrary(0,spawns.length);
              //console.log("Position: " + random);
              let res = false;
              let count = 0;

              //While para encontrar una posicion libre
              while(!res && count < spawns.length){
                  if (!spawnsOcupados[random]){
                      //console.log("Hola " + random);
                      //Generamos un derrumbe en la posicion del spawn[random]
                      let desprendimiento = new derrumbe(this.matter,shapes, spawns[random]);
                      //let derrumbe = this.matter.add.sprite(spawns[random][0], spawns[random][1], 'sheet', 'pedres.png', {shape: shapes.pedres});


                      //Añadir colisiones
                      player1.añadirColisionDerrumbe(desprendimiento, this, random, spawnsOcupados, tiempo);
                      player2.añadirColisionDerrumbe(desprendimiento, this, random, spawnsOcupados, tiempo);

                      //Poner res a true para salir del bucle
                      res = true;

                      //Marcar posicion como utilizada
                      spawnsOcupados[random] = true;
                  }
                  //Posicion ocupada, generar nueva posicion
                  else {
                      random = this.getRandomArbitrary(0,spawns.length);
                      count++;
                  }
              }
          }
      }
  }

  derrumbeTotal(){
      //A partir de 1 minuto el juego puede acabarse repentinamente por un derrumbe total, maximo es 5 minutos


      if(tiempo.getTime() - previousTime_derrumbe_total >= 1) {
          previousTime_derrumbe_total = tiempo.getTime();
          let minutos = Math.trunc(tiempo.getTime() / 60);
          //Ha pasado el minuto seguro, a partir de aqui la cueva se puede derrumbar
          if (minutos >= MINUTO_PELIGRO) {
              let random = this.getRandomArbitrary(0, ((MINUTO_DERRUMBE_TOTAL * 60) - tiempo.getTime())*10);
              console.log("Random : " + random);
              if (random <= PROBABILIDAD_DERRUMBE_TOTAL) {
                  estado = "ended";
                  this.finPartida();
              }
          }
      }
  }

  timer(){
      //Funcion que actualiza el contador de tiempo en segundos
      //time = time + 0.3;
      tiempo.sumar(0.3);
      //console.log("Contador: " + time);
  }

  inputsJug1(jugador) {
      //Funcion que se encarga de controlar los inputs del jugador 1

      //Movimiento a la izquierda
      if(player1Controls.left.isDown){
          jugador.moverIzquierda(true);
      }
      else {
          jugador.moverIzquierda(false);
      }

      //Movimiento a la derecha
      if(player1Controls.right.isDown){
          jugador.moverDerecha(true);
      }
      else {
          jugador.moverDerecha(false);
      }

      //Movimiento a arriba
      if(player1Controls.up.isDown){
          jugador.moverArriba(true);
      }
      else {
          jugador.moverArriba(false);
      }

      //Movimiento a abajo
      if(player1Controls.down.isDown){
          jugador.moverAbajo(true);
      }
      else {
          jugador.moverAbajo(false);
      }

      //Objeto 1 (Edulcorante)
      if(player1Controls.object1.isDown){
          jugador.usarEdulcorante(tiempo.getTime());
      }

      //Objeto 1 (Iman Magico)
      if(player1Controls.object2.isDown){
          jugador.usarIman(tiempo.getTime(), player2);
      }

  }

  inputsJug2(jugador) {
      //Funcion que se encarga de controlar los inputs del jugador 2

      //Movimiento a la izquierda
      if(player2Controls.left.isDown){
          jugador.moverIzquierda(true);
      }
      else {
          jugador.moverIzquierda(false);
      }

       //Movimiento a la derecha
      if(player2Controls.right.isDown){
          jugador.moverDerecha(true);
      }
      else {
          jugador.moverDerecha(false);
      }

      //Movimiento a arriba
      if(player2Controls.up.isDown){
          jugador.moverArriba(true);
      }
      else {
          jugador.moverArriba(false);
      }

      //Movimiento a abajo
      if(player2Controls.down.isDown){
          jugador.moverAbajo(true);
      }
      else {
          jugador.moverAbajo(false);
      }

      //Objeto 1 (Edulcorante)
      if(player2Controls.object1.isDown){
          jugador.usarEdulcorante(tiempo.getTime());
      }

      //Objeto 1 (Iman Magico)
      if(player2Controls.object2.isDown){
          jugador.usarIman(tiempo.getTime(), player1);
      }

  }

  getRandomArbitrary(min, max) {
      return Math.trunc(Math.random() * (max - min) + min);
  }

  finPartida(){
    //Funcion que se da cuando ocurre un derrumbe total o ambos jugadores salen por la escalera

    let jug1;
    let jug2;

    console.log(player1.getSalido() + " - "+ player2.getSalido())
    //Los jugadores han salido de la cueva
    if(player1.getSalido() && player2.getSalido()){
        //El jugador 1 tiene mas artefactos y ha salido antes
        if(player1.getArtefactos() > player2.getArtefactos() && player1.getHoraSalida() > player2.getHoraSalida()){
            jug1 = "GANADOR";
            jug2 = "PERDEDOR";
        }
        //El jugador 2 tiene mas artefactos y ha salido antes
        else if(player2.getArtefactos() > player1.getArtefactos() && player2.getHoraSalida() > player1.getHoraSalida()){
            jug1 = "PERDEDOR";
            jug2 = "GANADOR";
        }
        //El jugador 1 tiene menos artefactos pero ha salido antes
        else if(player1.getArtefactos() < player2.getArtefactos() && player1.getHoraSalida() < player2.getHoraSalida()){
            jug1 = "GANADOR";
            jug2 = "PERDEDOR";
        }
        //El jugador 2 tiene menos artefactos pero ha salido antes
        else if(player2.getArtefactos() < player1.getArtefactos() && player2.getHoraSalida() < player1.getHoraSalida()){
            jug1 = "PERDEDOR";
            jug2 = "GANADOR";
        }
        //mismos artefactos pero jugador 1 sale primero
        else if(player1.getArtefactos() == player2.getArtefactos() && player1.getHoraSalida() < player2.getHoraSalida()){
            jug1 = "PERDEDOR";
            jug2 = "GANADOR";
        }
        //mismos artefactos pero jugador 2 sale primero
        else if(player2.getArtefactos() == player1.getArtefactos() && player2.getHoraSalida() < player1.getHoraSalida()){
            jug1 = "PERDEDOR";
            jug2 = "GANADOR";
        }

        //jugador 1 ha salido pero jugador 2 no
        else if(player1.getSalido() && !player2.getSalido()){
            jug1 = "GANADOR";
            jug2 = "PERDEDOR";
        }
        //jugador 2 ha salido pero jugador 1 no
        else if(player2.getSalido() && !player1.getSalido()){
            jug1 = "PERDEDOR";
            jug2 = "GANADOR";
        }

        //Empate
        else{
            jug1 = "GANADOR";
            jug2 = "GANADOR";
        }

    }

    //La cueva se ha derrumbado, ambos pierden
    else{
        jug1 = "PERDEDOR";
        jug2 = "PERDEDOR";
    }

    this.add.text(320, 420, jug1, { font: "30px Arial", fill: "#FF0000", align: "center" });
    this.add.text(870, 420, jug2, { font: "30px Arial", fill: "#FF0000", align: "center" });
  };
}


