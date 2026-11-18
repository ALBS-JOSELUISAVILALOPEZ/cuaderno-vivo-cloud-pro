import { supabase } from './supabase'

export async function exportAsJSON() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { data: tomos } = await supabase
      .from('tomos')
      .select('*')
      .eq('user_id', user.id)

    const { data: pages } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', user.id)

    const { data: references } = await supabase
      .from('page_references')
      .select('*')
      .eq('user_id', user.id)

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tomos: tomos || [],
      pages: pages || [],
      page_references: references || [],
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cuaderno-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting JSON:', error)
    alert('Error al exportar JSON')
  }
}

export async function exportAsZIP() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { data: tomos } = await supabase
      .from('tomos')
      .select('*')
      .eq('user_id', user.id)

    const { data: pages } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', user.id)

    const { data: references } = await supabase
      .from('page_references')
      .select('*')
      .eq('user_id', user.id)

    const backupJSON = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tomos: tomos || [],
      pages: pages || [],
      page_references: references || [],
    }

    alert('ZIP export requires a library. For now, use JSON export. Full ZIP support coming soon.')
  } catch (error) {
    console.error('Error exporting ZIP:', error)
    alert('Error al exportar ZIP')
  }
}
