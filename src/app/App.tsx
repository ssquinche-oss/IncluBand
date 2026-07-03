import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { PatientList } from "./components/PatientList";
import { PatientDetail } from "./components/PatientDetail";
import { Patient } from "./components/PatientData";
import {
  LayoutDashboard, Users, Settings, LogOut, Watch,
  Moon, Sun, ChevronLeft, ChevronRight, Activity, Menu, X
} from "lucide-react";

/* MARKER-MAKE-KIT-INVOKED */

type View = "dashboard" | "patients" | "settings";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [view, setView] = useState<View>("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Apply dark class to root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserEmail("");
    setView("dashboard");
    setSelectedPatient(null);
  };

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setMobileSidebarOpen(false);
  };

  const handleBack = () => setSelectedPatient(null);

  const navItems = [
    { id: "dashboard" as View, icon: LayoutDashboard, label: "Panel principal" },
    { id: "patients" as View, icon: Users, label: "Pacientes" },
    { id: "settings" as View, icon: Settings, label: "Configuración" },
  ];

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} isDark={isDark} />;
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${sidebarCollapsed ? "justify-center" : ""}`}
        style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--primary)" }}>
          <Watch className="w-5 h-5" style={{ color: "var(--primary-foreground)" }} />
        </div>
        {!sidebarCollapsed && (
          <div>
            <span className="text-sm" style={{ color: "var(--sidebar-foreground)" }}>IncluBand</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10b981" }} />
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>En línea</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, icon: Icon, label }) => {
          const active = view === id && !selectedPatient;
          return (
            <button key={id}
              onClick={() => { setView(id); setSelectedPatient(null); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${sidebarCollapsed ? "justify-center" : ""}`}
              style={{
                background: active ? "var(--sidebar-accent)" : "transparent",
                color: active ? "var(--sidebar-primary)" : "var(--muted-foreground)",
              }}
              title={sidebarCollapsed ? label : undefined}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t pt-3" style={{ borderColor: "var(--sidebar-border)" }}>
        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${sidebarCollapsed ? "justify-center" : ""}`}
          style={{ color: "var(--muted-foreground)" }}>
          {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!sidebarCollapsed && <span className="text-sm">{isDark ? "Modo claro" : "Modo oscuro"}</span>}
        </button>

        {/* User */}
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: "var(--sidebar-accent)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              <span className="text-xs">{userEmail[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate" style={{ color: "var(--sidebar-foreground)" }}>
                {userEmail.split("@")[0]}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>Médico</p>
            </div>
            <button onClick={handleLogout}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {sidebarCollapsed && (
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2.5 rounded-xl transition-all hover:opacity-80"
            style={{ color: "#ef4444" }} title="Cerrar sesión">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar desktop */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 relative transition-all duration-300 border-r`}
        style={{
          width: sidebarCollapsed ? 64 : 220,
          background: "var(--sidebar)",
          borderColor: "var(--sidebar-border)",
        }}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full border flex items-center justify-center z-10 transition-all hover:opacity-80"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Sidebar mobile */}
      <aside className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-transform duration-300 lg:hidden border-r`}
        style={{
          width: 240,
          background: "var(--sidebar)",
          borderColor: "var(--sidebar-border)",
          transform: mobileSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b"
          style={{ background: "var(--sidebar)", borderColor: "var(--sidebar-border)" }}>
          <button onClick={() => setMobileSidebarOpen(true)}
            style={{ color: "var(--foreground)" }}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Watch className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <span className="text-sm" style={{ color: "var(--foreground)" }}>IncluBand</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} style={{ color: "var(--muted-foreground)" }}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* View */}
        <div className="flex-1 flex overflow-hidden">
          {selectedPatient ? (
            <PatientDetail patient={selectedPatient} onBack={handleBack} isDark={isDark} />
          ) : view === "dashboard" ? (
            <Dashboard userName={userEmail} onSelectPatient={handleSelectPatient} isDark={isDark} />
          ) : view === "patients" ? (
            <PatientList onSelectPatient={handleSelectPatient} isDark={isDark} />
          ) : (
            <SettingsView isDark={isDark} toggleDark={() => setIsDark(!isDark)} userEmail={userEmail} />
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsView({ isDark, toggleDark, userEmail }: { isDark: boolean; toggleDark: () => void; userEmail: string }) {
  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 style={{ color: "var(--foreground)" }}>Configuración</h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Preferencias del sistema</p>
      </div>

      {/* Theme */}
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 style={{ color: "var(--foreground)" }}>Apariencia</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>Tema oscuro</p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Cambia la apariencia de la interfaz</p>
          </div>
          <button onClick={toggleDark}
            className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
            style={{ background: isDark ? "var(--primary)" : "var(--switch-background)" }}>
            <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
              style={{ left: isDark ? "calc(100% - 20px)" : 4 }} />
          </button>
        </div>
        <div className="flex gap-3 pt-2">
          {[
            { label: "Claro", dark: false },
            { label: "Oscuro", dark: true },
          ].map(({ label, dark }) => (
            <button key={label}
              onClick={() => { if (dark !== isDark) toggleDark(); }}
              className="flex-1 py-8 rounded-xl border-2 transition-all"
              style={{
                background: dark ? "#0a1628" : "#f0fdf9",
                borderColor: isDark === dark ? "var(--primary)" : "var(--border)",
                color: dark ? "#e2f8f5" : "#0d2b24",
              }}>
              <div className="text-sm">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 style={{ color: "var(--foreground)" }}>Cuenta</h3>
        <div className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "var(--muted)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            <span>{userEmail[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>{userEmail.split("@")[0]}</p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{userEmail}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--primary)" }}>Médico registrado</p>
          </div>
        </div>
      </div>

      {/* Device info */}
      <div className="rounded-2xl border p-5 space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 style={{ color: "var(--foreground)" }}>Sistema</h3>
        {[
          { label: "Versión del sistema", value: "IncluBand v2.4.1" },
          { label: "Firmware dispositivo", value: "IB-FW 3.2.0" },
          { label: "Rango de edad soportado", value: "3 – 12 años" },
          { label: "Protocolo de comunicación", value: "BLE 5.0 + WiFi" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b last:border-b-0"
            style={{ borderColor: "var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
            <span className="text-xs" style={{ color: "var(--foreground)" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
