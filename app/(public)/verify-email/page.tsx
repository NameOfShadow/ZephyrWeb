export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700/50 text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                    Check your email
                </h2>
                <p className="text-gray-400">
                    We've sent a confirmation link to your email address.
                </p>
                <p className="text-gray-400 mt-2">
                    Please check your spam folder if you don't see the email.
                </p>
            </div>
        </div>
    )
}