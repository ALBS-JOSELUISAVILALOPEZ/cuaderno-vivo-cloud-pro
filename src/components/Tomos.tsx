import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { exportAsJSON, exportAsZIP } from '../lib/export'

interface Tomo {
  id: string
  user_id: string
  title: string
  created_at: string
}

interface Page {
  id: string
  tomo_id: string
  user_id: string
  title: string
  content: string
  created_at: string
}

export default function Tomos({ user }: { user: any }) {
  const [tomos, setTomos] = useState<Tomo[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [newTomoTitle, setNewTomoTitle] = useState('')
  const [selectedTomo, setSelectedTomo] = useState<string | null>(null)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newPageContent, setNewPageContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTomos()
  }, [user])

  const loadTomos = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('tomos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTomos(data || [])
      if (data && data.length > 0) {
        setSelectedTomo(data[0].id)
        loadPages(data[0].id)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadPages = async (tomoId: string) => {
    try {
      const { data } = await supabase
        .from('pages')
        .select('*')
        .eq('tomo_id', tomoId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setPages(data || [])
    } catch (error) {
      console.error('Error loading pages:', error)
    }
  }

  const addTomo = async () => {
    if (!newTomoTitle.trim()) return
    try {
      const { data, error } = await supabase
        .from('tomos')
        .insert([{ title: newTomoTitle, user_id: user.id }])
        .select()
      if (error) throw error
      setTomos([...(data || []), ...tomos])
      setNewTomoTitle('')
      if (data && data.length > 0) {
        setSelectedTomo(data[0].id)
      }
    } catch (error) {
      console.error('Error adding tomo:', error)
      alert('Error al crear tomo')
    }
  }

  const addPage = async () => {
    if (!selectedTomo || !newPageTitle.trim()) return
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert([{
          tomo_id: selectedTomo,
          user_id: user.id,
          title: newPageTitle,
          content: newPageContent,
        }])
        .select()
      if (error) throw error
      setPages([...(data || []), ...pages])
      setNewPageTitle('')
      setNewPageContent('')
    } catch (error) {
      console.error('Error adding page:', error)
      alert('Error al crear página')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
      <div style={{ borderRight: '1px solid #ccc', paddingRight: '20px' }}>
        <h2>Tomos</h2>
        <div>
          <input
            type="text"
            placeholder="Título del tomo"
            value={newTomoTitle}
            onChange={(e) => setNewTomoTitle(e.target.value)}
          />
          <button onClick={addTomo}>Crear Tomo</button>
        </div>
        <div style={{ marginTop: '20px' }}>
          {tomos.map((tomo) => (
            <div
              key={tomo.id}
              onClick={() => { setSelectedTomo(tomo.id); loadPages(tomo.id); }}
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: selectedTomo === tomo.id ? '#e0e0e0' : '#f5f5f5',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              {tomo.title}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={exportAsJSON}>Backup JSON</button>
          <button onClick={exportAsZIP}>Backup ZIP</button>
        </div>
        <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: '#dc3545' }}>
          Logout
        </button>
      </div>

      <div>
        {selectedTomo && (
          <>
            <h2>Páginas</h2>
            <div>
              <input
                type="text"
                placeholder="Título de la página"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
              />
              <textarea
                placeholder="Contenido"
                value={newPageContent}
                onChange={(e) => setNewPageContent(e.target.value)}
              />
              <button onClick={addPage}>Crear Página</button>
            </div>
            <div style={{ marginTop: '20px' }}>
              {pages.map((page) => (
                <div key={page.id} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <h3>{page.title}</h3>
                  <p>{page.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
