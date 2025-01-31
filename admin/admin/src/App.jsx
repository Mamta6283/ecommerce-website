import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Admin from './components/pages/Admin/Admin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Navbar></Navbar>
        <Admin></Admin>
    </>
  )
}

export default App
