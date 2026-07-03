import { useState } from "react";
import { Patient, PATIENTS } from "./PatientData";
import { Search, Plus, Filter, Heart, Activity, Thermometer } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RegisterPatientDialog } from "./RegisterPatientDialog";

interface PatientListProps {
  onSelectPatient: (p: Patient) => void;
  isDark: boolean;
}

const statusColors = {
  stable: { bg: "rgba(16,185,129,0.15)", text: "#10b981", dot: "#10b981", label: "Estable" },
  alert: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", dot: "#f59e0b", label: "Alerta" },
  critical: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", dot: "#ef4444", label: "Crítico" },
};

export function PatientList({ onSelectPatient, isDark }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>(PATIENTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "stable" | "alert" | "critical">("all");
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleNewPatient = (data: Omit<Patient, "id" | "pulseHistory" | "stabilityHistory" | "movementHistory" | "episodes" | "lastSync">) => {
    const newP: Patient = {
      ...data,
      id: String(patients.length + 1),
      lastSync: "Ahora",
      pulseHistory: Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, "0")}:00`,
        value: Math.round(data.pulse + (Math.random() * 20 - 10)),
      })),
      stabilityHistory: Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, "0")}:00`,
        value: Math.round(70 + (Math.random() * 30 - 15)),
      })),
      movementHistory: Array.from({ length: 12 }, (_, i) => ({
        time: `${String(i * 2).padStart(2, "0")}:00`,
        value: Math.round(50 + (Math.random() * 40 - 20)),
      })),
      episodes: [],
    };
    setPatients((prev) => [...prev, newP]);
    setShowRegister(false);
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ color: "var(--foreground)" }}>Lista de pacientes</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {filtered.length} paciente{filtered.length !== 1 ? "s" : ""} registrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setShowRegister(true)}
          className="rounded-xl flex items-center gap-2"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          <Plus className="w-4 h-4" />
          Nuevo paciente
        </Button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
          <Input
            placeholder="Buscar por nombre o dispositivo..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-9 rounded-xl h-10"
            style={{ background: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "stable", "alert", "critical"] as const).map((f) => {
            const labels = { all: "Todos", stable: "Estables", alert: "Alertas", critical: "Críticos" };
            const active = filterStatus === f;
            return (
              <button key={f}
                onClick={() => { setFilterStatus(f); setCurrentPage(1); }}
                className="px-3 h-10 rounded-xl text-xs border transition-all"
                style={{
                  background: active ? "var(--primary)" : "var(--card)",
                  color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  borderColor: active ? "var(--primary)" : "var(--border)",
                }}>
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        {/* Table header */}
        <div className="grid px-4 py-3 border-b"
          style={{ borderColor: "var(--border)", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 80px" }}>
          {["Paciente", "Edad", "Dispositivo", "Pulso", "SpO₂", "Estado", ""].map((h) => (
            <span key={h} className="text-xs" style={{ color: "var(--muted-foreground)" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {paginated.length === 0 ? (
          <div className="py-12 text-center" style={{ color: "var(--muted-foreground)" }}>
            No se encontraron pacientes
          </div>
        ) : paginated.map((p) => {
          const sc = statusColors[p.status];
          return (
            <div key={p.id}
              className="grid px-4 py-3.5 border-b last:border-b-0 cursor-pointer transition-all hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 80px",
                background: "var(--card)",
              }}
              onClick={() => onSelectPatient(p)}>
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: sc.bg }}>
                  <span className="text-xs" style={{ color: sc.text }}>
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <span className="text-sm truncate" style={{ color: "var(--foreground)" }}>{p.name}</span>
              </div>
              {/* Age */}
              <span className="text-sm self-center" style={{ color: "var(--foreground)" }}>{p.age} años</span>
              {/* Device */}
              <span className="text-xs self-center" style={{ color: "var(--primary)" }}>{p.deviceId}</span>
              {/* Pulse */}
              <div className="flex items-center gap-1 self-center">
                <Heart className="w-3 h-3" style={{ color: "#ef4444" }} />
                <span className="text-sm" style={{ color: "var(--foreground)" }}>{p.pulse}</span>
              </div>
              {/* SpO2 */}
              <div className="flex items-center gap-1 self-center">
                <Activity className="w-3 h-3" style={{ color: "var(--primary)" }} />
                <span className="text-sm" style={{ color: "var(--foreground)" }}>{p.spo2}%</span>
              </div>
              {/* Status */}
              <div className="self-center">
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                  {sc.label}
                </span>
              </div>
              {/* Action */}
              <div className="self-center">
                <button className="text-xs px-3 py-1 rounded-lg transition-all"
                  style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}>
                  Ver
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Mostrando {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} de {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg text-xs border transition-all disabled:opacity-40"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button key={pg}
                onClick={() => setCurrentPage(pg)}
                className="w-7 h-7 rounded-lg text-xs border transition-all"
                style={{
                  background: pg === currentPage ? "var(--primary)" : "var(--card)",
                  color: pg === currentPage ? "var(--primary-foreground)" : "var(--foreground)",
                  borderColor: pg === currentPage ? "var(--primary)" : "var(--border)",
                }}>
                {pg}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg text-xs border transition-all disabled:opacity-40"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              Siguiente
            </button>
          </div>
        </div>
      )}

      <RegisterPatientDialog
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onSave={handleNewPatient}
      />
    </div>
  );
}
