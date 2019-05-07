import { Scene } from 'phaser';
import { player } from '../player'
import ee from '@/ee'

//CONSTANTES
const PROBABILIDAD_COFRES = 20;
const PROBABILIDAD_ARTEFACTOS = 20;

//VARIABLES
let player1;
let player2;
let cursors;
let wasd;
let time = 0;
let previousTime_artifact = 0;
let previousTime_chest = 0;
let reloj;
let spawns = [[200,300], [300,270], [400,260], [510,320], [600,230], [740,290], [740,120], [640,90], [540,110], [440,120], [340,140], [860,210], [1060,300]]; // [1060,150] = salida, [240,150] = tienda
let spawnsOcupados = [];
let tienda = [240,150];
let salida = [1060,150];
let artefactos = [];
let cofres = [];
let shapes;

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

    //AÑADIR FONDOS DEL INVENTARIO
    let inventario_background1 = this.matter.add.sprite(150, 410, 'sheet', 'inventario_fondo.png', {shape: shapes.inventario_fondo});
    inventario_background1.setScale(1.4);

    let inventario_background2 = this.matter.add.sprite(700, 410, 'sheet', 'inventario_fondo.png', {shape: shapes.inventario_fondo});
    inventario_background2.setScale(1.4);
    //ground.setPosition(0 + ground.centerOfMass.x, 280 + ground.centerOfMass.y);  // position (0,280)
    //ground.setPosition(600, 220);  // position (0,280)

    //AÑADIR FICHA DEL JUGADOR 1
    player1 = new player(this.matter, 1, shapes);

    //AÑADIR FICHA DEL JUGADOR 1
    player2 = new player(this.matter, 2, shapes);

    //CONSEGUIR LA INSTANCIAS DEL TECLADO
    cursors = this.input.keyboard.createCursorKeys();

    wasd = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    //TIMER INTERNO EN SEGUNDOS
    var timeline = this.time.addEvent({
        delay: 1000,
        callback: this.timer,
        callbackScope: this,
        loop: true
    })

    //RELOJ DE LA PANTALLA
    reloj = this.add.text(1020, 20, '00:00', { font: "60px Arial", fill: "#FF0000", align: "center" });

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
  }

  actualizarInventario(){
      
  }

  actualizarReloj(){
      //Funcion que calcula los minutos y segundos y despues los actualiza en el reloj de la pantalla

      //Calcular los minutos y segundos
      let minutos = Math.trunc(time / 60);
      let segundos = Math.trunc(time % 60);

      //Normalizar a dos digitos
      if(minutos < 10) minutos = "0" + minutos;
      if(segundos < 10) segundos = "0" + segundos;

      //Actualizar el reloj
      reloj.setText(minutos + ":" + segundos);
  }

  spawnCofres(){
      //Funcion que se encarga de generar cofres en uno de los puntos de spawn disponibles de forma aleatoria
      //cada segundo segun {PROBABILIDAD_COFRES}

      let matter = this.matter;
      let originalThis = this;

      //Ha pasado un segundo
      if(time - previousTime_chest >= 1) {
          previousTime_chest = time;
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
                      player1.añadirColisionCofres(cofre, this);
                      player2.añadirColisionCofres(cofre, this);

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
      if(time - previousTime_artifact >= 1){
          previousTime_artifact = time;
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
                      player1.añadirColisionArtefactos(artefacto, this);
                      player2.añadirColisionArtefactos(artefacto, this);

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
      /*spawns.forEach(function(val,index) {
          let artefacto = matter.add.sprite(spawns[index][0], spawns[index][1], 'sheet', 'artefacto.png', {shape: shapes.artefacto});
          artefacto.setScale(0.5);
          artefacto.setDepth(0);
          artefactos.push(artefacto);
          player1.añadirColisionArtefactos(artefacto, originalThis);
          player2.añadirColisionArtefactos(artefacto, originalThis);
      })

       */

  }

  derrumbeNodos(){
      //Funcion que ira derrumbando nodos aleatoriamente
  }

  derrumbeTotal(){
      //A partir de 1 minuto el juego puede acabarse repentinamente por un derrumbe total

  }

  timer(){
      //Funcion que actualiza el contador de tiempo en segundos
      time = time + 1;
      //console.log("Contador: " + time);
  }

  inputsJug1(jugador) {
      //Funcion que se encarga de controlar los inputs del jugador 1

      let input = false;
      //Movimiento a la izquierda
      if(cursors.left.isDown){
          jugador.moverIzquierda(true);
      }
      else {
          jugador.moverIzquierda(false);
      }

      //Movimiento a la derecha
      if(cursors.right.isDown){
          jugador.moverDerecha(true);
      }
      else {
          jugador.moverDerecha(false);
      }

      //Movimiento a arriba
      if(cursors.up.isDown){
          jugador.moverArriba(true);
      }
      else {
          jugador.moverArriba(false);
      }

      //Movimiento a abajo
      if(cursors.down.isDown){
          jugador.moverAbajo(true);
      }
      else {
          jugador.moverAbajo(false);
      }

  }

  inputsJug2(jugador) {
      //Funcion que se encarga de controlar los inputs del jugador 2
      let input = false;
      //Movimiento a la izquierda
      if(wasd.left.isDown){
          jugador.moverIzquierda(true);
      }
      else {
          jugador.moverIzquierda(false);
      }

       //Movimiento a la derecha
      if(wasd.right.isDown){
          jugador.moverDerecha(true);
      }
      else {
          jugador.moverDerecha(false);
      }

      //Movimiento a arriba
      if(wasd.up.isDown){
          jugador.moverArriba(true);
      }
      else {
          jugador.moverArriba(false);
      }

      //Movimiento a abajo
      if(wasd.down.isDown){
          jugador.moverAbajo(true);
      }
      else {
          jugador.moverAbajo(false);
      }

  }

  getRandomArbitrary(min, max) {
      return Math.trunc(Math.random() * (max - min) + min);
  }
}
