import { useEffect } from 'react'
import Phaser from 'phaser'
import './App.css'

function App() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      pixelArt: true,
      antialias: false,
      roundPixels: true,
      backgroundColor: '#0a0a0f',
      parent: 'game-container',
      scene: {
        preload() {
          // We'll move this to PreloadScene later
          // For now just confirm Phaser is alive
        },
        create() {
          this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 2,
            '[ GAUTHAM PORTFOLIO — ENGINE ONLINE ]',
            {
              fontSize: '22px',
              fill: '#00ff88',
              fontFamily: 'monospace',
              align: 'center'
            }
          ).setOrigin(0.5)
        }
      }
    }

    const game = new Phaser.Game(config)
    return () => game.destroy(true)
  }, [])

  return (
    <div
      id="game-container"
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    />
  )
}

export default App