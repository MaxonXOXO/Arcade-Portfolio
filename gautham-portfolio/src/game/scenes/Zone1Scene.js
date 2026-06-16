import Phaser from 'phaser'
import { createAnimations } from '../systems/AnimationManager'

export default class Zone1Scene extends Phaser.Scene {
    constructor() {
        super('Zone1Scene')
    }

    create() {
        createAnimations(this)

        // 1. Create Tilemap
        const map = this.make.tilemap({ key: 'zone1_map' })
        
        // 2. Add Tileset Image (mapped to the 'basic_tiles' key we preloaded)
        const tileset = map.addTilesetImage('basic_tiles', 'basic_tiles')
        
        // 3. Create Ground layer
        const groundLayer = map.createLayer('Ground', tileset, 0, 0)
        
        // Enable collision for all tiles on the Ground layer
        groundLayer.setCollisionByExclusion([-1])

        // 4. Set world and physics bounds to the tilemap size
        const mapWidth = map.widthInPixels
        const mapHeight = map.heightInPixels
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight)
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)

        // 5. Create a beautiful cyberpunk dark space gradient background
        const bgGraphics = this.add.graphics()
        bgGraphics.fillGradientStyle(0x06060c, 0x06060c, 0x140e20, 0x140e20, 1)
        bgGraphics.fillRect(0, 0, mapWidth, mapHeight)
        // Send background graphics to back, behind map layers
        bgGraphics.setDepth(-1)

        // 6. Find Spawn Point from Tiled Object layer
        const spawnPoint = map.findObject('Object', obj => obj.name === 'spawn')
        const spawnX = spawnPoint ? spawnPoint.x : 100
        const spawnY = spawnPoint ? spawnPoint.y : 300

        // 7. Create Player Sprite
        this.player = this.physics.add.sprite(spawnX, spawnY, 'idle1')
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
        this.highestY = 0
        this.isHighFall = false
        this.jumpStartY = 0

        // Listen for jump animation completion to clear landing state
        this.player.on('animationcomplete', (anim) => {
            if (anim.key === 'jump') {
                this.isLanding = false
            }
        })

        // 8. Add Colliders
        this.physics.add.collider(this.player, groundLayer)

        // 9. Camera Follow setup
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
        this.cameras.main.fadeIn(1000, 0, 0, 0)

        // 10. Controls
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
        this.idleTime = 0

        // 11. UI Elements (Zone 1 Header & Back Button)
        const headerText = this.add.text(20, 20, 'ZONE 1: PLATFORMS', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00ff88',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0)

        // Back Button
        const backBtn = this.add.text(this.scale.width - 120, 20, '◀ BACK', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#ff3366',
            padding: { x: 10, y: 5 },
            stroke: '#000000',
            strokeThickness: 3
        })
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })

        backBtn.on('pointerover', () => backBtn.setColor('#ffdd57'))
        backBtn.on('pointerout', () => backBtn.setColor('#ffffff'))
        backBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('IntroScene')
            })
        })

        // Esc key also goes back
        this.input.keyboard.once('keydown-ESC', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('IntroScene')
            })
        })

        // 12. Floating cyber sparkles (aesthetic polish)
        this.time.addEvent({
            delay: 300,
            loop: true,
            callback: () => {
                const camX = this.cameras.main.scrollX
                const x = Phaser.Math.Between(camX, camX + this.scale.width)
                const particle = this.add.rectangle(
                    x, mapHeight - 32,
                    4, 4,
                    Phaser.Utils.Array.GetRandom([0x00ff88, 0x00ffff, 0xff0055])
                ).setAlpha(0.8)

                this.tweens.add({
                    targets: particle,
                    y: Phaser.Math.Between(50, mapHeight - 150),
                    alpha: 0,
                    duration: Phaser.Math.Between(2000, 4000),
                    ease: 'Sine.easeOut',
                    onComplete: () => particle.destroy()
                })
            }
        })
    }

    update(time, delta) {
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

            // Track peak height and determine high fall
            this.highestY = Math.min(this.highestY, this.player.y)
            if (this.player.y > this.jumpStartY + 40 || this.player.y - this.highestY > 135) {
                this.isHighFall = true
            }

            if (this.isHighFall) {
                if (this.player.anims.isPaused) {
                    this.player.anims.resume()
                }
                this.player.play('fall', true)
            } else {
                if (this.player.anims.currentAnim?.key === 'jump') {
                    if (this.player.anims.currentFrame && this.player.anims.currentFrame.index >= 5) {
                        this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[4]) // Hold on frame 5
                        this.player.anims.pause()
                    } else if (this.player.anims.isPaused) {
                        this.player.anims.resume()
                    }
                } else {
                    this.player.play('jump')
                }
            }
        } else {
            // Player is on the ground
            if (this.wasInAir) {
                const prevAnim = this.player.anims.currentAnim?.key
                this.wasInAir = false
                this.isLanding = true
                
                if (prevAnim === 'jump' || prevAnim === 'fall') {
                    this.player.play('jump')
                    if (this.player.anims.currentAnim?.frames && this.player.anims.currentAnim.frames.length >= 6) {
                        this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[5]) // Play frame 6
                        this.player.anims.resume()
                    } else {
                        this.isLanding = false
                    }
                } else {
                    this.isLanding = false
                }
            }

            // Reset fall tracking
            this.highestY = this.player.y
            this.jumpStartY = this.player.y
            this.isHighFall = false

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
