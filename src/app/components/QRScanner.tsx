import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle } from "lucide-react";

interface QRScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-scanner-container";
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();
        if (!mounted) return;

        if (!cameras || cameras.length === 0) {
          setError("No se encontró ninguna cámara en este dispositivo.");
          return;
        }

        // Prefer back camera
        const camera = cameras.find((c) => /back|rear|environment/i.test(c.label)) ?? cameras[0];

        await scanner.start(
          camera.id,
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (!mounted) return;
            // Extract device ID — accept raw value or extract from URL/JSON
            let deviceId = decodedText.trim();
            try {
              const parsed = JSON.parse(decodedText);
              if (parsed.deviceId) deviceId = parsed.deviceId;
            } catch {
              // raw string, use as-is
            }
            onScan(deviceId);
            scanner.stop().catch(() => {});
          },
          () => {}
        );
        if (mounted) setScanning(true);
      } catch (err: any) {
        if (!mounted) return;
        if (err?.name === "NotAllowedError" || String(err).includes("NotAllowed")) {
          setError("Permiso de cámara denegado. Permite el acceso a la cámara en tu navegador.");
        } else {
          setError("No se pudo iniciar la cámara. Verifica los permisos.");
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)", background: "var(--primary)" }}>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" style={{ color: "var(--primary-foreground)" }} />
            <span className="text-sm" style={{ color: "var(--primary-foreground)" }}>Escanear código QR del dispositivo</span>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.2)", color: "var(--primary-foreground)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Scanner viewport */}
          <div className="relative rounded-xl overflow-hidden"
            style={{ background: "#000", minHeight: 260 }}>
            <div id={containerId} className="w-full" />

            {/* Overlay frame */}
            {scanning && !error && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-52 h-52">
                  {/* Corner brackets */}
                  {[
                    "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                    "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                    "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                    "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                  ].map((cls, i) => (
                    <span key={i} className={`absolute w-6 h-6 ${cls}`}
                      style={{ borderColor: "var(--primary)" }} />
                  ))}
                  {/* Scan line animation */}
                  <div className="absolute left-0 right-0 h-0.5 animate-bounce"
                    style={{ background: "var(--primary)", top: "50%", opacity: 0.8 }} />
                </div>
              </div>
            )}

            {/* Loading state */}
            {!scanning && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ background: "#000" }}>
                <div className="w-8 h-8 border-2 rounded-full animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "var(--primary)" }} />
                <p className="text-xs text-white/60">Iniciando cámara...</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
            Apunta la cámara al código QR del reloj wearable Nelpulsime
          </p>

          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl border text-sm transition-all hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "var(--card)" }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
