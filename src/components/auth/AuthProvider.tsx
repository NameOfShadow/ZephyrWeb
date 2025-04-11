'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
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

        // Не проверяем аутентификацию на странице /signup
        if (pathname !== '/signup') {
            checkAuth()
        }
    }, [router, supabase, pathname]) // Добавляем pathname в зависимости

    return <>{children}</>
}