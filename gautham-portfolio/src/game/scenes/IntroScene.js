import Phaser from 'phaser'
import { createAnimations } from '../systems/AnimationManager'

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene')
    }

    create() {
        const { width, height } = this.scale

        createAnimations(this)

        // ── PARALLAX BACKGROUND ───────────────────────────────────────────────
        // All layers anchored bottom-center, growing upward from same baseline

        // Layer 1 - Sky fills entire screen
        // Sky fills full screen
        this.add.image(width / 2, height / 2, 'layer1_sky')
            .setScrollFactor(0)
            .setDisplaySize(width, height)

        // All other layers anchor to bottom
        const bgLayers = [
            { key: 'layer2_city', scrollFactor: 0.05 },
            { key: 'layer3_pcb', scrollFactor: 0.1 },
            { key: 'layer4_components', scrollFactor: 0.15 },
            { key: 'layer5_ground', scrollFactor: 1.0 },
        ]

        bgLayers.forEach(({ key, scrollFactor }) => {
            this.add.image(width / 2, height, key)
                .setOrigin(0.5, 1)
                .setScrollFactor(scrollFactor)
                .setDisplaySize(width, height)
        })

        // ── SPRITE ────────────────────────────────────────────────────────────
        this.player = this.add.sprite(width / 2, height * 0.62, 'idle1')
        this.player.setOrigin(0.5, 1)
        this.player.setScale(0.7)
        this.player.play('wave')

        // ── "HI I'M GAUTHAM" TEXT ─────────────────────────────────────────────
        const title = "HI I'M GAUTHAM"
        this.titleText = this.add.text(width / 2, height * 0.12, '', {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5)

        // Typewriter effect
        let charIndex = 0
        this.time.addEvent({
            delay: 80,
            repeat: title.length - 1,
            callback: () => {
                this.titleText.text += title[charIndex]
                charIndex++
                if (charIndex === title.length) {
                    this.time.delayedCall(300, () => {
                        this.titleText.text = '♥ ' + title + ' ♥'
                        this.titleText.setColor('#ffdd57')
                    })
                }
            }
        })

        // ── SCROLL HINT ───────────────────────────────────────────────────────
        this.add.text(width / 2, height * 0.3, 'scroll down for portfolio', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.6)

        // ── PLAY BUTTON ───────────────────────────────────────────────────────
        const btnBg = this.add.rectangle(width / 2, height * 0.82, 240, 64, 0xf5a623)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(4, 0xffffff)

        const btnText = this.add.text(width / 2, height * 0.82, '▶  PLAY', {
            fontFamily: 'monospace',
            fontSize: '28px',
            color: '#1a0a2e',
        }).setOrigin(0.5)

        // Pulse animation on button
        this.tweens.add({
            targets: [btnBg, btnText],
            scaleX: 1.06,
            scaleY: 1.06,
            duration: 650,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        })

        // Hover effects
        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0xffd700)
            this.tweens.add({
                targets: this.player,
                scaleX: 0.75,
                scaleY: 0.75,
                duration: 150,
                ease: 'Sine.easeOut'
            })
        })

        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0xf5a623)
            this.tweens.add({
                targets: this.player,
                scaleX: 0.7,
                scaleY: 0.7,
                duration: 150,
                ease: 'Sine.easeOut'
            })
        })

        // Click → fade to Zone 1
        btnBg.on('pointerdown', () => {
            // Sprite reacts to click
            this.player.play('jump')
            this.time.delayedCall(400, () => {
                this.cameras.main.fadeOut(800, 0, 0, 0)
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('Zone1Scene')
                })
            })
        })

        // Enter key also starts game
        this.input.keyboard.once('keydown-ENTER', () => {
            this.cameras.main.fadeOut(800, 0, 0, 0)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Zone1Scene')
            })
        })

        // ── FLOATING PARTICLES ────────────────────────────────────────────────
        // Small pixel sparkles floating up from ground, purely decorative
        this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                const x = Phaser.Math.Between(50, width - 50)
                const particle = this.add.rectangle(
                    x, height * 0.6,
                    3, 3,
                    Phaser.Utils.Array.GetRandom([0x00ff41, 0xffd700, 0x00cfff])
                ).setAlpha(0.8)

                this.tweens.add({
                    targets: particle,
                    y: height * 0.1,
                    alpha: 0,
                    duration: Phaser.Math.Between(1500, 3000),
                    ease: 'Sine.easeOut',
                    onComplete: () => particle.destroy()
                })
            }
        })

        // ── CAMERA FADE IN ────────────────────────────────────────────────────
        this.cameras.main.fadeIn(1000, 0, 0, 0)
    }
}