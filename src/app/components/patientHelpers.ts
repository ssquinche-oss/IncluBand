import type { Patient, DailyRecord } from "./patient.types";

export function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

export function getLatestDailyRecord(patient: Patient): DailyRecord | null {
  if (!patient.dailyRecords || patient.dailyRecords.length === 0) return null;
  return [...patient.dailyRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}

export function getCurrentPulse(patient: Patient): number | null {
  const latest = getLatestDailyRecord(patient);
  return latest ? latest.avgBpm : null;
}

// Deriva un estado general a partir del último registro diario
export function getPatientStatus(patient: Patient): "stable" | "alert" | "critical" {
  const latest = getLatestDailyRecord(patient);
  if (!latest) return "stable";
  if (latest.agitatedPct >= 40 || latest.alertsCount >= 3) return "critical";
  if (latest.agitatedPct >= 15 || latest.alertsCount >= 1) return "alert";
  return "stable";
}

// Deriva el estado emocional predominante del último día registrado
export function getEmotionalState(patient: Patient): "tranquilo" | "activo" | "agitado" {
  const latest = getLatestDailyRecord(patient);
  if (!latest) return "tranquilo";
  const { tranquilPct, uncomfortablePct, agitatedPct } = latest;
  if (agitatedPct >= tranquilPct && agitatedPct >= uncomfortablePct) return "agitado";
  if (uncomfortablePct >= tranquilPct) return "activo";
  return "tranquilo";
}

export function formatEpisodeType(type: string): string {
  const map: Record<string, string> = {
    STRESS: "Estrés",
    AGITATION: "Agitación",
    CALM: "Calma",
  };
  return map[type] ?? type;
}

export function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return min > 0 ? `${min} min ${sec}s` : `${sec}s`;
}
