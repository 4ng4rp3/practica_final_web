import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

function launch() {
    new Phaser.Game({
        type: Phaser.AUTO,
        width: 1200,
        height: 600,
        parent: 'game-container',
        physics: {
            default: 'matter',
            arcade: {
                gravity: {y: 300},
                debug: true
            }
        },
        // Install the scene plugin
        plugins: {
            scene: [
                {
                    plugin: PhaserMatterCollisionPlugin, // The plugin class
                    key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
                    mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
                }
            ]
        },
        scene: [BootScene, PlayScene]
    })
}

export default launch
export {launch}
