"use client";

import { SidebarProvider } from "../_context/SidebarContext";
import Sidebar from "../_components/Sidebar/Sidebar";
import { useSidebar } from "../_context/SidebarContext";
import { IoMenu } from "react-icons/io5";
import AuthGuard from "../_components/AuthGuard";
import styles from "./layout.module.scss";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isOpen, toggleSidebar } = useSidebar();

    return (
        <section className={styles.mainContent}>
            <Sidebar />
            <div className={`${styles.contentWrapper} ${isOpen ? styles.collapsed : styles.fullWidth}`}>
                {!isOpen && (
                    <button className={styles.toggleButton} onClick={toggleSidebar}>
                        <IoMenu size={24} />
                    </button>
                )}
                {children}
            </div>
        </section>
    )
}

export default function AuthenticatedLayout({
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    
    return (
        <AuthGuard>
            <SidebarProvider>
                <LayoutContent>{ children }</LayoutContent>
            </SidebarProvider>
        </AuthGuard>
    );
}