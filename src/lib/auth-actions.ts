"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const signupSchema = z.object({
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
    full_name: z.string()
        .min(4, "Name must be at least 4 characters")
        .max(50, "Name too long")
});

export async function login(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // Правильное извлечение данных из FormData
    const rawFormData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        full_name: formData.get("full_name") as string
    };

    // Валидация данных
    const validation = signupSchema.safeParse(rawFormData);
    if (!validation.success) {
        return {
            error: {
                message: "Invalid form data",
                issues: validation.error.issues
            }
        };
    }

    // Вызов Supabase
    const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
            data: {
                full_name: validation.data.full_name,
                email: validation.data.email
            }
        }
    });

    if (error) {
        console.error("Signup error:", error);
        return redirect("/signup?error=" + encodeURIComponent(error.message));
    }

    return redirect("/verify-email?email=" + encodeURIComponent(validation.data.email));
}

export async function signout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error);
        redirect("/error");
    }

    redirect("/logout");
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    });

    if (error) {
        console.log(error);
        redirect("/error");
    }

    redirect(data.url);
}
