// Add new animations here as you generate them
// format: key: { frames: N, frameRate: N, repeat: -1 loop / 0 once }

export const ANIM_CONFIG = {
    idle: { frames: 8, frameRate: 8, repeat: -1 },
    wave: { frames: 8, frameRate: 8, repeat: -1 },
    run: { frames: 8, frameRate: 12, repeat: -1 },
    jump: { frames: 7, frameRate: 10, repeat: 0 },
}

export function preloadAnimations(scene) {
    Object.entries(ANIM_CONFIG).forEach(([name, config]) => {
        for (let i = 1; i <= config.frames; i++) {
            scene.load.image(
                `${name}${i}`,
                `assets/sprites/${name}/${name}${i}.png`
            )
        }
    })
}

export function createAnimations(scene) {
    Object.entries(ANIM_CONFIG).forEach(([name, config]) => {
        scene.anims.create({
            key: name,
            frames: Array.from({ length: config.frames }, (_, i) => ({
                key: `${name}${i + 1}`
            })),
            frameRate: config.frameRate,
            repeat: config.repeat
        })
    })
}