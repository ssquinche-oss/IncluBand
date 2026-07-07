import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Watch, Eye, EyeOff, Activity } from "lucide-react";
import { login } from "./api";


interface LoginPageProps {
  onLogin: (email: string, doctorId: number) => void;
  isDark: boolean;
}


export function LoginPage({ onLogin, isDark }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      onLogin(result.email, result.id);
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: isDark ? "linear-gradient(135deg, #0a1628 0%, #0f2337 50%, #0a1e30 100%)" : "linear-gradient(135deg, #f0fdf9 0%, #ccfbf1 50%, #e0f2f1 100%)" }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "var(--primary)" }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "var(--accent)" }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-10"
          style={{ background: "var(--chart-3)" }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
            style={{ background: "var(--primary)" }}>
            <Watch className="w-10 h-10" style={{ color: "var(--primary-foreground)" }} />
          </div>
          <h1 className="text-3xl" style={{ color: "var(--foreground)" }}>
            IncluBand
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
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl h-11 pr-10"
                  style={{ background: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: "var(--muted-foreground)" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
          © 2026 IncluBand · Monitoreo pediátrico wearable
        </p>
      </div>
    </div>
  );
}