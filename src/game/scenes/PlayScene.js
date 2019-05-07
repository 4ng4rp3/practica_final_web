import { Scene } from 'phaser';
import ee from '@/ee'


export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' });
  }

  create () {
    console.log("Starting PlayScene ...");
    var shapes = this.cache.json.get('shapes');
    this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

    var ground = this.matter.add.sprite(0, 0, 'sheet', 'mapa.png', {shape: shapes.mapa});
    //ground.setPosition(0 + ground.centerOfMass.x, 280 + ground.centerOfMass.y);  // position (0,280)
    ground.setPosition(600, 220);  // position (0,280)
    ground.setScale(1.2);
    //ground.setSize(1.2)
    // add some objects
    var ficha = this.matter.add.sprite(600, 200, 'sheet', 'ficha2.png', {shape: shapes.ficha2});
    //ficha.setScale(0.2);
    //ficha.setSize(0.2,0.2);
    //ficha.setPosition(300, 200);


    //let i = this.add.image(600, 300, 'sky');

    /*//Añadir imagen de fondo
    let i = this.add.image(600, 300, 'background');
    console.log(i);

    //Añadir fondo del mapa
    i = this.add.image(600, 220, 'background_map');
    console.log(i);

    //Añadir el mapa
    i = this.add.image(600, 220, 'map');
    console.log(i);

    //Añadir los limites del mapa
    let limites = this.add.image(600, 220, 'map_limits');
    console.log(i);

    //Añadir la ficha
    */
    let ficha2 = this.add.sprite(600, 220, 'test');

    ficha2.setScale(0.4);
    console.log(ficha2);

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
  }
}
