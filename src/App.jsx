import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Getmneomic from './components/Getmneomic'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Getmneomic/>
     
    </>
  )
}

export default App
