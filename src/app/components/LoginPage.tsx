import { useState } from "react";
import { Watch, Eye, EyeOff } from "lucide-react";
import { login } from "./api";

interface LoginPageProps {
  onLogin: (email: string, doctorId: number) => void;
  isDark: boolean;
}

const RING_COUNT = 36;
const RING_SIZE = 620;

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

  const primary = isDark ? "#14b8a6" : "#0d9488";
  const primaryForeground = isDark ? "#0a1628" : "#ffffff";
  const foreground = isDark ? "#e2f8f5" : "#0d2b24";
  const mutedForeground = isDark ? "#7ecdc8" : "#5f9ea0";
  const labelBg = isDark ? "rgba(15,35,55,0.85)" : "rgba(255,255,255,0.75)";
  const dotBase = isDark ? "rgba(20,184,166,0.25)" : "rgba(13,148,136,0.25)";
  const pageBg = isDark
    ? "linear-gradient(135deg, #0a1628 0%, #0f2337 50%, #0a1e30 100%)"
    : "linear-gradient(135deg, #f0fdf9 0%, #ccfbf1 50%, #e0f2f1 100%)";

  return (
    <div className="ib-page" style={{ background: pageBg }}>
      <style>{`
        .ib-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .ib-ring {
          position: relative;
          width: ${RING_SIZE}px;
          height: ${RING_SIZE}px;
          max-width: 94vw;
          max-height: 94vw;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .ib-dot {
          position: absolute;
          left: 0;
          width: 52px;
          height: 9px;
          background: ${dotBase};
          border-radius: 80px;
          transform-origin: calc(${RING_SIZE}px / 2);
          transform: rotate(calc(var(--i) * (360deg / ${RING_COUNT})));
          animation: ib-blink 3s linear infinite;
          animation-delay: calc(var(--i) * (3s / ${RING_COUNT}));
        }
        @media (max-width: 640px) {
        .ib-dot { transform-origin: 47vw; width: 34px; height: 7px; }
        }
        @keyframes ib-blink {
          0% { background: ${primary}; }
          25% { background: ${dotBase}; }
        }
        .ib-login-box {
          position: relative;
          width: 80%;
          max-width: 300px;
          z-index: 1;
          padding: 20px;
          border-radius: 20px;
          text-align: center;
        }
        .ib-brand-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: ${primary};
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .ib-brand-title {
          color: ${foreground};
          font-size: 1.3em;
          margin: 4px 0 0;
        }
        .ib-brand-sub {
          color: ${mutedForeground};
          font-size: 0.7em;
          margin: 2px 0 0;
        }
        .ib-brand-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 4px 0 10px;
          color: ${primary};
          font-size: 0.65em;
          white-space: nowrap;
        }
        .ib-login-box h2 {
          font-size: 1.5em;
          color: ${primary};
          margin: 4px 0 14px;
        }
        .ib-form {
          width: 100%;
        }
        .ib-input-box {
          position: relative;
          margin: 15px 0;
        }
        .ib-input-box input {
          width: 100%;
          height: 45px;
          background: transparent;
          border: 2px solid ${dotBase};
          outline: none;
          border-radius: 40px;
          font-size: 0.95em;
          color: ${foreground};
          padding: 0 15px;
          transition: 0.5s ease;
          box-sizing: border-box;
        }
        .ib-input-box input:focus {
          border-color: ${primary};
        }
        .ib-input-box label {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          font-size: 0.95em;
          pointer-events: none;
          transition: 0.5s ease;
          color: ${mutedForeground};
        }
        .ib-input-box:focus-within label,
        .ib-input-box.filled label {
          top: 0;
          left: 22px;
          font-size: 0.75em;
          background: ${labelBg};
          backdrop-filter: blur(4px);
          padding: 0 6px;
          color: ${primary};
        }
        .ib-toggle-pass {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: ${mutedForeground};
          display: flex;
        }
        .ib-error {
          font-size: 0.8em;
          color: #ef4444;
          background: rgba(239,68,68,0.1);
          border-radius: 10px;
          padding: 8px 10px;
          margin: 6px 0;
        }
        .ib-btn {
          width: 100%;
          height: 45px;
          background: ${primary};
          border: none;
          outline: none;
          border-radius: 40px;
          cursor: pointer;
          font-size: 0.95em;
          color: ${primaryForeground};
          font-weight: 600;
          margin-top: 8px;
        }
        .ib-btn:disabled {
          opacity: 0.7;
          cursor: default;
        }
        .ib-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: ${primaryForeground};
          border-radius: 50%;
          display: inline-block;
          animation: ib-spin 0.7s linear infinite;
          margin-right: 6px;
          vertical-align: middle;
        }
        @keyframes ib-spin {
          to { transform: rotate(360deg); }
        }
        .ib-footer {
          text-align: center;
          font-size: 0.75em;
          color: ${mutedForeground};
          margin-top: 18px;
        }
      `}</style>

      <div className="ib-ring">
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <span className="ib-dot" key={i} style={{ ["--i" as string]: i } as React.CSSProperties} />
        ))}

        <div className="ib-login-box">
          <div className="ib-brand-icon">
            <Watch className="w-6 h-6" style={{ color: primaryForeground }} />
          </div>
          <p className="ib-brand-title">IncluBand</p>
          <p className="ib-brand-sub">Monitor wearable pediátrico</p>
          <div className="ib-brand-status">
          </div>

          <h2>Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="ib-form">
            <div className={`ib-input-box${email ? " filled" : ""}`}>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Correo electrónico</label>
            </div>

            <div className={`ib-input-box${password ? " filled" : ""}`}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              <label htmlFor="password">Contraseña</label>
              <button
                type="button"
                className="ib-toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="ib-error">{error}</p>}

            <button type="submit" className="ib-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="ib-spinner" />
                  Verificando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
