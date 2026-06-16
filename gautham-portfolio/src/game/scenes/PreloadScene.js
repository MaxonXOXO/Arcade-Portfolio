import Phaser from 'phaser'
import { preloadAnimations } from '../systems/AnimationManager'

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene')
    }

    preload() {
        // Loading bar background
        const { width, height } = this.scale
        const barBg = this.add.rectangle(width / 2, height / 2, 400, 20, 0x333333)
        const bar = this.add.rectangle(width / 2 - 200, height / 2, 0, 20, 0x00ff88)
        bar.setOrigin(0, 0.5)

        this.add.text(width / 2, height / 2 - 40, 'LOADING...', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#00ff88'
        }).setOrigin(0.5)

        // Update bar as assets load
        this.load.on('progress', (value) => {
            bar.width = 400 * value
        })

        this.load.on('complete', () => {
            this.scene.start('IntroScene')
        })

        // Load all sprite animations
        preloadAnimations(this)

        // Load all zone1 background layers
        this.load.image('layer1_sky', 'assets/backgrounds/zone1/layer1_sky.png')
        this.load.image('layer2_city', 'assets/backgrounds/zone1/layer2_city.png')
        this.load.image('layer3_pcb', 'assets/backgrounds/zone1/layer3_pcb.png')
        this.load.image('layer4_components', 'assets/backgrounds/zone1/layer4_components.png')
        this.load.image('layer5_ground', 'assets/backgrounds/zone1/layer5_ground.png')
        this.load.image('layer6_platforms', 'assets/backgrounds/zone1/layer6_platforms.png')

        // Load new tilemap and tileset
        this.load.tilemapTiledJSON('zone1_map', 'assets/maps/zone1.tmj')
        this.load.image('basic_tiles', 'assets/tiles/ground.png')
    }
}