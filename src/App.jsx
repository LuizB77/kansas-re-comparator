import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Results from './pages/Results.jsx'

function App() {
  return (
    <>
      <nav className="flex items-center border-b border-gray-200 px-4 py-3">
        <span className="text-primary font-bold">Kansas RE Comparator</span>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  )
}

export default App
