"use client"

export default function Page() {
    const [selectedUser, setSelectedUser] = useState<{
        id: string
        name: string
        email: string
        avatar: string
    } | null>(null)

    const handleUserSelect = (user: IUser) => {
        setSelectedUser({
            id: user.id,
            name: user.full_name,
            email: user.email,
            avatar: user.avatar_url
        })
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "350px",
            } as React.CSSProperties}
        >
            <AppSideBar onUserSelect={handleUserSelect}/>
            <SidebarInset className="flex flex-col">
                {selectedUser && (
                    <>
                        {/* Шапка с информацией о пользователе */}
                        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                            <div className="flex items-center gap-3">
                                {selectedUser.avatar ? (
                                    <img
                                        src={selectedUser.avatar}
                                        alt="Avatar"
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                                        {selectedUser.name[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <Separator orientation="vertical" className="h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            {selectedUser.name}
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        </header>

                        {/* Окно чата */}
                        <ChatWindow
                            receiverId={selectedUser.id}
                            className="flex-1 overflow-hidden"
                        />
                    </>
                )}

                {/* Состояние когда пользователь не выбран */}
                {!selectedUser && (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-center text-muted-foreground">
                            <p className="text-lg font-medium">Select a chat to start messaging</p>
                            <p className="text-sm mt-2">Choose a contact from the sidebar</p>
                        </div>
                    </div>
                )}
            </SidebarInset>
        </SidebarProvider>
    )
}

import { AppSideBar } from "@/components/layout/AppSideBar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import React, { useState } from "react"
import { ChatWindow } from "@/components/chat/ChatWindow" // Импортируем компонент чата

interface IUser {
    id: string
    full_name: string
    email: string
    avatar_url: string
}

