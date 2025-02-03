export type Database = {
  public: {
    Tables: {
      admin_logs: {
        Row: {
          id: number
          admin_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          admin_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          admin_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
      }
      affiliate_links: {
        Row: {
          id: number
          product_id: string
          affiliate_url: string
          platform: string
          commission_rate: number | null
          created_at: string
        }
        Insert: {
          id?: number
          product_id: string
          affiliate_url: string
          platform: string
          commission_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: string
          affiliate_url?: string
          platform?: string
          commission_rate?: number | null
          created_at?: string
        }
      }
      // Add types for other tables as needed
    }
    Functions: {
      exec_sql: {
        Args: { sql: string }
        Returns: undefined
      }
    }
    Enums: {
      // Add any enum types if you create them
    }
  }
}
