'use client';

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) throw error;
                setUser(user);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-8">
                <p>Please log in to view this content</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                Hello&nbsp;
                <code className="font-mono font-bold">
                    {user.user_metadata?.full_name || "User"}
                </code>
            </p>
        </div>
    );
}