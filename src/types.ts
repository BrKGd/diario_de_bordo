export interface Report {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  activities: string;
  observations: string;
  responsible: string;
  category: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
}