"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbPigMoney } from "react-icons/tb";
import { LuWrench } from "react-icons/lu";
import { FaHistory } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useSidebar } from "../../_context/SidebarContext";
import { IoIosLogOut } from "react-icons/io";
import styles from './Sidebar.module.scss';

interface User {
    id: number;
    name: string;
    email: string;
    profileImage: string;
    cpf?: string;
    cnpj?: string;
}

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    const { isOpen, toggleSidebar, closeSidebar } = useSidebar();

    useEffect(() => {
        // Buscar dados do usuário no localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Erro ao parsear dados do usuário:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    const menuItems = [
        { id: 'home', label: 'Início', icon: IoHomeOutline, path: '/dashboard' },
        { id: 'transactions', label: 'Transações', icon: FaHistory, path: '/transactions' },
    ];

    const isActive = (path: string) => {
        return path === pathname;
    }

    return (
        <section id={styles.sidebar} className={isOpen ? '' : styles.closed}>
            <div className={styles.userInfos}>
                <button className={styles.toggleMenuButton} onClick={toggleSidebar}><IoMenu size={20} /></button>
                <div className={styles.imageWrapper}>
                    <Image
                        src={user?.profileImage || "/profile-1.png"}
                        alt="Foto de perfil"
                        width={80}
                        height={80}
                    />
                </div>
                <span className={styles.title}>{user?.name || 'Usuário'}</span>
                <span className={styles.subTitle}>{user?.email || 'email@exemplo.com'}</span>
            </div>
            <div
                className={`${styles.menuItems} ${isOpen ? 'aberta' : 'fechada'}`}
            >
                {
                    menuItems.map((item, index) => {
                        const active = isActive(item.path);
                        const IconComponent = item.icon;

                        return (
                            <div 
                                className={`${styles.menu} ${active ? styles.active : styles.inactive}`} 
                                key={item.id}
                                onClick={() => {
                                    router.push(item.path);
                                    if (window.innerWidth <= 940) {
                                        closeSidebar();
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <IconComponent className={styles.menuIcon} />
                                { item.label }
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.bottomActions}>
                <button
                    onClick={handleLogout}
                    className="btn-warning"
                >
                    <IoIosLogOut size={20} />
                    Sair
                </button>
            </div>
        </section>
    )
}