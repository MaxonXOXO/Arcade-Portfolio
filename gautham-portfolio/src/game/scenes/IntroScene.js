import Phaser from 'phaser'
import { createAnimations } from '../systems/AnimationManager'

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene')
    }

    create() {
        const { width, height } = this.scale

        createAnimations(this)

        // Calculate responsive scaling and world width based on 3840x1080 background aspect ratio
        const scale = height / 1080
        const worldWidth = 3840 * scale

        // Set physics world bounds so the player doesn't walk out of the level
        this.physics.world.setBounds(0, 0, worldWidth, height)

        // Initialize transition state
        this.isTransitioning = false

        // ── PARALLAX BACKGROUND ───────────────────────────────────────────────
        // Layer 1 - Sky fills entire screen and stays fixed
        this.add.image(width / 2, height / 2, 'layer1_sky')
            .setScrollFactor(0)
            .setDisplaySize(width, height)

        // All other layers anchor to bottom and scale to worldWidth
        const bgLayers = [
            { key: 'layer2_city', scrollFactor: 0.05 },
            { key: 'layer3_pcb', scrollFactor: 0.1 },
            { key: 'layer4_components', scrollFactor: 0.15 },
            { key: 'layer5_ground', scrollFactor: 1.0 },
        ]

        bgLayers.forEach(({ key, scrollFactor }) => {
            this.add.image(worldWidth / 2, height, key)
                .setOrigin(0.5, 1)
                .setScrollFactor(scrollFactor)
                .setDisplaySize(worldWidth, height)
        })

        // ── SPRITE WITH PHYSICS ───────────────────────────────────────────────
        this.player = this.physics.add.sprite(width / 2, height * 0.62 - 50, 'idle1')
        this.player.setOrigin(0.5, 1)
        this.player.setScale(0.7)
        this.player.setCollideWorldBounds(true)
        this.player.play('idle')

        // Adjust body size to fit bounding box (tightly matching character shape)
        this.player.body.setSize(66, 128)
        this.player.body.setOffset(66, 35)

        // Jump and movement state tracking
        this.wasInAir = false
        this.isLanding = false

        // Listen for jump animation completion to clear landing state
        this.player.on('animationcomplete', (anim) => {
            if (anim.key === 'jump') {
                this.isLanding = false
            }
        })

        // ── GROUND COLLIDER ───────────────────────────────────────────────────
        const groundY = height * 0.62
        const groundLine = this.add.rectangle(worldWidth / 2, groundY + 10, worldWidth, 20, 0x000000, 0)
        this.physics.add.existing(groundLine, true)
        this.physics.add.collider(this.player, groundLine)

        // ── CONTROLS ──────────────────────────────────────────────────────────
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
        this.idleTime = 0

        // ── CAMERA FOLLOW (HORIZONTAL ONLY) ───────────────────────────────────
        this.cameras.main.setBounds(0, 0, worldWidth, height)
        this.cameras.main.startFollow(this.player, true, 0.1, 0)

        // ── "HI I'M GAUTHAM" TEXT ─────────────────────────────────────────────
        const title = "HI I'M GAUTHAM"
        this.titleText = this.add.text(width / 2, height * 0.12, '', {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0)

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

        // ── SCROLL / INSTRUCTION HINT ─────────────────────────────────────────
        this.add.text(width / 2, height * 0.3, 'use A/D or ARROWS to walk, SPACE or W to jump', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.6).setScrollFactor(0)

        // ── PLAY BUTTON ───────────────────────────────────────────────────────
        const btnBg = this.add.rectangle(width / 2, height * 0.82, 240, 64, 0xf5a623)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(4, 0xffffff)
            .setScrollFactor(0)

        const btnText = this.add.text(width / 2, height * 0.82, '▶  PLAY', {
            fontFamily: 'monospace',
            fontSize: '28px',
            color: '#1a0a2e',
        }).setOrigin(0.5).setScrollFactor(0)

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
            this.isTransitioning = true
            this.player.setVelocity(0, -350)
            this.player.play('jump', true)
            this.time.delayedCall(400, () => {
                this.cameras.main.fadeOut(800, 0, 0, 0)
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('Zone1Scene')
                })
            })
        })

        // Enter key also starts game
        this.input.keyboard.once('keydown-ENTER', () => {
            this.isTransitioning = true
            this.player.setVelocity(0, -350)
            this.player.play('jump', true)
            this.time.delayedCall(400, () => {
                this.cameras.main.fadeOut(800, 0, 0, 0)
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('Zone1Scene')
                })
            })
        })

        // ── FLOATING PARTICLES ────────────────────────────────────────────────
        // Small pixel sparkles floating up from ground, purely decorative
        this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                const camX = this.cameras.main.scrollX
                const x = Phaser.Math.Between(camX + 50, camX + width - 50)
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

    update(time, delta) {
        if (this.isTransitioning) {
            this.player.setVelocityX(0)
            return
        }

        const keys = {
            left: this.cursors.left.isDown || this.wasd.left.isDown,
            right: this.cursors.right.isDown || this.wasd.right.isDown,
            jump: this.cursors.up.isDown || this.wasd.up.isDown || this.cursors.space.isDown
        }

        const onGround = this.player.body.blocked.down || this.player.body.touching.down

        // Apply horizontal movement
        if (keys.left) {
            this.player.setVelocityX(-250)
            this.player.setFlipX(true)
            this.idleTime = 0
        } else if (keys.right) {
            this.player.setVelocityX(250)
            this.player.setFlipX(false)
            this.idleTime = 0
        } else {
            this.player.setVelocityX(0)
        }

        // Jump and land animation state machine
        if (!onGround) {
            this.wasInAir = true
            this.isLanding = false // Interrupted landing

            // If rising, play jump. If at peak or falling, play fall animation
            if (this.player.body.velocity.y < 0) {
                this.player.play('jump', true)
            } else {
                if (this.player.anims.isPaused) {
                    this.player.anims.resume()
                }
                this.player.play('fall', true)
            }
        } else {
            // Player is on the ground
            if (this.wasInAir) {
                this.wasInAir = false
                this.isLanding = true
                
                // Play fall animation and freeze on the 8th frame (index 7) for landing impact
                this.player.play('fall')
                if (this.player.anims.currentAnim && this.player.anims.currentAnim.frames.length >= 8) {
                    this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[7]) // Frame 8
                    this.player.anims.pause()
                    
                    this.time.delayedCall(250, () => {
                        this.isLanding = false
                    })
                } else {
                    this.isLanding = false
                }
            }

            if (!this.isLanding) {
                // Normal walking / idle animations when not landing
                if (keys.left || keys.right) {
                    this.player.play('run', true)
                } else {
                    this.idleTime += delta
                    const nextAnim = this.idleTime > 3000 ? 'wave' : 'idle'
                    this.player.play(nextAnim, true)
                }
            }
        }

        // Handle Jumps
        if (keys.jump && onGround) {
            this.player.setVelocityY(-450)
            this.player.play('jump')
            this.idleTime = 0
            this.isLanding = false
        }
    }
}