import type { Patient } from "./patient.types";
import { getPatientStatus, getEmotionalState, getCurrentPulse, getLatestDailyRecord, formatEpisodeType, formatDuration } from "./patientHelpers";
import { ArrowLeft, Heart, AlertTriangle, Watch } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, AreaChart, Area,
} from "recharts";


interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  isDark: boolean;
}


const statusColors = {
  stable: { text: "#10b981", label: "Estable" },
  alert: { text: "#f59e0b", label: "Alerta" },
  critical: { text: "#ef4444", label: "Crítico" },
};


const emotionColors = {
  tranquilo: "#10b981",
  activo: "#f59e0b",
  agitado: "#ef4444",
};


function StatCard({ label, value, unit, color, icon: Icon }: {
  icon: React.ElementType; label: string; value: string | number; unit: string; color: string;
}) {
  return (
    <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl" style={{ color: "var(--foreground)" }}>
        {value}
        <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>{unit}</span>
      </p>
    </div>
  );
}


export function PatientDetail({ patient, onBack, isDark }: PatientDetailProps) {
  const status = getPatientStatus(patient);
  const emotion = getEmotionalState(patient);
  const sc = statusColors[status];
  const ec = emotionColors[emotion];
  const age = new Date().getFullYear() - patient.birthYear;
  const currentPulse = getCurrentPulse(patient);
  const latest = getLatestDailyRecord(patient);

  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "#7ecdc8" : "#5f9ea0";

  const sortedRecords = [...(patient.dailyRecords ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const pulseChartData = sortedRecords.map((r) => ({
    time: new Date(r.date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
    value: r.avgBpm,
  }));

  const stabilityChartData = sortedRecords.map((r) => ({
    time: new Date(r.date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
    value: Math.round(r.tranquilPct),
  }));

  const sortedEpisodes = [...(patient.episodes ?? [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:opacity-80"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h2 style={{ color: "var(--foreground)" }}>Perfil del paciente</h2>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Registrado desde: {new Date(patient.createdAt).toLocaleDateString("es-ES")}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: `${sc.text}20`, color: sc.text }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: sc.text }} />
          <span className="text-xs">{sc.label}</span>
        </div>
      </div>

      <div className="rounded-2xl border p-5 flex items-center gap-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${sc.text}20` }}>
          <span className="text-2xl" style={{ color: sc.text }}>
            {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </span>
        </div>
        <div className="flex-1">
          <h3 style={{ color: "var(--foreground)" }}>{patient.name}</h3>
          <div className="flex flex-wrap gap-3 mt-1">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{age} años</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>|</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Nacimiento: {patient.birthYear}</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>|</span>
            <div className="flex items-center gap-1">
              <Watch className="w-3 h-3" style={{ color: "var(--primary)" }} />
              <span className="text-xs" style={{ color: "var(--primary)" }}>{patient.code}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${ec}20`, color: ec }}>
              Estado emocional: {emotion}
            </span>
          </div>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl" style={{ color: "var(--foreground)" }}>{currentPulse ?? "--"}</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>bpm</span>
          </div>
          <div className="flex items-center gap-1 justify-center mt-1">
            <Heart className="w-3 h-3" style={{ color: "#ef4444" }} />
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Último registro</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard icon={Heart} label="BPM promedio" value={latest?.avgBpm ?? "--"} unit="bpm" color="#ef4444" />
        <StatCard icon={Heart} label="BPM máximo (hoy)" value={latest?.maxBpm ?? "--"} unit="bpm" color="#f59e0b" />
        <StatCard icon={AlertTriangle} label="Alertas (hoy)" value={latest?.alertsCount ?? 0} unit="" color="#6366f1" />
      </div>

      <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "var(--foreground)" }}>Historial de pulso</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Por día registrado</p>
          </div>
        </div>
        {pulseChartData.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--muted-foreground)" }}>Sin registros aún.</p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={pulseChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="gradPulse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
              <YAxis domain={[50, 170]} tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                itemStyle={{ color: "#ef4444" }}
              />
              <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2}
                fill="url(#gradPulse)" dot={false} name="BPM promedio" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "var(--foreground)" }}>Estabilidad (% tranquilo)</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Por día registrado</p>
          </div>
        </div>
        {stabilityChartData.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--muted-foreground)" }}>Sin registros aún.</p>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={stabilityChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                itemStyle={{ color: "var(--primary)" }}
              />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5}
                dot={false} name="% Tranquilo" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {sortedEpisodes.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <h3 style={{ color: "var(--foreground)" }}>Episodios recientes</h3>
          </div>
          <div className="space-y-3">
            {sortedEpisodes.map((ep) => {
              const intensityColor = ep.type === "AGITATION" ? "#ef4444" : ep.type === "STRESS" ? "#f59e0b" : "#10b981";
              return (
                <div key={ep.id} className="flex items-center justify-between py-3 border-b last:border-b-0"
                  style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-sm" style={{ color: "var(--foreground)" }}>{formatEpisodeType(ep.type)}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(ep.timestamp).toLocaleString("es-ES")} · {formatDuration(ep.duration)} · pico {ep.bpmPeak} bpm
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: `${intensityColor}20`, color: intensityColor }}>
                    {formatEpisodeType(ep.type)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}