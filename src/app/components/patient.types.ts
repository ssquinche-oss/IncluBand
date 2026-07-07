export interface Doctor {
  id: number;
  name: string;
  email: string;
}

export interface DailyRecord {
  id: number;
  patientId: number;
  date: string; // ISO date (DateTime @db.Date)
  avgBpm: number;
  maxBpm: number;
  minBpm: number;
  tranquilPct: number;
  uncomfortablePct: number;
  agitatedPct: number;
  alertsCount: number;
  createdAt: string;
}

export type EpisodeType = "STRESS" | "AGITATION" | "CALM";
export type EpisodeAction = "REGISTERED" | "NOTIFICATION";

export interface Episode {
  id: number;
  patientId: number;
  timestamp: string;
  duration: number; // segundos
  bpmStart: number;
  bpmPeak: number;
  type: EpisodeType;
  action: EpisodeAction;
  notes: string | null;
  createdAt: string;
}

export interface MonthlyStat {
  id: number;
  patientId: number;
  year: number;
  month: number;
  peacePct: number;
  alertsPct: number;
  totalAlerts: number;
  createdAt: string;
}

export interface Patient {
  id: number;
  name: string;
  birthYear: number;
  code: string;
  doctorId: number;
  dailyRecords?: DailyRecord[];
  episodes?: Episode[];
  monthlyStats?: MonthlyStat[];
  createdAt: string;
}