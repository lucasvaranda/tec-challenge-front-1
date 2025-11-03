"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Email ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Pos Bank</h1>
            <p className="auth-subtitle">Faça login na sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div style={{
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#c33',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="form-icon" />
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="form-icon" />
                Senha
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-standard btn-primary"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, height: '40px' }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Não tem uma conta?{" "}
              <Link href="/register" className="auth-link">
                Criar conta
              </Link>
            </p>
          </div>

          <div className="back-home">
            <Link href="/" className="back-link">
              ← Voltar para início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
