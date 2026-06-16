import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import IntroScene from './scenes/IntroScene'
import Zone1Scene from './scenes/Zone1Scene'

export const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    backgroundColor: '#0a0a0f',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false        // set true if you want to see hitboxes
        }
    },
    scene: [PreloadScene, IntroScene, Zone1Scene]
}