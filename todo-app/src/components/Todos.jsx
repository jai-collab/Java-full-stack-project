import { useState, useEffect } from 'react'

const SERVER_URL = "http://localhost:8080"

function Todos({ onLogout }) {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTodos()
  }, [])

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const loadTodos = async () => {
    try {
      setError('')
      console.log('Loading todos...')
      
      const token = getToken()
      console.log('Using token:', token)
      
      const response = await fetch(`${SERVER_URL}/api/v1/todo`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      console.log('Todos response status:', response.status)

      if (response.ok) {
        const todosData = await response.json()
        console.log('Todos loaded successfully:', todosData)
        setTodos(todosData || [])
      } else {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        throw new Error(`Failed to load todos: ${response.status}`)
      }
    } catch (error) {
      console.error('Load todos error:', error)
      setError(error.message)
      
      // If it's an auth error, logout
      if (error.message.includes('403') || error.message.includes('401')) {
        onLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    const todoText = newTodo.trim()

    if (!todoText) {
      setError('Please enter a todo')
      return
    }

    try {
      setError('')
      const token = getToken()
      
      const response = await fetch(`${SERVER_URL}/api/v1/todo/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: todoText,
          completed: false
        })
      })

      console.log('Add todo response status:', response.status)

      if (response.ok) {
        const newTodoData = await response.json()
        console.log('Todo added successfully:', newTodoData)
        setNewTodo('')
        loadTodos()
      } else {
        const errorText = await response.text()
        throw new Error(`Failed to add todo: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Add todo error:', error)
      setError(error.message)
    }
  }

  const updateTodoStatus = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed }

    try {
      setError('')
      const token = getToken()
      
      const response = await fetch(`${SERVER_URL}/api/v1/todo/${todo.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: todo.title,
          completed: updatedTodo.completed
        })
      })

      if (response.ok) {
        loadTodos()
      } else {
        throw new Error('Failed to update todo')
      }
    } catch (error) {
      console.error('Update todo error:', error)
      setError(error.message)
    }
  }

  const deleteTodo = async (id) => {
    try {
      setError('')
      const token = getToken()
      
      const response = await fetch(`${SERVER_URL}/api/v1/todo/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        loadTodos()
      } else {
        throw new Error('Failed to delete todo')
      }
    } catch (error) {
      console.error('Delete todo error:', error)
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <h2>Your Todos</h2>
        <p className="loading">Loading your todos...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Your Todos</h2>
        <button 
          onClick={onLogout}
          style={{ width: 'auto', padding: '0.4rem 0.8rem', margin: 0 }}
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="todo-cards">
        {todos.length === 0 ? (
          <p className="empty-message">No todos yet. Add your first todo below!</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="todo-card">
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed || false}
                onChange={() => updateTodoStatus(todo)}
              />
              <span style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#aaa' : '#333'
              }}>
                {todo.title}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>X</button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addTodo} className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

export default Todos