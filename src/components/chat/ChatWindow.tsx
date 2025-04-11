import { useEffect, useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from "@/utils/supabase/client"

interface Profile {
    id: string
    avatar_url?: string
    full_name?: string
}

interface Message {
    message_id: number
    sender_id: string
    receiver_id: string
    content: string
    created_at: string
    is_read: boolean
    sender: Profile
}

interface MessageBubbleProps {
    message: Message
    isCurrentUser: boolean
}

const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => (
    <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        <Avatar className="h-9 w-9">
            <AvatarImage src={message.sender.avatar_url} />
            <AvatarFallback>
                {message.sender.full_name?.[0] || 'U'}
            </AvatarFallback>
        </Avatar>
        <div
            className={`max-w-[75%] rounded-xl p-4 ${
                isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-[#e8f5e9] text-[#1b5e20] rounded-bl-none shadow-sm'
            }`}
        >
            <p className="text-sm">{message.content}</p>
            <p
                className={`text-xs mt-2 ${
                    isCurrentUser
                        ? 'text-primary-foreground/70'
                        : 'text-[#1b5e20]/80'
                }`}
            >
                {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </div>
    </div>
)

export function ChatWindow({ receiverId }: { receiverId: string }) {
    const supabase = createClient()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const currentUserId = useRef<string | null>(null)
    const scrollViewportRef = useRef<HTMLDivElement>(null)
    const wsRef = useRef<WebSocket | null>(null)

    // 1. Загрузка текущего пользователя
    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            currentUserId.current = user?.id || null
            console.log('[Auth] Current user:', currentUserId.current)
        }
        loadUser()
    }, [])

    // 2. Загрузка истории сообщений
    useEffect(() => {
        const loadMessages = async () => {
            if (!currentUserId.current || !receiverId) return

            console.log('[Messages] Loading history...')

            const { data, error } = await supabase
                .from('messages')
                .select(`
                    message_id,
                    sender_id,
                    receiver_id,
                    content,
                    created_at,
                    is_read,
                    sender:profiles!sender_id (id, avatar_url, full_name)
                `)
                .or(
                    `and(sender_id.eq.${currentUserId.current},receiver_id.eq.${receiverId}),` +
                    `and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId.current})`
                )
                .order('created_at', { ascending: true })

            if (error) {
                console.error('[Messages] Load error:', error)
            } else {
                console.log('[Messages] Loaded:', data.length)
                setMessages(data as Message[])
            }
        }

        loadMessages()
    }, [receiverId, currentUserId.current])

    // 3. Инициализация WebSocket
    useEffect(() => {
        if (!currentUserId.current || !receiverId) return

        console.log('[WebSocket] Инициализация подключения...')

        const ws = new WebSocket(
            `wss://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '')}` +
            `/realtime/v1/websocket?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}&vsn=1.0.0`
        )

        wsRef.current = ws

        // 1. Обработчик открытия соединения
        ws.onopen = () => {
            console.log('[WebSocket] Подключено')

            // 2. Правильный формат подписки с использованием синтаксиса Supabase
            const subscribePayload = {
                topic: `realtime:public:messages`,
                event: "phx_join",
                payload: {
                    config: {
                        filter: `or(and(sender_id.eq.${currentUserId.current},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId.current})`
                    }
                },
                ref: "1"
            }

            console.log('[WebSocket] Отправка подписки:', JSON.stringify(subscribePayload))
            ws.send(JSON.stringify(subscribePayload))
        }

        // 3. Обработчик входящих сообщений
        ws.onmessage = async (event) => {
            console.log('[WebSocket] Получено сообщение:', event.data)

            try {
                const data = JSON.parse(event.data)

                // 4. Обрабатываем только INSERT события
                if (data.event === "INSERT") {
                    const record = data.payload.record
                    console.log('[WebSocket] Новое сообщение:', record)

                    // 5. Проверяем принадлежность сообщения текущему чату
                    if (
                        (record.sender_id === currentUserId.current && record.receiver_id === receiverId) ||
                        (record.sender_id === receiverId && record.receiver_id === currentUserId.current)
                    ) {
                        // 6. Получаем данные отправителя
                        const { data: sender } = await supabase
                            .from('profiles')
                            .select('id, avatar_url, full_name')
                            .eq('id', record.sender_id)
                            .single()

                        // 7. Обновляем состояние
                        setMessages(prev => [...prev, {
                            ...record,
                            sender: sender || { id: record.sender_id }
                        } as Message])
                    }
                }
            } catch (error) {
                console.error('[WebSocket] Ошибка обработки:', error)
            }
        }

        // Остальные обработчики...
    }, [receiverId, currentUserId.current])
    // 9. Отправка сообщений
    const sendMessage = async () => {
        if (!newMessage.trim() || !currentUserId.current) return

        console.log('[Send] Starting...')

        const tempId = Date.now()
        try {
            // 10. Оптимистичное обновление
            setMessages(prev => [...prev, {
                message_id: tempId,
                sender_id: currentUserId.current!,
                receiver_id: receiverId,
                content: newMessage.trim(),
                created_at: new Date().toISOString(),
                is_read: false,
                sender: {
                    id: currentUserId.current!,
                    full_name: 'Вы',
                    avatar_url: ''
                }
            }])
            setNewMessage('')

            // 11. Отправка на сервер
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    sender_id: currentUserId.current,
                    receiver_id: receiverId,
                    content: newMessage.trim()
                })
                .select('*, sender:profiles!sender_id(*)')

            if (error) throw error

            // 12. Обновление сообщения
            setMessages(prev =>
                prev.map(m =>
                    m.message_id === tempId ? data[0] as Message : m
                )
            )
        } catch (error) {
            console.error('[Send] Error:', error)
            setMessages(prev =>
                prev.filter(m => m.message_id !== tempId)
            )
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4 border-t">
                <div ref={scrollViewportRef} className="h-[calc(100vh-180px)]">
                    <div className="space-y-4 pr-4">
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.message_id}
                                message={message}
                                isCurrentUser={message.sender_id === currentUserId.current}
                            />
                        ))}
                    </div>
                </div>
            </ScrollArea>

            <div className="sticky bottom-0 bg-background border-t p-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage()
                    }}
                    className="flex items-end gap-2"
                >
                    <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="resize-none min-h-[56px] max-h-32 rounded-2xl px-6 py-4"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full h-11 w-11"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M3 20v-6l8-2l-8-2V4l19 8z"
                            />
                        </svg>
                    </Button>
                </form>
            </div>
        </div>
    )
}