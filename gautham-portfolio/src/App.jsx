import { useEffect } from 'react'
import Phaser from 'phaser'
import { gameConfig } from './game/config'
import './App.css'

function App() {
  useEffect(() => {
    const game = new Phaser.Game({
      ...gameConfig,
      parent: 'game-container',
    })
    return () => game.destroy(true)
  }, [])

  return (
    <div className="game-wrapper">
      <div id="game-container" />
    </div>
  )
}

export default App  