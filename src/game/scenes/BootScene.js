import {Scene} from 'phaser'


export default class BootScene extends Scene {
    constructor() {
        super({key: 'BootScene'})
    }

    preload() {
        // Load sprite sheet generated with TexturePacker
        this.load.atlas('sheet', 'assets/sprite_sheet.png', 'assets/sprites.json');

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', 'assets/game_shapes.json');
    }

    create() {
        this.scene.start('PlayScene')
    }
}
