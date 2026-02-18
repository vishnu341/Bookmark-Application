export type Database = {
  public: {
    Tables: {          // ← was `tables`
      bookmarks: {
        Row: {
          id: string
          title: string
          url: string
          user_id: string
        }
        Insert: {
          title: string
          url: string
          user_id: string
        }
        Update: {
          title?: string
          url?: string
        }
      }
    }
    Views: {}
    Functions: {}
  }
}