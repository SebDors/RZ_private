import './App.css'
import { Routes, Route } from 'react-router-dom'
import Clients from './pages/Clients'
import Home from './pages/Home'

function App() {

  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/clients" element={<Clients />}/>
      </Routes>
      
    </main>
  )
}


export default App
