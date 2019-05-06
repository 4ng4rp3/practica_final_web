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
    ground.setPosition(0 + ground.centerOfMass.x, 280 + ground.centerOfMass.y);  // position (0,280)

    // add some objects
    this.matter.add.sprite(200, 50, 'sheet', 'ficha1.png', {shape: shapes.ficha1});

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
    let ficha = this.add.sprite(600, 220, 'test');

    i.setScale(0.4);
    console.log(i);
*/
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
