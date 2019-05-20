import {Scene} from 'phaser'
import sheet from '@/game/assets/sprite_sheet.png'
import spritesJson from '@/game/assets/sprites.json'
import shapes from '@/game/assets/game_shapes.json'


export default class BootScene extends Scene {
    constructor() {
        super({key: 'BootScene'})
    }

    preload() {
        // Load sprite sheet generated with TexturePacker
        this.load.atlas('sheet', sheet, spritesJson);

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', shapes);
    }

    create() {
        this.scene.start('PlayScene')
    }
}
