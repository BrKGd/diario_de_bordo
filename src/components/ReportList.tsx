import ReportItem from "./ReportItem";
import type { Report } from "../types";

interface Props {
  reports: Report[];
  onDelete: (id: string) => void;
  onEdit: (report: Report) => void;
}

export default function ReportList({ reports, onDelete, onEdit }: Props) {
  if (reports.length === 0) {
    return (
      <div className="empty-state">
        <p>AGUARDANDO DADOS: NENHUM RELATÓRIO NO SISTEMA.</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      {reports.map((report) => (
        <ReportItem
          key={report.id}
          report={report}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}