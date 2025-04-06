// app/page.tsx
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import "../globals.css"

export default function Home() {
    return (
        <div className="ml-16 p-6">
            {/* Хедер с поиском */}
            <header className="mb-8">
                <Input
                    type="search"
                    placeholder="Search chats..."
                    className="max-w-[350px]"
                />
            </header>

            {/* Список чатов */}
            <div className="space-y-3 max-w-[350px]">
                {[1, 2, 3, 4, 5].map((item) => (
                    <Card key={item} className="p-4 hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex gap-3 items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-semibold">Teodros Girmay</h4>
                                <p className="text-sm text-muted-foreground">Engineering</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}