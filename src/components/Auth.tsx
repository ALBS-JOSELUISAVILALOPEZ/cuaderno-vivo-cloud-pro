import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Signup successful! Check your email to confirm.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Cuaderno Vivo Cloud Pro</h1>
      <form onSubmit={handleAuth}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Registrarse'}
        </button>
      </form>
      <p>
        {mode === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={() => setMode('signup')}>
              Registrate
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={() => setMode('login')}>
              Inicia sesión
            </button>
          </>
        )}
      </p>
    </div>
  )
}
