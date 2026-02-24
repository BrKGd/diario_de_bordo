import { useState, useEffect } from "react";
import type { Report } from "../types";

interface Props {
  onSave: (report: Report) => void;
  editingReport: Report | null;
}

export default function ReportForm({ onSave, editingReport }: Props) {
  const [formData, setFormData] = useState<Partial<Report>>({
    status: 'Pendente',
    category: 'Preventiva',
    duration: ''
  });

  // Carrega dados para edição
  useEffect(() => {
    if (editingReport) setFormData(editingReport);
  }, [editingReport]);

  // CÁLCULO AUTOMÁTICO DE DURAÇÃO
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const [startH, startM] = formData.startTime.split(':').map(Number);
      const [endH, endM] = formData.endTime.split(':').map(Number);

      let diffInMinutes = (endH * 60 + endM) - (startH * 60 + startM);

      // Ajuste para atividades que cruzam a meia-noite
      if (diffInMinutes < 0) diffInMinutes += 1440; 

      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      const durationString = `${hours}h ${minutes}min`;
      
      if (formData.duration !== durationString) {
        setFormData(prev => ({ ...prev, duration: durationString }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalReport: Report = {
      ...editingReport,
      ...(formData as Report),
      id: editingReport?.id || crypto.randomUUID(),
    };

    onSave(finalReport);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-grid">
            <input type="date" name="date" className="time-input" value={formData.date || ''} onChange={handleChange} required />
            <input type="time" name="startTime" className="time-input" value={formData.startTime || ''} onChange={handleChange} required />
            <input type="time" name="endTime" className="time-input" value={formData.endTime || ''} onChange={handleChange} required />
            
            <input type="text" name="responsible" className="responsible-input" placeholder="OPERADOR RESPONSÁVEL" value={formData.responsible || ''} onChange={handleChange} required />
            
            <select name="category" className="half-width" value={formData.category} onChange={handleChange}>
                <option value="Preventiva">PREVENTIVA</option>
                <option value="Corretiva">CORRETIVA</option>
                <option value="Ronda">RONDA TÁTICA</option>
            </select>

            <select name="status" className="half-width" value={formData.status} onChange={handleChange}>
                <option value="Pendente">PENDENTE</option>
                <option value="Em Andamento">EM CURSO</option>
                <option value="Concluído">CONCLUÍDO</option>
            </select>

            <textarea name="activities" placeholder="DESCRIÇÃO DAS ATIVIDADES" className="full-width" rows={4} value={formData.activities || ''} onChange={handleChange} required />
            
            <textarea name="observations" placeholder="OBSERVAÇÕES DE CAMPO" className="full-width" rows={2} value={formData.observations || ''} onChange={handleChange} />
            
            <div className="container-btn">
                <button type="submit" className="btn-deploy">
                    {editingReport ? 'ATUALIZAR' : 'SUBMETER'}
                </button>
            </div>
        </div>
    </form>
  );
}