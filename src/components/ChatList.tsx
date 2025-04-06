// components/ChatList.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// components/chat-list.tsx
export function ChatList() {
    return (
        <aside className="sticky top-0 h-screen w-96 border-r bg-background/95 backdrop-blur shadow-xl">
            <div className="border-b p-6">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Zephyr
                </h1>
            </div>

            <ScrollArea className="h-[calc(100vh-88px)]">
                <div className="space-y-1.5 p-4">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <Card
                            key={i}
                            className="p-4 hover:bg-accent/50 transition-all transform hover:-translate-y-0.5
              border-border/30 hover:border-primary/20 cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                                        <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/30">
                                            U{i + 1}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        Chat {i + 1}
                                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                      3 new
                    </span>
                                    </h3>
                                    <p className="text-muted-foreground line-clamp-2 mt-1 text-sm">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        Quisquam, voluptatum.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </aside>
    );
}