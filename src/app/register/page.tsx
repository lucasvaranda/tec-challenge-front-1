"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaIdCard } from "react-icons/fa";
import styles from './page.module.scss';
import { RegisterFormData } from "../_core/models/user";
import Image from "next/image";

const maskCPF = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskCNPJ = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
};

const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
};

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>({
        type: 'natural',
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        cpf: "",
        cnpj: "",
    });
    const [errors, setErrors] = useState<string[]>([]);

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const masked = formData.type === 'natural' ? maskCPF(value) : maskCNPJ(value);
        
        setFormData({
            ...formData,
            [formData.type === 'natural' ? 'cpf' : 'cnpj']: masked
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (formData.password.length < 6) {
            newErrors.push("A senha deve ter no mínimo 6 caracteres!");
        }

        if (formData.type === 'natural') {
            if (!formData.cpf || !validateCPF(formData.cpf)) {
                newErrors.push("CPF inválido!");
            }
        } else {
            if (!formData.cnpj || !validateCNPJ(formData.cnpj)) {
                newErrors.push("CNPJ inválido!");
            }
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: formData.type,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    cpf: formData.cpf?.replace(/\D/g, ''),
                    cnpj: formData.cnpj?.replace(/\D/g, ''),
                }),
            });

            const data = await response.json();

            if (data.success) {
                console.log("Usuário criado com ID:", data.userId);
                
                try {
                    const loginResponse = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            password: formData.password,
                        }),
                    });

                    const loginData = await loginResponse.json();

                    if (loginData.success) {
                        localStorage.setItem('user', JSON.stringify(loginData.user));
                        router.push("/dashboard");
                    } else {
                        router.push("/login");
                    }
                } catch (loginError) {
                    console.error("Erro ao fazer login automático:", loginError);
                    router.push("/login");
                }
            } else {
                setErrors([data.message || "Erro ao criar conta. Tente novamente."]);
            }
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            setErrors(["Erro ao criar conta. Tente novamente."]);
        }
    };

    return (
        <div className="auth-page">
            <div className={styles['register-section']}>
                <section className={styles['logo-section']}>
                    <Image
                        src="/register-image.png"
                        alt="Foto de perfil"
                        width={600}
                        height={200}
                    />
                </section>
                <section className={styles['form-section']}>
                    <span className={styles.title}>REGISTRAR-SE</span>
                    <span className={styles.subtitle}>Crie sua conta para aproveitar tudo que a Pós Bank pode lhe oferecer!</span>

                    {errors.length > 0 && (
                        <div className={styles['error-box']}>
                            {errors.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles['form']}>
                        {/* Tipo de Pessoa */}
                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Tipo de Pessoa</label>
                            <div className={styles['radio-group']}>
                                <label className={styles['radio-label']}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="natural"
                                        checked={formData.type === 'natural'}
                                        onChange={(e) => setFormData({ ...formData, type: 'natural', cpf: '', cnpj: '' })}
                                    />
                                    <span>Pessoa Física</span>
                                </label>
                                <label className={styles['radio-label']}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="legal"
                                        checked={formData.type === 'legal'}
                                        onChange={(e) => setFormData({ ...formData, type: 'legal', cpf: '', cnpj: '' })}
                                    />
                                    <span>Pessoa Jurídica</span>
                                </label>
                            </div>
                        </div>

                        {/* Nome */}
                        <div className={styles['form-group']}>
                            <label htmlFor="name" className={styles['form-label']}>
                                <FaUser className={styles['form-icon']} />
                                Nome {formData.type === 'legal' ? 'da Empresa' : 'Completo'}
                            </label>
                            <input
                                type="text"
                                id="name"
                                className={styles['form-input']}
                                placeholder={formData.type === 'legal' ? "Empresa..." : "Nome..."}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* CPF ou CNPJ */}
                        <div className={styles['form-group']}>
                            <label htmlFor="document" className={styles['form-label']}>
                                <FaIdCard className={styles['form-icon']} />
                                {formData.type === 'natural' ? 'CPF' : 'CNPJ'}
                            </label>
                            <input
                                type="text"
                                id="document"
                                className={styles['form-input']}
                                placeholder={formData.type === 'natural' ? "000.000.000-00" : "00.000.000/0000-00"}
                                value={formData.type === 'natural' ? formData.cpf : formData.cnpj}
                                onChange={handleDocumentChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className={styles['form-group']}>
                            <label htmlFor="email" className={styles['form-label']}>
                                <FaEnvelope className={styles['form-icon']} />
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={styles['form-input']}
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Senha */}
                        <div className={styles['form-group']}>
                            <label htmlFor="password" className={styles['form-label']}>
                                <FaLock className={styles['form-icon']} />
                                Senha
                            </label>
                            <div className={styles['password-wrapper']}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className={styles['form-input']}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className={styles['password-toggle']}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-standard btn-primary">
                            Criar Conta
                        </button>

                        <div className={styles['footer-link']}>
                            <p>
                                Já tem uma conta?{" "}
                                <Link href="/login">Fazer login</Link>
                            </p>
                        </div>

                        <div className={styles['back-link']}>
                            <Link href="/">← Voltar para início</Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
