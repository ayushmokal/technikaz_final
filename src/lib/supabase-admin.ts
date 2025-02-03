import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import type { Database } from './database.types'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to execute SQL migrations
export async function executeMigration(sql: string) {
  try {
    const { error } = await supabaseAdmin.from('_migrations').select('*').limit(1)
    if (error && error.code !== 'PGRST205') {
      console.error('Error checking migrations table:', error)
      return { error }
    }

    // If migrations table doesn't exist, create it
    if (error && error.code === 'PGRST205') {
      const { error: createError } = await supabaseAdmin
        .from('_migrations')
        .insert([])
      if (createError) {
        console.error('Error creating migrations table:', createError)
        return { error: createError }
      }
    }

    // Execute the migration SQL
    const { error: sqlError } = await supabaseAdmin
      .from('_migrations')
      .insert([{ name: 'initial_schema', executed_at: new Date().toISOString() }])

    if (sqlError) {
      console.error('Error recording migration:', sqlError)
      return { error: sqlError }
    }

    // Execute the SQL directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ sql })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error executing SQL:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Error executing migration:', error)
    return { error }
  }
}
