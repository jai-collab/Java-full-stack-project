import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Todos from './components/Todos'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      console.log('=== APP INITIALIZATION STARTED ===')
      const storedToken = localStorage.getItem('token')
      console.log('Stored token found:', !!storedToken)
      
      // Simply check if token exists - don't validate it
      if (storedToken) {
        console.log('Token exists, redirecting to todos')
        setToken(storedToken)
        setCurrentPage('todos')
      } else {
        console.log('No stored token, staying on login page')
      }
      
      setLoading(false)
      console.log('=== APP INITIALIZATION COMPLETED ===')
    }

    initializeApp()
  }, [])

  const handleLogin = (newToken) => {
    console.log('LOGIN SUCCESS - Token received:', newToken)
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setCurrentPage('todos')
  }

  const handleLogout = () => {
    console.log('Logging out...')
    localStorage.removeItem('token')
    setToken(null)
    setCurrentPage('login')
  }

  const navigateTo = (page) => {
    console.log('Navigation to:', page)
    setCurrentPage(page)
  }

  console.log('App State - currentPage:', currentPage, 'token:', !!token, 'loading:', loading)

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
        <p className="loading">Checking authentication status...</p>
      </div>
    )
  }

  if (token) {
    console.log('Rendering Todos component')
    return <Todos onLogout={handleLogout} />
  }

  console.log('Rendering Auth page:', currentPage)
  switch (currentPage) {
    case 'register':
      return <Register onNavigate={navigateTo} />
    default:
      return <Login onLogin={handleLogin} onNavigate={navigateTo} />
  }
}

export default App