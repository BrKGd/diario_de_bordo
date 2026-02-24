import { Link } from 'react-router-dom';
import type { Report } from '../types';

interface HomeProps {
  reports: Report[];
}

export default function Home({ reports }: HomeProps) {
  // Cálculo de dados para hoje
  const today = new Date().toISOString().split('T')[0];
  const reportsToday = reports.filter(r => r.date === today);
  const pendingCount = reportsToday.filter(r => r.status !== "Concluído").length;
  const getStatusClass = (status: string) => {
    const normalized = status
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
  
    return normalized;
  };

  return (
    <div className="page home-page">
      <header className="home-header">
        <h1>Painel Operacional</h1>
        <p className="subtitle">Bem-vindo ao sistema de gestão Daily Rep</p>
      </header>

      {/* Secção de Resumo Rápido */}
      <section className="welcome-grid">
        <div className="summary-card">
          <h2>Hoje</h2>
          <div className="big-number">{reportsToday.length}</div>
          <p>Registos realizados</p>
          {pendingCount > 0 && (
            <span className="alert-text">⚠️ {pendingCount} ainda pendentes</span>
          )}
        </div>
        
        <div className="summary-card">
          <h2>Histórico</h2>
          <div className="big-number">{reports.length}</div>
          <p>Total de registos no sistema</p>
        </div>
      </section>

      {/* Secção de Acesso Rápido com Cards */}
      <section className="quick-access">
        <h3>Ações Rápidas</h3>
        <div className="action-grid">
          
          <Link to="/novo" className="action-card-link">
            <div className="action-card-icon">➕</div>
            <div className="action-card-info">
              <h4>Novo Relato</h4>
              <p>Registar nova atividade operacional</p>
            </div>
          </Link>

          <Link to="/relatorios" className="action-card-link">
            <div className="action-card-icon">📋</div>
            <div className="action-card-info">
              <h4>Ver Lista</h4>
              <p>Consultar e editar registos passados</p>
            </div>
          </Link>

          <Link to="/dashboard" className="action-card-link">
            <div className="action-card-icon">📊</div>
            <div className="action-card-info">
              <h4>Dashboard</h4>
              <p>Analisar métricas e produtividade</p>
            </div>
          </Link>

        </div>
      </section>

      {/* Mini Listagem das últimas atividades */}
      <section className="recent-activity">
        <h3>Atividades Recentes</h3>
        {reports.length > 0 ? (
          <div className="mini-list">
            {reports.slice(0, 3).map(report => (
              <div key={report.id} className={`mini-item-card ${report.status.replace(/\s/g, '').toLowerCase()}`}>
              <div className="mini-item-left">
                <span className={`status-dot ${getStatusClass(report.status)}`}></span>
                <div className="mini-info">
                  <strong>{report.activities}</strong>
                  <span className="mini-operator">
                    {report.responsible}
                  </span>
                </div>
              </div>
            
              <div className="mini-item-right">
                <span className="mini-duration">
                  {report.duration || 'Em curso'}
                </span>
              </div>
            </div>
            ))}
          </div>
        ) : (
          <p className="empty-msg">Nenhuma atividade registada.</p>
        )}
      </section>
    </div>
  );
}