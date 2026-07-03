import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Watch, Eye, EyeOff, Activity } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string) => void;
  isDark: boolean;
}

export function LoginPage({ onLogin, isDark }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: isDark ? "linear-gradient(135deg, #0a1628 0%, #0f2337 50%, #0a1e30 100%)" : "linear-gradient(135deg, #f0fdf9 0%, #ccfbf1 50%, #e0f2f1 100%)" }}>

      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "var(--primary)" }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "var(--accent)" }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-10"
          style={{ background: "var(--chart-3)" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
            style={{ background: "var(--primary)" }}>
            <Watch className="w-10 h-10" style={{ color: "var(--primary-foreground)" }} />
          </div>
          <h1 className="text-3xl" style={{ color: "var(--foreground)" }}>
            Nelpulsime
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Monitor wearable pediátrico
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Activity className="w-3 h-3" style={{ color: "var(--primary)" }} />
            <span className="text-xs" style={{ color: "var(--primary)" }}>Sistema de monitoreo activo</span>
            <Activity className="w-3 h-3" style={{ color: "var(--primary)" }} />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-2xl p-8 border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-xl mb-1" style={{ color: "var(--foreground)" }}>Iniciar sesión</h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>Accede a tu panel médico</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "var(--foreground)" }}>Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="medico@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-11"
                style={{ background: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "var(--foreground)" }}>Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl h-11 pr-10"
                  style={{
                    background: "var(--input-background)",
                    borderColor: password.length > 0 && password.length < 8 ? "#ef4444" : "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: "var(--muted-foreground)" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((segment) => {
                      const filled = password.length >= segment * 2;
                      const color = password.length < 4 ? "#ef4444" : password.length < 6 ? "#f59e0b" : password.length < 8 ? "#f59e0b" : "#10b981";
                      return (
                        <div key={segment} className="flex-1 h-1 rounded-full transition-all"
                          style={{ background: filled ? color : "var(--border)" }} />
                      );
                    })}
                  </div>
                  <p className="text-xs" style={{
                    color: password.length < 8 ? "#ef4444" : "#10b981"
                  }}>
                    {password.length < 4 ? "Muy débil" : password.length < 6 ? "Débil" : password.length < 8 ? `Faltan ${8 - password.length} caracteres` : "Contraseña válida ✓"}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-center py-2 px-3 rounded-lg"
                style={{ color: "var(--destructive)", background: "rgba(239,68,68,0.1)" }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl mt-2"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : "Ingresar"}
            </Button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
            ¿Olvidaste tu contraseña?{" "}
            <span className="cursor-pointer" style={{ color: "var(--primary)" }}>Recuperar acceso</span>
          </p>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
          © 2025 Nelpulsime · Monitoreo pediátrico wearable
        </p>
      </div>
    </div>
  );
}
