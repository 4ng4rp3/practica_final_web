import { Scene } from 'phaser';
import { player } from '../player'
import ee from '@/ee'

//VARIABLES
var player1;
var player2;
var cursors;
var wasd;
var time = 0;
var reloj;
var spawns = [[200,300], [400,200]];
var artefactos = [];
var shapes;

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

    //AÑADIR MAPA
    var ground = this.matter.add.sprite(600, 240, 'sheet', 'mapa.png', {shape: shapes.mapa});
    //ground.setPosition(0 + ground.centerOfMass.x, 280 + ground.centerOfMass.y);  // position (0,280)
    //ground.setPosition(600, 220);  // position (0,280)
    ground.setScale(1.2);
    ground.setDepth(1);

    //AÑADIR FONDO
    var background = this.matter.add.sprite(0,0,'sheet', 'background.png', {shape: shapes.background});
    background.setDepth(-1);

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


    this.spawnArtefactos();
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
      //this.spawnArtefactos();

      //Derrumbar nodos
      this.derrumbeNodos();

      //Derrumbe total
      this.derrumbeTotal();
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

  }
  spawnArtefactos(){
      let artefacto = this.matter.add.sprite(spawns[0][0], spawns[0][1], 'sheet', 'artefacto.png', {shape: shapes.artefacto});
      artefacto.setScale(0.5);
      artefacto.setDepth(0);
      artefactos.push(artefacto);
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
}
