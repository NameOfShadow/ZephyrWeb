// components/ChatWindow.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatWindow({ selectedChat }: { selectedChat: number | null }) {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                200
            )}px`;
        }
    }, [newMessage]);

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, newMessage]);
            setNewMessage("");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen">
            {selectedChat ? (
                <>
                    <div className="h-16 flex items-center px-6 border-b gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${selectedChat}`} />
                            <AvatarFallback>U{selectedChat}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-semibold">Chat {selectedChat}</h2>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-3 max-w-3xl mx-auto">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className="flex justify-end"
                                >
                                    <div className="p-3 rounded-xl bg-primary/10 border-primary/30 border max-w-[80%] break-words">
                                        {msg}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t">
                        <div className="max-w-3xl mx-auto flex gap-2 items-end">
                            <Textarea
                                ref={textareaRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="resize-none rounded-2xl min-h-[44px] max-h-[200px]"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSend}
                                className="rounded-full h-11 w-11 mb-1"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Select a chat to start messaging</p>
                </div>
            )}
        </div>
    );
}