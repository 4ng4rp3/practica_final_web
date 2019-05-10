import { Scene } from 'phaser';
import { player } from '../player'
import ee from '@/ee'


export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' });
  }

  create () {
    console.log("Starting PlayScene ...");
    var shapes = this.cache.json.get('shapes');
    this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

    //AÑADIR MAPA
    var ground = this.matter.add.sprite(600, 220, 'sheet', 'mapa.png', {shape: shapes.mapa});
    //ground.setPosition(0 + ground.centerOfMass.x, 280 + ground.centerOfMass.y);  // position (0,280)
    //ground.setPosition(600, 220);  // position (0,280)
    ground.setScale(1.2);
    ground.setDepth(0);

    //AÑADIR FONDO
    var background = this.matter.add.sprite(0,0,'sheet', 'background.png', {shape: shapes.background});
    background.setDepth(-1);

    //AÑADIR FICHA DEL JUGADOR 1
    var player1 = new player(this.matter, 1, shapes);

    //AÑADIR FICHA DEL JUGADOR 1
    var player2 = new player(this.matter, 2, shapes);

    //CONSEGUIR LA INSTANCIA DEL TECLADO
    var cursors = this.input.keyboard.createCursorKeys();


    //console.log(player1.getFragmentos());
    //var ficha = this.matter.add.sprite(600, 200, 'sheet', 'ficha2.png', {shape: shapes.ficha2});

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
    //Comprobar las si el jugador 1 ha pulsado alguna de sus teclas
    this.inputsJug1();

    //Comprobar las si el jugador 1 ha pulsado alguna de sus teclas
    this.inputsJug1();
  }
  inputsJug1() {

  }
  inputsJug2() {

  }
}
