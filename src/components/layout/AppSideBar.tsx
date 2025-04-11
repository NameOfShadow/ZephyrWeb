"use client"

import React, { useState, useEffect } from "react"
import { Command, MessagesSquare, Github } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

import { NavUser } from "@/components/layout/NavUser"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

const data = {
    user: {
        full_name: "...",
        email: "...",
        avatar_url: "...",
    },
    navMain: [
        {
            title: "Chats",
            url: "#",
            icon: MessagesSquare,
            isActive: true,
        },
        {
            title: "GitHub",
            url: "https://github.com",
            icon: Github,
            isActive: false,
        },
    ],
}

interface IUser {
    id: string
    full_name: string
    email: string
    avatar_url: string
}

interface AppSideBarProps {
    onUserSelect: (user: IUser) => void
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export function AppSideBar({ onUserSelect, ...restProps }: AppSideBarProps) {
    const [activeItem, setActiveItem] = useState(data.navMain[0])
    const [users, setUsers] = useState<any[]>([])
    const { setOpen } = useSidebar()
    const [userData, setUserData] = useState<{
        full_name: string
        email: string
        avatar_url: string
    } | null>(null)
    const supabase = createClient()
    const router = useRouter()

    // Загрузка данных пользователя и списка контактов
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Получаем данные текущего пользователя
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // Загружаем профиль пользователя
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, email, avatar_url')
                    .eq('id', user.id)
                    .single()

                // Обновляем стейт с данными пользователя
                setUserData({
                    full_name: profile?.full_name || "User",
                    email: profile?.email || user.email || "no-email",
                    avatar_url: profile?.avatar_url || ""
                })

                // Загружаем список пользователей сразу после получения данных
                const { data: users, error } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, avatar_url')
                    .neq('email', profile?.email || user.email)
                    .order('full_name', { ascending: true })

                if (!error && users) {
                    setUsers(users)
                }

            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchInitialData()
    }, [])

    const handleNavClick = async (item: any) => {
        setActiveItem(item)
        setOpen(true)

        if (item.title === "GitHub") {
            window.location.href = item.url
        }
    }

    const handleUserClick = (user: any) => {
        onUserSelect?.({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            avatar_url: user.avatar_url
        })
    }

    const dynamicData = {
        ...data,
        user: userData || data.user
    }

    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
            {...restProps }
        >
            <Sidebar
                collapsible="none"
                className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                                <a href="#">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Command className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Acme Inc</span>
                                        <span className="truncate text-xs">Enterprise</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {data.navMain.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={{ children: item.title, hidden: false }}
                                            onClick={() => handleNavClick(item)}
                                            isActive={activeItem?.title === item.title}
                                            className="px-2.5 md:px-2"
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={dynamicData.user} />
                </SidebarFooter>
            </Sidebar>

            <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="text-base font-medium text-foreground">
                            {activeItem.title}
                        </div>
                    </div>
                    {activeItem.title === "Chats" && <SidebarInput placeholder="Search users..." />}
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {activeItem.title === "Chats" && users.map((user) => {
                                const firstNameLetter = user.full_name?.[0]?.toUpperCase() ||
                                    user.email?.[0]?.toUpperCase() || '?';

                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserClick(user)}
                                        className="relative hover:bg-accent/50 transition-colors cursor-pointer"
                                        style={{ isolation: 'isolate' }}
                                    >
                                        <div className="flex items-center gap-3 p-4 border-b">
                                            {/* Аватарка */}
                                            <div className="shrink-0 pointer-events-none">
                                                {user.avatar_url ? (
                                                    <img
                                                        src={user.avatar_url}
                                                        alt="Avatar"
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                                        {firstNameLetter}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Текстовый контент */}
                                            <div className="min-w-0 pointer-events-none">
                                                <div className="font-medium truncate">
                                                    {user.full_name || "Unknown User"}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Акцентная полоска */}
                                        <div className="absolute inset-y-0 left-0 w-1 bg-transparent transition-colors duration-300 pointer-events-none"
                                             style={{ backgroundColor: 'inherit' }} />
                                    </div>
                                );
                            })}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </Sidebar>
    )
}