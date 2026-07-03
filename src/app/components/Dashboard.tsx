import { useState, useEffect } from "react";
import { Patient, PATIENTS } from "./PatientData";
import { Activity, Heart, AlertTriangle, Users, Watch, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

interface DashboardProps {
  userName: string;
  onSelectPatient: (p: Patient) => void;
  isDark: boolean;
}

const statusColors = {
  stable: { bg: "rgba(16,185,129,0.15)", text: "#10b981", label: "Estable" },
  alert: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", label: "Alerta" },
  critical: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", label: "Crítico" },
};

const emotionColors = {
  tranquilo: { bg: "rgba(13,148,136,0.15)", text: "var(--primary)" },
  activo: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  agitado: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

function MiniChart({ data, color }: { data: { value: number }[]; color: string }) {
  const last6 = data.slice(-6);
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={last6} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Dashboard({ userName, onSelectPatient, isDark }: DashboardProps) {
  const [patients] = useState<Patient[]>(PATIENTS);
  const [liveData, setLiveData] = useState<Record<string, number>>(() =>
    Object.fromEntries(patients.map((p) => [p.id, p.pulse]))
  );

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => {
        const next = { ...prev };
        patients.forEach((p) => {
          const drift = Math.floor(Math.random() * 6) - 3;
          next[p.id] = Math.max(60, Math.min(160, prev[p.id] + drift));
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [patients]);

  const stable = patients.filter((p) => p.status === "stable").length;
  const alerts = patients.filter((p) => p.status === "alert").length;
  const critical = patients.filter((p) => p.status === "critical").length;

  const today = new Date();
  const dateStr = today.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ color: "var(--foreground)" }}>Bienvenido, {userName.split("@")[0]}</h1>
          <p className="text-sm capitalize" style={{ color: "var(--muted-foreground)" }}>{dateStr}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--chart-4)" }} />
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {patients.length} dispositivos activos
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total pacientes", value: patients.length, color: "var(--primary)", bg: "rgba(13,148,136,0.1)" },
          { icon: Activity, label: "Estables", value: stable, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { icon: AlertTriangle, label: "En alerta", value: alerts, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
          { icon: Heart, label: "Críticos", value: critical, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="rounded-2xl p-4 border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl" style={{ color: "var(--foreground)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Group pulse chart */}
      <div className="rounded-2xl border p-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "var(--foreground)" }}>Pulso promedio del grupo</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Últimas 24 horas</p>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--primary)" }}>
            <TrendingUp className="w-3 h-3" />
            En vivo
          </div>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart
            data={PATIENTS[0].pulseHistory.map((h, i) => ({
              time: h.time,
              value: Math.round(PATIENTS.reduce((acc, p) => acc + p.pulseHistory[i]?.value, 0) / PATIENTS.length),
            }))}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradGroup" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              itemStyle={{ color: "var(--primary)" }}
            />
            <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2}
              fill="url(#gradGroup)" dot={false} animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Patient cards */}
      <div>
        <h3 className="mb-3" style={{ color: "var(--foreground)" }}>Alertas recientes</h3>
        <div className="space-y-3">
          {patients.slice(0, 5).map((p) => {
            const sc = statusColors[p.status];
            const ec = emotionColors[p.emotionalState];
            const lp = liveData[p.id] ?? p.pulse;
            return (
              <div key={p.id}
                className="rounded-2xl border p-4 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
                onClick={() => onSelectPatient(p)}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: sc.bg }}>
                  <span className="text-sm" style={{ color: sc.text }}>
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate" style={{ color: "var(--foreground)" }}>{p.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{p.age} años</span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{p.deviceId}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: ec.bg, color: ec.text }}>
                      {p.emotionalState}
                    </span>
                  </div>
                </div>
                {/* Mini chart */}
                <div className="w-20 hidden sm:block">
                  <MiniChart data={p.pulseHistory} color={sc.text} />
                </div>
                {/* Live pulse */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sc.text }} />
                    <span className="text-lg" style={{ color: "var(--foreground)" }}>{lp}</span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>bpm</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
