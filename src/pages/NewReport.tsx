import ReportForm from "../components/ReportForm";
import type { Report } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  onSave: (report: Report) => void;
  editingReport: Report | null;
}

export default function NewReport({ onSave, editingReport }: Props) {
  const navigate = useNavigate();

  const handleSaveAndRedirect = (report: Report) => {
    onSave(report); // Envia para o App.tsx
    navigate("/relatorios"); // Redireciona para a lista (ajuste a rota se necessário)
  };

  return (
    <div className="page">
      <h1 className="tactic-title">Instruções de Missão / {editingReport ? 'Edição' : 'Novo Registo'}</h1>
      <ReportForm onSave={handleSaveAndRedirect} editingReport={editingReport} />
    </div>
  );
}