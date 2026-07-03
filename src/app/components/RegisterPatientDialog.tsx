import { useState } from "react";
import { Patient } from "./PatientData";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, UserPlus, AlertCircle, QrCode } from "lucide-react";
import { QRScanner } from "./QRScanner";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Patient, "id" | "pulseHistory" | "stabilityHistory" | "movementHistory" | "episodes" | "lastSync">) => void;
}

export function RegisterPatientDialog({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    deviceId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQR, setShowQR] = useState(false);

  if (!open) return null;

  const handleQRScan = (value: string) => {
    setForm((f) => ({ ...f, deviceId: value }));
    setShowQR(false);
    if (errors.deviceId) setErrors((e) => ({ ...e, deviceId: "" }));
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido.";
    if (!form.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es requerida.";
    } else {
      const age = calculateAge(form.birthDate);
      if (age === null || age < 3 || age > 12) {
        newErrors.birthDate = "El paciente debe tener entre 3 y 12 años.";
      }
    }
    if (!form.deviceId.trim()) newErrors.deviceId = "El ID del dispositivo es requerido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const age = calculateAge(form.birthDate)!;
    onSave({
      name: form.name.trim(),
      age,
      birthDate: form.birthDate,
      deviceId: form.deviceId.trim(),
      status: "stable",
      pulse: 85 + Math.floor(Math.random() * 20),
      spo2: 97 + Math.floor(Math.random() * 3),
      temperature: 36.2 + Math.random() * 0.6,
      steps: Math.floor(Math.random() * 3000),
      emotionalState: "tranquilo",
    });
    setForm({ name: "", birthDate: "", deviceId: "" });
    setErrors({});
  };

  const age = form.birthDate ? calculateAge(form.birthDate) : null;
  const ageValid = age !== null && age >= 3 && age <= 12;

  // Min/max birthdate for ages 3-12
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - 3);
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)", background: "var(--primary)" }}>
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5" style={{ color: "var(--primary-foreground)" }} />
            <div>
              <h3 style={{ color: "var(--primary-foreground)" }}>Registrar nuevo paciente</h3>
              <p className="text-xs opacity-80" style={{ color: "var(--primary-foreground)" }}>
                Solo pacientes de 3 a 12 años
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.2)", color: "var(--primary-foreground)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Age restriction notice */}
        <div className="mx-6 mt-4 p-3 rounded-xl flex items-start gap-2"
          style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs">
            Este sistema registra pacientes pediátricos entre <strong>3 y 12 años</strong> para monitoreo con dispositivo wearable Nelpulsime.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reg-name" style={{ color: "var(--foreground)" }}>Nombre completo del niño</Label>
            <Input
              id="reg-name"
              placeholder="Ej. María González López"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-xl h-10"
              style={{ background: "var(--input-background)", borderColor: errors.name ? "#ef4444" : "var(--border)", color: "var(--foreground)" }}
            />
            {errors.name && <p className="text-xs" style={{ color: "#ef4444" }}>{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-birth" style={{ color: "var(--foreground)" }}>Fecha de nacimiento</Label>
            <Input
              id="reg-birth"
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
              min={minDate.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
              className="rounded-xl h-10"
              style={{ background: "var(--input-background)", borderColor: errors.birthDate ? "#ef4444" : "var(--border)", color: "var(--foreground)" }}
            />
            {form.birthDate && (
              <p className="text-xs flex items-center gap-1"
                style={{ color: ageValid ? "#10b981" : "#ef4444" }}>
                {ageValid ? `✓ Edad válida: ${age} años` : `✗ Edad fuera de rango (${age} años) — solo se aceptan 3–12 años`}
              </p>
            )}
            {errors.birthDate && !form.birthDate && <p className="text-xs" style={{ color: "#ef4444" }}>{errors.birthDate}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-device" style={{ color: "var(--foreground)" }}>ID del dispositivo wearable</Label>
            <div className="flex gap-2">
              <Input
                id="reg-device"
                placeholder="Ej. NP-009"
                value={form.deviceId}
                onChange={(e) => setForm((f) => ({ ...f, deviceId: e.target.value }))}
                className="rounded-xl h-10 flex-1"
                style={{ background: "var(--input-background)", borderColor: errors.deviceId ? "#ef4444" : "var(--border)", color: "var(--foreground)" }}
              />
              <button
                type="button"
                onClick={() => setShowQR(true)}
                title="Escanear QR del dispositivo"
                className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
                style={{ background: "var(--primary)", borderColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                <QrCode className="w-4 h-4" />
              </button>
            </div>
            {form.deviceId && (
              <p className="text-xs flex items-center gap-1" style={{ color: "#10b981" }}>
                ✓ Dispositivo: {form.deviceId}
              </p>
            )}
            {errors.deviceId && <p className="text-xs" style={{ color: "#ef4444" }}>{errors.deviceId}</p>}
          </div>

          {showQR && <QRScanner onScan={handleQRScan} onClose={() => setShowQR(false)} />}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 rounded-xl border transition-all hover:opacity-80"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              Cancelar
            </button>
            <Button type="submit"
              className="flex-1 h-10 rounded-xl"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              Registrar paciente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
