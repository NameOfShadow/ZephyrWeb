'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()

                if (error || !user) {
                    router.push('/login')
                }
            } catch (error) {
                console.error('Auth check error:', error)
                router.push('/login')
            }
        }

        checkAuth()
    }, [router, supabase])

    return <>{children}</>
}