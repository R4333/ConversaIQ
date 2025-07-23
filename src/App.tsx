import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'
import fs from 'fs'

import { Button } from './components/ui/button'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button className="items-center gap-2 " onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        {/* <button className="bg-amber-50  dark:bg-amber-900 text-amber-800 dark:text-amber-200 p-4 rounded-lg shadow-md " onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p className= "bg-amber-50 dark:bg-amber-900 text-amber-800 dark:text-amber-200 p-4 rounded-lg shadow-md">
          files: {fs.readdirSync('./').join(', ')}
        </p>
        
        
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
