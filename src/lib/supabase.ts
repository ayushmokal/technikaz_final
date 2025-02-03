import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to execute SQL migrations
export async function executeMigration(sql: string) {
  const { error } = await supabase.from('_migrations').insert([
    { name: 'initial_schema', executed_at: new Date().toISOString() }
  ])
  
  if (error) {
    console.error('Error recording migration:', error)
    return { error }
  }

  const { error: sqlError } = await supabase.rpc('exec_sql', { sql })
  if (sqlError) {
    console.error('Error executing migration:', sqlError)
    return { error: sqlError }
  }

  return { error: null }
}
