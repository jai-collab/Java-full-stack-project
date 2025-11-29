import { useState } from 'react'

const SERVER_URL = "http://localhost:8080"

function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      console.log('Attempting login with:', { email })
      
      const response = await fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      console.log('Login response status:', response.status)

      const data = await response.json()
      console.log('Login response data:', data)

      if (response.ok) {
        if (data.token) {
          console.log('Login successful, token received')
          onLogin(data.token)
        } else {
          throw new Error('No token received from server')
        }
      } else {
        throw new Error(data.message || 'Login failed')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            required
            disabled={loading}
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? 
        <button 
          onClick={() => onNavigate('register')}
          disabled={loading}
          className="link-button"
        >
          Register here
        </button>
      </p>
    </div>
  )
}

export default Login