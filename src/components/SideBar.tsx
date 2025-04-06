// components/SideBar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SettingsPopover from "@/components/SettingsPopover";
import {Button} from "@/components/ui/button";


export function Sidebar() {
    return (
        <aside className="sticky top-0 h-screen w-16 border-r bg-background/95 backdrop-blur flex flex-col items-center py-4 z-50 shadow-xl">
            <div className="mb-4">
                <Avatar className="h-10 w-10 border-2 border-primary/80 bg-background hover:border-primary transition-colors">
                    <AvatarImage src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/30 font-medium">
                        U
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="w-8 h-px bg-border mb-4" />

            <div className="flex-1 flex flex-col gap-2 w-full px-2">
                {[1, 2, 3].map((i) => (
                    <button
                        key={i}
                        className="w-full aspect-square rounded-lg bg-muted hover:bg-accent transition-all
            transform hover:scale-105 border border-border/50 hover:border-primary/30"
                    >
                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </button>
                ))}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-full hover:bg-accent group"
            >
                <SettingsPopover />
            </Button>
        </aside>
    );
}