import {Scene} from 'phaser'
import sky from '@/game/assets/sky.png';
import bomb from '@/game/assets/bomb.png';
import background from '@/game/assets/background.png';
import background_map from '@/game/assets/background_map.png';
import map from '@/game/assets/map.png';
import map_limits from '@/game/assets/map_limits.png';
//import test from '@/game/assets/prueba.png';


export default class BootScene extends Scene {
    constructor() {
        super({key: 'BootScene'})
    }

    preload() {
        this.load.image('sky', sky)
        this.load.image('bomb', bomb)
        this.load.image('background', background)
        this.load.image('background_map', background_map)
        this.load.image('map', map)
        this.load.image('map_limits', map_limits)
        //this.load.image('test', test)
        // this.load.audio('thud', ['assets/thud.mp3', 'assets/thud.ogg'])

        // Load sprite sheet generated with TexturePacker
        this.load.atlas('sheet', 'assets/sprite_sheet.png', 'assets/sprites.json');

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', 'assets/game_shapes.json');
    }

    create() {
        this.scene.start('PlayScene')
    }
}
