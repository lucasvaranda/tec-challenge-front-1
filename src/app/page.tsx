"use client";

import Link from "next/link";
import { FaShieldAlt, FaChartLine, FaMobile, FaUsers } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bem-vindo ao <span className="brand-name">Pos Bank</span>
          </h1>
          <p className="hero-subtitle">
            O banco digital que transforma sua experiência financeira. 
            Simples, seguro e completo.
          </p>
          <div className="hero-buttons">
            <Link href="/register" className="btn-landing btn-landing-primary">
              Criar Conta
            </Link>
            <Link href="/login" className="btn-landing btn-landing-secondary">
              Fazer Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Por que escolher o Pos Bank?</h2>
        <div className="features-grid">
          <div className="feature-card green">
            <div className="feature-icon">
              <FaShieldAlt size={40} />
            </div>
            <div className="text-content">
              <h3>Segurança</h3>
              <p>Proteção de dados de última geração e autenticação em múltiplas camadas.</p>
            </div>
          </div>

          <div className="feature-card orange">
            <div className="feature-icon">
              <FaChartLine size={40} />
            </div>
            <div className="text-content">
              <h3>Investimentos</h3>
              <p>Acesse as melhores oportunidades de investimento em um só lugar.</p>
            </div>
          </div>

          <div className="feature-card green">
            <div className="feature-icon">
              <FaMobile size={40} />
            </div>
            <div className="text-content">
              <h3>100% Digital</h3>
              <p>Gerencie suas finanças de qualquer lugar, a qualquer momento.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Pronto para começar?</h2>
          <p>Abra sua conta em minutos e descubra um novo jeito de cuidar do seu dinheiro.</p>
          <Link href="/register" className="btn-landing btn-cta">
            Começar Agora
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 Pos Bank. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
