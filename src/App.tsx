import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Report } from './types';

// Importação das tuas páginas
import Home from './pages/Home';
import ReportsPage from './pages/ReportsPage';
import NewReport from './pages/NewReport';
import Dashboard from './pages/Dashboard';

// Importação do CSS (ajustado para o caminho padrão)
import './styles/app.css';

const KEY = "daily_reports_v2";

function AppContent() {
  const navigate = useNavigate();

  // 1. ESTADO GLOBAL: Carrega os dados do LocalStorage ao iniciar
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [editingReport, setEditingReport] = useState<Report | null>(null);

  // 2. PERSISTÊNCIA: Salva no LocalStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(reports));
  }, [reports]);

  // 3. FUNÇÕES DE MANIPULAÇÃO
  function handleSave(report: Report) {
    if (editingReport) {
      // Atualiza o relatório existente
      setReports(prev => prev.map(r => r.id === report.id ? report : r));
      setEditingReport(null);
    } else {
      // Adiciona um novo relatório ao topo da lista
      setReports(prev => [report, ...prev]);
    }
    // Após guardar, regressa à lista
    navigate('/relatorios');
  }

  function handleDelete(id: string) {
    if (window.confirm("Tens a certeza que queres eliminar este registo?")) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  }

  function handleEdit(report: Report) {
    setEditingReport(report);
    // Redireciona para a página de formulário para edição
    navigate('/novo');
  }

  return (
    <div className="app-layout">
      
      {/* SIDEBAR: Menu de Navegação Lateral */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Diário de Bordo</h2>
          <p>Operacional v2</p>
        </div>
        
        <nav className="nav-menu">
          <Link to="/" onClick={() => setEditingReport(null)}>🏠 Início</Link>
          <Link to="/relatorios">📋 Atividades</Link>
          <Link to="/novo" onClick={() => setEditingReport(null)}>➕ Novo Registo</Link>
          <Link to="/dashboard">📊 Dashboard</Link>
        </nav>

        <div className="sidebar-footer">
          <span>Total: {reports.length}</span>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO: Onde as páginas são renderizadas */}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home reports={reports} />} />
          
          <Route path="/relatorios" element={
            <ReportsPage 
              reports={reports} 
              onDelete={handleDelete} 
              onEdit={handleEdit} 
            />
          } />
          
          <Route path="/novo" element={
            <NewReport 
              onSave={handleSave} 
              editingReport={editingReport} 
            />
          } />
          
          <Route path="/dashboard" element={
            <Dashboard reports={reports} />
          } />
        </Routes>
      </main>
    </div>
  );
}

// Componente principal com o Router para permitir o uso do useNavigate
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}