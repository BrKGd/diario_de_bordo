import type { Report } from "../types";

/* =====================================
   UTILIDADES
===================================== */

// Converte qualquer formato de data para string "yyyy-mm-dd"
function normalizarData(date: any): string {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }

  if (typeof date === "string" && date.includes("-")) {
    return date;
  }

  if (typeof date === "string" && date.includes("/")) {
    const [dia, mes, ano] = date.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  return "";
}

function calcularMinutos(inicio: string, fim: string) {
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fim.split(":").map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

function formatarHoras(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m}min`;
}

// Regra da jornada
function cargaDiariaEsperada(dataISO: string) {
  const data = new Date(dataISO);
  const diaSemana = data.getDay();

  if (diaSemana >= 1 && diaSemana <= 4) return 9 * 60; // seg-qui
  if (diaSemana === 5) return 8 * 60; // sexta
  return 0; // fim de semana
}

/* =====================================
   COMPONENTE
===================================== */

export default function Dashboard({ reports }: { reports: Report[] }) {

  const hoje = new Date();
  const hojeISO = hoje.toISOString().split("T")[0];
  const mesAtual = hojeISO.slice(0, 7);
  const anoAtual = hojeISO.slice(0, 4);

  /* ================= STATUS ================= */

  const stats = {
    total: reports.length,
    concluidos: reports.filter(r => r.status === "Concluído").length,
    emAndamento: reports.filter(r => r.status === "Em Andamento").length,
    pendentes: reports.filter(r => r.status === "Pendente").length,
  };

  /* ================= TEMPO GERAL ================= */

  const totalMinutos = reports.reduce((acc, r) => {
    return acc + calcularMinutos(r.startTime, r.endTime);
  }, 0);

  const mediaMinutos =
    reports.length > 0 ? totalMinutos / reports.length : 0;

  const maiorServico =
    reports.length > 0
      ? Math.max(...reports.map(r =>
          calcularMinutos(r.startTime, r.endTime)
        ))
      : 0;

  /* ================= PERFORMANCE DIÁRIA ================= */

  const relatoriosHoje = reports.filter(r => {
    const dataISO = normalizarData(r.date);
    return dataISO === hojeISO;
  });

  const minutosHoje = relatoriosHoje.reduce((acc, r) => {
    return acc + calcularMinutos(r.startTime, r.endTime);
  }, 0);

  const esperadoHoje = cargaDiariaEsperada(hojeISO);
  const pendenteHoje = Math.max(esperadoHoje - minutosHoje, 0);
  const saldoHoje = minutosHoje - esperadoHoje;

  /* ================= PERFORMANCE MENSAL ================= */

  const relatoriosMes = reports.filter(r => {
    const dataISO = normalizarData(r.date);
    return dataISO.startsWith(mesAtual);
  });

  const minutosMes = relatoriosMes.reduce((acc, r) => {
    return acc + calcularMinutos(r.startTime, r.endTime);
  }, 0);

  // Cálculo dinâmico da meta mensal até hoje
  let esperadoMes = 0;
  const diasNoMes = hoje.getDate();

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
    const dataISO = data.toISOString().split("T")[0];
    esperadoMes += cargaDiariaEsperada(dataISO);
  }

  const saldoMes = minutosMes - esperadoMes;

  /* ================= PERFORMANCE ANUAL ================= */

  const relatoriosAno = reports.filter(r => {
    const dataISO = normalizarData(r.date);
    return dataISO.startsWith(anoAtual);
  });

  const minutosAno = relatoriosAno.reduce((acc, r) => {
    return acc + calcularMinutos(r.startTime, r.endTime);
  }, 0);

  /* ================= RENDER ================= */

  return (
    <div className="page">
      <h1>Dashboard Operacional</h1>

      {/* STATUS */}
      <h2 style={{ marginTop: "40px" }}>Indicadores de Status</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="stat-card success">
          <span>Concluídos</span>
          <strong>{stats.concluidos}</strong>
        </div>

        <div className="stat-card warning">
          <span>Em Curso</span>
          <strong>{stats.emAndamento}</strong>
        </div>

        <div className="stat-card danger">
          <span>Pendentes</span>
          <strong>{stats.pendentes}</strong>
        </div>
      </div>

      {/* TEMPO */}
      <h2 style={{ marginTop: "40px" }}>Indicadores de Tempo</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Tempo Total</span>
          <strong>{formatarHoras(totalMinutos)}</strong>
        </div>

        <div className="stat-card">
          <span>Média por Serviço</span>
          <strong>{formatarHoras(Math.floor(mediaMinutos))}</strong>
        </div>

        <div className="stat-card">
          <span>Maior Serviço</span>
          <strong>{formatarHoras(maiorServico)}</strong>
        </div>
      </div>

      {/* PERFORMANCE */}
      <h2 style={{ marginTop: "40px" }}>Indicadores de Performance</h2>
      <div className="stats-grid">

        <div className="stat-card success">
          <span>Horas Cumpridas Hoje</span>
          <strong>{formatarHoras(minutosHoje)}</strong>

          {saldoHoje !== 0 && (
            <div className={`extra-badge ${saldoHoje > 0 ? "positive" : "negative"}`}>
              {saldoHoje > 0 ? "+" : "-"}
              {formatarHoras(Math.abs(saldoHoje))}
            </div>
          )}
        </div>

        <div className="stat-card danger">
          <span>Horas Pendentes Hoje</span>
          <strong>{formatarHoras(pendenteHoje)}</strong>
        </div>

        <div className="stat-card">
          <span>Horas no Mês</span>
          <strong>{formatarHoras(minutosMes)}</strong>

          {saldoMes !== 0 && (
            <div className={`extra-badge ${saldoMes > 0 ? "positive" : "negative"}`}>
              {saldoMes > 0 ? "+" : "-"}
              {formatarHoras(Math.abs(saldoMes))}
            </div>
          )}
        </div>

        <div className="stat-card">
          <span>Horas no Ano</span>
          <strong>{formatarHoras(minutosAno)}</strong>
        </div>

      </div>
    </div>
  );
}