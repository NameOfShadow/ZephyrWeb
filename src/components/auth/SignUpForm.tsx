import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignInWithGoogleButton from "@/components/ui/SignInWithGoogleButton";
import SignInWithAppleButton from "@/components/ui/SignInWithAppleButton";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signup } from "@/lib/auth-actions";

const formSchema = z.object({
    full_name: z.string()
        .min(4, "Name must be at least 4 characters")
        .max(50, "Name too long"),
    email: z.string()
        .email("Invalid email address")
        .max(100, "Email too long"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password too long")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type FormFields = z.infer<typeof formSchema>;

export function SignUpForm({
                               className,
                               ...props
                           }: React.ComponentPropsWithoutRef<"div">) {
    const [serverError, setServerError] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        mode: "onChange"
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setServerError("");

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("email", data.email);
                formData.append("password", data.password);
                formData.append("full_name", data.full_name);


                const result = await signup(formData);
//
                if (result?.error) {
                    setServerError(result.error.message);
                }
            } catch (error) {
                setServerError("An unexpected error occurred. Please try again.");
            }
        });
    };

    return (
        <div className={cn("flex flex-col gap-6 max-w-md w-full", className)} {...props}>
            <Card className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-gray-100">
                        Create New Account
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Sign up with your Apple or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <SignInWithAppleButton />
                                <SignInWithGoogleButton />
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-700">
                <span className="relative z-10 bg-gray-900/80 px-4 text-gray-400">
                  Or sign up with email
                </span>
                            </div>

                            <div className="grid gap-6">
                                {/* Full Name Field */}
                                <div className="grid gap-2">
                                    <Label className="text-gray-300" htmlFor="full_name">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        {...register("full_name")}
                                        disabled={isPending}
                                        placeholder="John Doe"
                                        className={cn(
                                            "bg-gray-800/50 border-gray-700 text-gray-100",
                                            "placeholder:text-gray-500 focus:border-gray-600 focus:ring-2",
                                            errors.full_name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        )}
                                        aria-invalid={!!errors.full_name}
                                    />
                                    {errors.full_name && (
                                        <span className="text-red-400 text-sm">{errors.full_name.message}</span>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="grid gap-2">
                                    <Label className="text-gray-300" htmlFor="email">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        {...register("email")}
                                        disabled={isPending}
                                        placeholder="name@example.com"
                                        className={cn(
                                            "bg-gray-800/50 border-gray-700 text-gray-100",
                                            "placeholder:text-gray-500 focus:border-gray-600 focus:ring-2",
                                            errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        )}
                                        aria-invalid={!!errors.email}
                                    />
                                    {errors.email && (
                                        <span className="text-red-400 text-sm">{errors.email.message}</span>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="grid gap-2">
                                    <Label className="text-gray-300" htmlFor="password">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        {...register("password")}
                                        disabled={isPending}
                                        className={cn(
                                            "bg-gray-800/50 border-gray-700 text-gray-100",
                                            "placeholder:text-gray-500 focus:border-gray-600 focus:ring-2",
                                            errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        )}
                                    ></Input>
                                    {errors.password && (
                                        <span className="text-red-400 text-sm">{errors.password.message}</span>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="grid gap-2">
                                    <Label className="text-gray-300" htmlFor="confirmPassword">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        {...register("confirmPassword")}
                                        disabled={isPending}
                                        className={cn(
                                            "bg-gray-800/50 border-gray-700 text-gray-100",
                                            "placeholder:text-gray-500 focus:border-gray-600 focus:ring-2",
                                            errors.confirmPassword && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        )}
                                        aria-invalid={!!errors.confirmPassword}
                                    />
                                    {errors.confirmPassword && (
                                        <span className="text-red-400 text-sm">{errors.confirmPassword.message}</span>
                                    )}
                                </div>

                                {/* Server Error Message */}
                                {serverError && (
                                    <div className="text-red-400 text-sm text-center">
                                        {serverError}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                                >
                                    {isPending ? "Creating Account..." : "Create Account"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-gray-500 [&_a]:text-indigo-400 hover:[&_a]:text-indigo-300 [&_a]:underline [&_a]:underline-offset-4 transition-colors">
                By creating an account, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}