'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Логотип */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 group">
                        <div
                            className="p-3 rounded-xl bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 transition-all group-hover:bg-indigo-600/30">
                            <GalleryVerticalEnd className="h-8 w-8 text-indigo-400"/>
                        </div>
                        <span
                            className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                            Zephyr Inc.
                        </span>
                    </div>
                </div>

                {/* Форма */}
                <div
                    className="bg-slate-800/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700/50 transition-all hover:border-slate-600/50">
                    <div className="space-y-6">
                        <LoginForm/>
                    </div>
                </div>

                {/* Ссылка на страницу регистрацию */}
                <div className="text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        className="text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline transition-colors"
                    >
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    )
}