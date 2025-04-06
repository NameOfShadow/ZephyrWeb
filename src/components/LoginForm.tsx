import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-actions"
import SignInWithGoogleButton from "@/components/SignInWithGoogleButton";
import SignInWithAppleButton from "@/components/SignInWithAppleButton";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6 max-w-md w-full", className)} {...props}>
            <Card className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-gray-100">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Login with your Apple or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action="">
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <SignInWithAppleButton  />
                                <SignInWithGoogleButton />
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-700">
                                <span className="relative z-10 bg-gray-900/80 px-4 text-gray-400">
                                    Or continue with email
                                </span>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-gray-300" htmlFor="email">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-500"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label className="text-gray-300" htmlFor="password">
                                            Password
                                        </Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm text-gray-400 hover:text-gray-200 transition-colors"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-500"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                                    formAction={login}
                                >
                                    Login
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-gray-500 [&_a]:text-indigo-400 hover:[&_a]:text-indigo-300 [&_a]:underline [&_a]:underline-offset-4 transition-colors">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}