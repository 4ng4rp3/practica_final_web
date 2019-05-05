import { Scene } from 'phaser';
import ee from '@/ee'


export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' });
  }

  create () {
    console.log("Starting PlayScene ...");
    //let i = this.add.image(600, 300, 'sky');

    //Añadir imagen de fondo
    let i = this.add.image(600, 300, 'background');
    console.log(i);

    //Añadir fondo del mapa
    i = this.add.image(600, 220, 'background_map');
    console.log(i);

    const bomb = this.physics.add.image(400, 200, 'bomb');
    bomb.setCollideWorldBounds(true);
    bomb.body.onWorldBounds = true; // enable worldbounds collision event
    bomb.setBounce(1);
    bomb.setVelocity(200, 20);

    this.physics.world.on('worldbounds', function(body){
      ee.emit("colision");
    },this);

  }

  update () {
  }
}
