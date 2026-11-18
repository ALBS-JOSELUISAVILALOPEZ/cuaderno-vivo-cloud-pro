import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Tomos from './components/Tomos'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return <div className="container"><p>Cargando...</p></div>
  }

  return (
    <div className="container">
      {!user ? <Auth /> : <Tomos user={user} />}
    </div>
  )
}

export default App
