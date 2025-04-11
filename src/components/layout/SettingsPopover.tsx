// components/SettingsPopover.tsx
"use client";

import * as Popover from "@radix-ui/react-popover";
import { Settings, X } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPopover() {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button className="rounded-full p-2 hover:bg-accent transition-colors">
                    <Settings className="h-5 w-5" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side="top"
                    align="end"
                    sideOffset={8}
                    className="z-50"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-lg bg-background border shadow-lg p-4 w-64"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Настройки</h3>
                            <Popover.Close className="rounded-full p-1 hover:bg-muted">
                                <X className="h-4 w-4" />
                            </Popover.Close>
                        </div>

                        <div className="space-y-2">
                            <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                                Профиль
                            </button>
                            <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                                Уведомления
                            </button>
                            <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                                Тема оформления
                            </button>
                        </div>
                    </motion.div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}