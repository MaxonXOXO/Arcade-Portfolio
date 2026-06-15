import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import IntroScene from './scenes/IntroScene'

// placeholder — we'll add this next
class Zone1Scene extends Phaser.Scene {
    constructor() { super('Zone1Scene') }
    create() {
        this.add.text(100, 100, 'ZONE 1 — COMING SOON', {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#00ff88'
        })
    }
}

export const gameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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