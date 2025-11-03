"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SidebarContextType {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProdivderProps {
    children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProdivderProps) {
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth > 940;
        }
        return true;
    });
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsOpen((prev: boolean) => !prev)
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const isMobile = window.innerWidth <= 940;
        if (isMobile) {
            setIsOpen(false);
        }
    }, [pathname]);

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);

    if(context === undefined) {
        throw new Error('useSidebar deve ser usado dentro de um SidebarProvider');
    }

    return context;
}
