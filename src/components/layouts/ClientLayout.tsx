// components/ClientLayout.tsx
//"use client";
//
//import { useState } from "react";
//import SideBar from "@/components/SideBar";
//import SettingsPanel from "@/components/SettingsPopover";
//
//export default function ClientLayout({ children }: { children: React.ReactNode }) {
//    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//
//    return (
        //        <div className="grid grid-cols-[auto_auto_1fr] h-screen">
//            <SideBar onSettingsOpen={() => setIsSettingsOpen(true)} />
//            {children}
//            <SettingsPanel
//                isOpen={isSettingsOpen}
//                onClose={() => setIsSettingsOpen(false)}
//            />
//        </div>
        //    );
//}