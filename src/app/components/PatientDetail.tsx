import { useState, useEffect, useRef } from "react";
import { Patient } from "./PatientData";
import { ArrowLeft, Heart, Activity, Thermometer, Footprints, Watch, AlertTriangle } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, AreaChart, Area, BarChart, Bar, Legend
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

function StatCard({ icon: Icon, label, value, unit, color }: {
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
  const sc = statusColors[patient.status];
  const ec = emotionColors[patient.emotionalState];

  // Live pulse animation
  const [livePulse, setLivePulse] = useState(patient.pulse);
  const [liveStability, setLiveStability] = useState(75);
  const [liveData, setLiveData] = useState(patient.pulseHistory.slice(-12));
  const [stabilityData, setStabilityData] = useState(patient.stabilityHistory.slice(-12));

  useEffect(() => {
    const interval = setInterval(() => {
      const newPulse = Math.max(60, Math.min(160, livePulse + Math.floor(Math.random() * 8) - 4));
      const newStability = Math.max(10, Math.min(100, liveStability + Math.floor(Math.random() * 10) - 5));
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      setLivePulse(newPulse);
      setLiveStability(newStability);
      setLiveData((prev) => [...prev.slice(-11), { time: timeStr, value: newPulse }]);
      setStabilityData((prev) => [...prev.slice(-11), { time: timeStr, value: newStability }]);
    }, 1500);
    return () => clearInterval(interval);
  }, [livePulse, liveStability]);

  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "#7ecdc8" : "#5f9ea0";

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:opacity-80"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h2 style={{ color: "var(--foreground)" }}>Perfil del paciente</h2>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Última sincronización: {patient.lastSync}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: `${sc.text}20`, color: sc.text }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: sc.text }} />
          <span className="text-xs">{sc.label}</span>
        </div>
      </div>

      {/* Patient info card */}
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
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{patient.age} años</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>|</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Nacimiento: {patient.birthDate}</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>|</span>
            <div className="flex items-center gap-1">
              <Watch className="w-3 h-3" style={{ color: "var(--primary)" }} />
              <span className="text-xs" style={{ color: "var(--primary)" }}>{patient.deviceId}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${ec}20`, color: ec }}>
              Estado emocional: {patient.emotionalState}
            </span>
          </div>
        </div>
        {/* Live pulse */}
        <div className="text-center flex-shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl" style={{ color: "var(--foreground)" }}>{livePulse}</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>bpm</span>
          </div>
          <div className="flex items-center gap-1 justify-center mt-1">
            <Heart className="w-3 h-3 animate-pulse" style={{ color: "#ef4444" }} />
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>En vivo</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Heart} label="Pulso" value={livePulse} unit="bpm" color="#ef4444" />
        <StatCard icon={Activity} label="SpO₂" value={patient.spo2} unit="%" color="var(--primary)" />
        <StatCard icon={Thermometer} label="Temperatura" value={patient.temperature} unit="°C" color="#f59e0b" />
        <StatCard icon={Footprints} label="Pasos" value={patient.steps.toLocaleString()} unit="hoy" color="#6366f1" />
      </div>

      {/* Live Pulse Chart */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "var(--foreground)" }}>Pulso en tiempo real</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Actualización cada 1.5 segundos</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ background: "#ef4444" }} />
            <span className="text-xs" style={{ color: "#ef4444" }}>En vivo</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={liveData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              fill="url(#gradPulse)" dot={false} isAnimationActive={false} name="Pulso (bpm)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stability Chart */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "var(--foreground)" }}>Estabilidad del niño</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Índice 0–100 · mayor = más estable</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: liveStability > 70 ? "rgba(16,185,129,0.15)" : liveStability > 40 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)", color: liveStability > 70 ? "#10b981" : liveStability > 40 ? "#f59e0b" : "#ef4444" }}>
            <span className="text-sm">{liveStability}</span>
            <span className="text-xs ml-1">/100</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={stabilityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              itemStyle={{ color: "var(--primary)" }}
            />
            <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5}
              dot={false} isAnimationActive={false} name="Estabilidad" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Movement Chart */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "var(--foreground)" }}>Historial de movimiento</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Últimas 24 horas</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={patient.movementHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: axisColor }} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              itemStyle={{ color: "#6366f1" }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Movimiento" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Episodes */}
      {patient.episodes.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <h3 style={{ color: "var(--foreground)" }}>Episodios recientes</h3>
          </div>
          <div className="space-y-3">
            {patient.episodes.map((ep, i) => {
              const intensityColor = ep.intensity === "Alta" ? "#ef4444" : ep.intensity === "Media" ? "#f59e0b" : "#10b981";
              return (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0"
                  style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-sm" style={{ color: "var(--foreground)" }}>{ep.type}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{ep.date} · {ep.duration}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: `${intensityColor}20`, color: intensityColor }}>
                    {ep.intensity}
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
