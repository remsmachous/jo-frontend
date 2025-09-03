/**
 * @file ScanQR.jsx
 * @description Page mobile pour scanner un QR code de billet et vérifier sa validité via une API.
 * Utilise la bibliothèque 'html5-qrcode' pour accéder à la caméra et scanner.
 * Affiche le résultat (valide/invalide) et permet de relancer le scan.
 * NOTE : Cette page a un style visuel distinct (thème sombre) du reste de l'application.
 */

// --- Imports de React & Hooks ---
import { useEffect, useRef, useState } from "react";

// --- Styles ---
import './ScanQR.css';

// --- Dépendance pour le scanner ---
let Html5Qrcode;
let Html5QrcodeScanner;

export default function ScanQR() {
  const readerRef = useRef(null);
  const scannerRef = useRef(null);
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null); 
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

  // Mobile-only hint (simple détection userAgent)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        const mod = await import("html5-qrcode");
        Html5Qrcode = mod.Html5Qrcode;
        Html5QrcodeScanner = mod.Html5QrcodeScanner;

        const config = { fps: 10, qrbox: { width: 260, height: 260 } };

        const verbose = false;
        const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", config, verbose);
        scannerRef.current = html5QrcodeScanner;

        html5QrcodeScanner.render(
          onScanSuccess,
          onScanFailure
        );
      } catch (e) {
        if (mounted) setError("Impossible d’initialiser la caméra. Vérifiez les permissions navigateur.");
        console.error(e);
      }
    }

    function onScanSuccess(decodedText /*, decodedResult */) {
      try { scannerRef.current?.clear(); } catch {}
      setToken(decodedText || "");
      setError("");
      verify(decodedText);
    }

    function onScanFailure(/* error */) {
    }

    startScanner();

    return () => {
      mounted = false;
      try { scannerRef.current?.clear(); } catch {}
      try { scannerRef.current?.pause(); } catch {}
    };
  }, []);

  async function verify(scannedToken) {
    const t = scannedToken || token;
    if (!t) {
      setError("Aucun token scanné.");
      return;
    }
    setVerifying(true);
    setResult(null);
    setError("");

    try {
      const r = await fetch(`${API_BASE}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token: t }),
      });

      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || `HTTP ${r.status}`);
      }
      const body = await r.json();
      setResult(body);
    } catch (e) {
      setResult({ valid: false, error: "Vérification impossible" });
      setError(String(e?.message || e));
    } finally {
      setVerifying(false);
    }
  }

  function restartScan() {
    setResult(null);
    setError("");
    setToken("");
    try {
      scannerRef.current?.clear();
    } catch {}
    scannerRef.current = null;

    const config = { fps: 10, qrbox: { width: 260, height: 260 } };
    const verbose = false;
    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", config, verbose);
    scannerRef.current = html5QrcodeScanner;
    html5QrcodeScanner.render(
      (text) => {
        try { scannerRef.current?.clear(); } catch {}
        setToken(text);
        verify(text);
      },
      () => {}
    );
  }

  return (
    <div className="scan-page">
      <div className="scan-container">
        <h1 className="scan-title">Scan du billet (QR)</h1>

        {!isMobile && (
          <div className="scan-notice">
            Cette page est optimisée pour smartphone. Sur desktop, la caméra peut ne pas être accessible.
          </div>
        )}

        <div id="qr-reader" ref={readerRef} className="scan-reader-wrapper" />

        <div className="scan-status-card">
          <div className="scan-row">
            <span className="scan-label">Dernier token :</span>
            <span className="scan-mono">{token ? token.slice(0, 32) + (token.length > 32 ? "…" : "") : "—"}</span>
          </div>

          {verifying && <div className="scan-info">Vérification en cours…</div>}

          {result && (
            <div
              className={`scan-result ${result.valid ? "scan-result-valid" : "scan-result-invalid"}`}
            >
              {result.valid ? "✅ Billet valide" : "❌ Billet invalide"}
              {result?.meta && (
                <div className="scan-meta">
                  <div>Ticket ID : <b>{result.meta.ticket_id}</b></div>
                  <div>Reservation ID : <b>{result.meta.reservation_id}</b></div>
                  <div>User ID : <b>{result.meta.user_id}</b></div>
                </div>
              )}
            </div>
          )}

          {error && <div className="scan-notice">{error}</div>}

          <div className="scan-actions">
            <button type="button" onClick={restartScan} className="scan-btn-primary">Relancer le scan</button>
            {token && (
              <button type="button" onClick={() => verify()} className="scan-btn-ghost">Revérifier</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}