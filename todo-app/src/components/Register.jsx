import { useState } from 'react'

const SERVER_URL = "http://localhost:8080"

function Register({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      console.log('Attempting registration with:', { email })
      
      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      console.log('Registration response status:', response.status)

      const data = await response.json()
      console.log('Registration response data:', data)

      if (response.ok) {
        setSuccess('Registration successful! Please login with your credentials.')
        setEmail('')
        setPassword('')
        setTimeout(() => {
          onNavigate('login')
        }, 2000)
      } else {
        throw new Error(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleRegister}>
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
          placeholder="Password (min 6 characters)" 
          required
          disabled={loading}
          minLength="6"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? 
        <button 
          onClick={() => onNavigate('login')}
          disabled={loading}
          className="link-button"
        >
          Login here
        </button>
      </p>
    </div>
  )
}

export default Register