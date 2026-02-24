import type { Report } from "../types";

interface Props {
  report: Report;
  onDelete: (id: string) => void;
  onEdit: (report: Report) => void;
}

export default function ReportItem({ report, onDelete, onEdit }: Props) {
  const statusClass = report.status.toLowerCase().replace(/\s+/g, "");

  // Formata Data: YYYY-MM-DD para DD/MM/YYYY
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return "---";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={`report-card ${statusClass}`}>
  
  <div className="report-header">
    <h3 className="report-title">{report.activities}</h3>
    <span className="duration-badge">{report.duration}</span>
  </div>

  <div className="report-meta">
    <span>📅 {formatDateBR(report.date)}</span>
    <span>⏰ {report.startTime} - {report.endTime}</span>
  </div>

  <div className="report-operator">
    👤 {report.responsible}
  </div>

  <div className="report-observations">
    <strong>📝 Observações</strong>
    <p>{report.observations}</p>
  </div>

  <div className="report-actions">
    <button className="btn btn-edit" onClick ={() => onEdit(report)}>Editar</button>
    <button className="btn btn-delete" onClick={() => onDelete(report.id)}>Excluir</button>
  </div>

</div>
  );
}