import ReportList from "../components/ReportList";
import type { Report } from "../types";

interface Props {
  reports: Report[];
  onDelete: (id: string) => void;
  onEdit: (report: Report) => void;
}

export default function ReportsPage({ reports, onDelete, onEdit }: Props) {
  return (
    <div className="page">
      <div className="header-actions">
        <h1>Relatórios Registrados</h1>
      </div>
      <ReportList reports={reports} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}