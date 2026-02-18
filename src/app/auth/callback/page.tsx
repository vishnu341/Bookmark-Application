'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error('Auth error:', error)
        router.replace('/login')
        return
      }

      // ✅ Logged in successfully
      router.replace('/dashboard')
    }

    handleAuth()
  }, [router])

  return <p>Signing you in...</p>
}
