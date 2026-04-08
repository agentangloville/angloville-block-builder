"use client";

import { useState, useRef } from "react";

const MARKETS = [
  { id: "angloville.pl", label: "angloville.pl", flag: "🇵🇱", desc: "Polska" },
  { id: "angloville.com", label: "angloville.com", flag: "🇬🇧", desc: "Native Speakers" },
  { id: "angloville.it", label: "angloville.it", flag: "🇮🇹", desc: "Italia" },
  { id: "angloville.com.br", label: "angloville.com.br", flag: "🇧🇷", desc: "Brasil" },
];

const LANGUAGES = [
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
];

const BLOCKS = [
  { id: "block-banner", label: "Banner / Hero", icon: "🖼️" },
  { id: "block-video", label: "Video", icon: "🎬" },
  { id: "block-text", label: "Text (flexible)", icon: "📝" },
  { id: "block-text-button", label: "Text + Button", icon: "🔗" },
  { id: "block-info", label: "Info (list)", icon: "ℹ️" },
  { id: "block-infocols", label: "Info Columns", icon: "📊" },
  { id: "block-icons", label: "Icons / Features", icon: "⭐" },
  { id: "block-courses", label: "Courses / Programs", icon: "🎓" },
  { id: "block-plan", label: "Plan / Schedule", icon: "📅" },
  { id: "block-table", label: "Table", icon: "📋" },
  { id: "block-faq", label: "FAQ", icon: "❓" },
  { id: "block-contact-form", label: "Form v1", icon: "📩" },
  { id: "block-contact-form2", label: "Form v2", icon: "📬" },
  { id: "block-opinions", label: "Testimonials", icon: "💬" },
  { id: "block-profits", label: "Benefits / Profits", icon: "🏆" },
  { id: "block-crew", label: "Crew / Team", icon: "👥" },
  { id: "block-gallery", label: "Gallery", icon: "🏞️" },
  { id: "block-list", label: "Bullet List", icon: "📌" },
  { id: "block-listnumber", label: "Numbered List", icon: "🔢" },
  { id: "block-find", label: "Course Finder", icon: "🔍" },
  { id: "block-trips", label: "Trips Table", icon: "✈️" },
  { id: "block-instagram", label: "Instagram Feed", icon: "📸" },
  { id: "block-line", label: "Divider Line", icon: "➖" },
  { id: "block-newsletter", label: "Newsletter", icon: "📧" },
];

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [step, setStep] = useState(1);
  const [market, setMarket] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setPinError(false);

    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (value && index === 3 && newPin.every(d => d !== "")) {
      verifyPin(newPin.join(""));
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      const code = pin.join("");
      if (code.length === 4) verifyPin(code);
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newPin = pasted.split("");
      setPin(newPin);
      pinRefs.current[3]?.focus();
      verifyPin(pasted);
    }
  };

  const verifyPin = async (code: string) => {
    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: code }),
      });
      const data = await res.json();
      if (data.valid) {
        setAuthenticated(true);
      } else {
        setPinError(true);
        setPin(["", "", "", ""]);
        pinRefs.current[0]?.focus();
      }
    } catch {
      setPinError(true);
      setPin(["", "", "", ""]);
      pinRefs.current[0]?.focus();
    }
  };

  const handleMarketSelect = (m: string) => {
    setMarket(m);
    const defaults: Record<string, string> = {
      "angloville.pl": "pl", "angloville.com": "en",
      "angloville.it": "it", "angloville.com.br": "pt",
    };
    setLanguage(defaults[m] || "en");
    setStep(2);
  };

  const toggleBlock = (blockId: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockId) ? prev.filter((b) => b !== blockId) : [...prev, blockId]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Wpisz opis landing page'a"); return; }
    setLoading(true); setError(""); setGeneratedCode(""); setCopied(false); setUsage(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, market, language, selectedBlocks: selectedBlocks.length > 0 ? selectedBlocks : [] }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Serwer zwrócił nieprawidłową odpowiedź. Spróbuj ponownie.");
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGeneratedCode(data.code); setUsage(data.usage); setStep(4);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(generatedCode); } catch { outputRef.current?.select(); document.execCommand("copy"); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setStep(1); setMarket(""); setLanguage(""); setSelectedBlocks([]);
    setPrompt(""); setGeneratedCode(""); setError(""); setCopied(false); setUsage(null);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Text:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Product+Sans:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Google Sans', 'Product Sans', 'Roboto', -apple-system, sans-serif;
          background: #f8f9fa;
          color: #202124;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        textarea:focus, input:focus {
          outline: none;
          border-color: #1a73e8 !important;
          box-shadow: 0 0 0 2px rgba(26,115,232,0.2) !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        ::selection { background: rgba(26,115,232,0.15); }
        .pin-input:focus { border-color: #1a73e8 !important; box-shadow: 0 0 0 2px rgba(26,115,232,0.2) !important; }
      `}</style>

      {/* PIN SCREEN */}
      {!authenticated && (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}>
          <div style={{
            background: "#fff", borderRadius: 8, border: "1px solid #dadce0",
            padding: "48px 40px", textAlign: "center", maxWidth: 380, width: "100%",
            boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
            animation: "fadeIn 0.3s",
          }}>
            <img
              src="https://angloville.com/wp-content/themes/angloville/assets/images/logo.svg"
              alt="Angloville"
              style={{ height: 32, marginBottom: 24 }}
            />
            <h2 style={{ fontSize: 16, fontWeight: 500, color: "#202124", marginBottom: 8 }}>
              Block Builder
            </h2>
            <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 32 }}>
              Wpisz PIN aby kontynuować
            </p>

            <div style={{
              display: "flex", gap: 12, justifyContent: "center", marginBottom: 24,
              animation: pinError ? "shake 0.4s" : "none",
            }}>
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { pinRefs.current[i] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  onPaste={i === 0 ? handlePinPaste : undefined}
                  autoFocus={i === 0}
                  className="pin-input"
                  style={{
                    width: 52, height: 56, textAlign: "center",
                    fontSize: 24, fontWeight: 500, fontFamily: "inherit",
                    border: `2px solid ${pinError ? "#ea4335" : digit ? "#1a73e8" : "#dadce0"}`,
                    borderRadius: 8, outline: "none",
                    color: "#202124", background: "#fff",
                    transition: "border-color 0.15s",
                  }}
                />
              ))}
            </div>

            {pinError && (
              <p style={{ fontSize: 13, color: "#ea4335", marginBottom: 16 }}>
                Nieprawidłowy PIN
              </p>
            )}

            <p style={{ fontSize: 11, color: "#80868b" }}>
              Dostęp tylko dla zespołu Angloville
            </p>
          </div>
        </div>
      )}

      {/* MAIN APP */}
      {authenticated && (
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "24px 16px" }}>

        {/* Header with Angloville logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, padding: "0 4px" }}>
          <img
            src="https://angloville.com/wp-content/themes/angloville/assets/images/logo.svg"
            alt="Angloville"
            style={{ height: 28 }}
          />
          <div style={{ width: 1, height: 24, background: "#dadce0" }} />
          <h1 style={{ fontSize: 18, fontWeight: 500, color: "#202124", letterSpacing: "-0.2px" }}>
            Block Builder
          </h1>
        </div>

        {/* Steps - Google style tabs */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 24,
          borderBottom: "1px solid #dadce0", padding: "0 4px",
        }}>
          {[
            { n: 1, label: "Rynek" },
            { n: 2, label: "Język" },
            { n: 3, label: "Bloki & Prompt" },
            { n: 4, label: "Wynik" },
          ].map(({ n, label }) => (
            <div key={n} onClick={() => n < step ? setStep(n) : null} style={{
              padding: "12px 20px", fontSize: 13, fontWeight: 500,
              color: step === n ? "#1a73e8" : step > n ? "#202124" : "#80868b",
              borderBottom: step === n ? "3px solid #1a73e8" : "3px solid transparent",
              cursor: n < step ? "pointer" : "default",
              transition: "all 0.2s",
              marginBottom: -1,
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Main card */}
        <div style={{
          background: "#fff", borderRadius: 8, border: "1px solid #dadce0",
          padding: 24,
          boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
        }}>

          {/* STEP 1: Market */}
          {step === 1 && (
            <div style={{ animation: "fadeIn 0.25s" }}>
              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#202124", marginBottom: 4 }}>Wybierz rynek</h2>
              <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 20 }}>Na którą stronę generujesz bloki?</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {MARKETS.map((m) => (
                  <div key={m.id} onClick={() => handleMarketSelect(m.id)} style={{
                    border: `1px solid ${market === m.id ? "#1a73e8" : "#dadce0"}`,
                    background: market === m.id ? "rgba(26,115,232,0.04)" : "#fff",
                    borderRadius: 8, padding: "14px 16px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 24 }}>{m.flag}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#202124" }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: "#5f6368" }}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Language */}
          {step === 2 && (
            <div style={{ animation: "fadeIn 0.25s" }}>
              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#202124", marginBottom: 4 }}>Język treści</h2>
              <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 20 }}>W jakim języku mają być teksty na stronie?</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {LANGUAGES.map((l) => (
                  <div key={l.code} onClick={() => setLanguage(l.code)} style={{
                    border: `1px solid ${language === l.code ? "#1a73e8" : "#dadce0"}`,
                    background: language === l.code ? "rgba(26,115,232,0.04)" : "#fff",
                    borderRadius: 100, padding: "8px 18px", cursor: "pointer",
                    fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
                    color: language === l.code ? "#1a73e8" : "#3c4043", transition: "all 0.15s",
                  }}>
                    {l.flag} {l.name}
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(3)} disabled={!language} style={{
                fontWeight: 500, fontSize: 14, padding: "10px 24px", borderRadius: 4,
                border: "none", cursor: language ? "pointer" : "not-allowed",
                background: language ? "#1a73e8" : "#dadce0",
                color: language ? "#fff" : "#80868b",
                fontFamily: "inherit", transition: "background 0.2s",
              }}>Dalej</button>
            </div>
          )}

          {/* STEP 3: Blocks + Prompt */}
          {step === 3 && !loading && (
            <div style={{ animation: "fadeIn 0.25s" }}>
              {/* Context chips */}
              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                <span style={{
                  background: "#e8f0fe", borderRadius: 100, padding: "4px 14px",
                  fontSize: 12, fontWeight: 500, color: "#1a73e8",
                }}>
                  {MARKETS.find((m) => m.id === market)?.flag} {market}
                </span>
                <span style={{
                  background: "#e8f0fe", borderRadius: 100, padding: "4px 14px",
                  fontSize: 12, fontWeight: 500, color: "#1a73e8",
                }}>
                  {LANGUAGES.find((l) => l.code === language)?.flag} {LANGUAGES.find((l) => l.code === language)?.name}
                </span>
              </div>

              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#202124", marginBottom: 4 }}>Wybierz bloki</h2>
              <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 16 }}>
                Opcjonalnie — kliknij aby wybrać i ustalić kolejność. Puste = Claude sam dobierze.
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 6, marginBottom: 24,
              }}>
                {BLOCKS.map((b) => {
                  const idx = selectedBlocks.indexOf(b.id);
                  return (
                    <div key={b.id} onClick={() => toggleBlock(b.id)} style={{
                      border: `1px solid ${idx >= 0 ? "#1a73e8" : "#dadce0"}`,
                      background: idx >= 0 ? "rgba(26,115,232,0.04)" : "#fff",
                      borderRadius: 8, padding: "8px 10px", cursor: "pointer",
                      fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
                      userSelect: "none", transition: "all 0.12s",
                      color: idx >= 0 ? "#1a73e8" : "#3c4043",
                    }}>
                      <span style={{ fontSize: 14 }}>{b.icon}</span>
                      <span style={{ flex: 1 }}>{b.label}</span>
                      {idx >= 0 && (
                        <span style={{
                          background: "#1a73e8", color: "#fff",
                          width: 18, height: 18, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700,
                        }}>{idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ height: 1, background: "#dadce0", margin: "20px 0" }} />

              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#202124", marginBottom: 4 }}>Opisz stronę</h2>
              <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 12 }}>
                Im więcej szczegółów (ceny, daty, URLe), tym lepszy wynik.
              </p>

              <textarea
                placeholder={`np. "Zrób landing page dla programu Malta Junior (11-18 lat), termin lipiec 2026, cena od 6490 zł, z hero, ikonami, FAQ i formularzem"`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{
                  width: "100%", minHeight: 130, background: "#fff",
                  border: "1px solid #dadce0", borderRadius: 8, padding: 14,
                  color: "#202124", fontSize: 14, resize: "vertical",
                  fontFamily: "inherit", lineHeight: 1.6, marginBottom: 16,
                }}
              />

              {error && (
                <div style={{
                  background: "#fce8e6", borderRadius: 8, padding: "12px 16px",
                  color: "#c5221f", fontSize: 13, marginBottom: 16,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>⚠</span> {error}
                </div>
              )}

              <button onClick={handleGenerate} disabled={!prompt.trim()} style={{
                fontWeight: 500, fontSize: 14, padding: "10px 24px", borderRadius: 4,
                border: "none", cursor: prompt.trim() ? "pointer" : "not-allowed",
                background: prompt.trim() ? "#1a73e8" : "#dadce0",
                color: prompt.trim() ? "#fff" : "#80868b",
                fontFamily: "inherit", transition: "background 0.2s",
              }}>Generuj bloki</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "64px 20px",
            }}>
              <div style={{
                width: 36, height: 36, border: "3px solid #e8eaed",
                borderTopColor: "#1a73e8", borderRadius: "50%",
                animation: "spin 0.7s linear infinite", marginBottom: 16,
              }} />
              <div style={{ fontSize: 14, color: "#5f6368" }}>Generowanie bloków...</div>
            </div>
          )}

          {/* STEP 4: Output */}
          {step === 4 && !loading && (
            <div style={{ animation: "fadeIn 0.25s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: "#34a853",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 13, fontWeight: 700,
                }}>✓</div>
                <h2 style={{ fontSize: 16, fontWeight: 500, color: "#202124" }}>Gotowy kod</h2>
              </div>

              <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 16 }}>
                Skopiuj i wklej w WordPress → Edytor kodu (Code Editor)
              </p>

              {usage && (
                <div style={{ fontSize: 12, color: "#80868b", marginBottom: 10, fontFamily: "monospace" }}>
                  Tokens: {usage.input_tokens} in / {usage.output_tokens} out
                </div>
              )}

              <textarea
                ref={outputRef} readOnly value={generatedCode}
                style={{
                  width: "100%", minHeight: 280, background: "#f8f9fa",
                  border: "1px solid #dadce0", borderRadius: 8, padding: 14,
                  color: "#202124", fontFamily: "'Roboto Mono', monospace", fontSize: 11,
                  lineHeight: 1.7, resize: "vertical", marginBottom: 16,
                  wordBreak: "break-all",
                }}
              />

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={handleCopy} style={{
                  fontWeight: 500, fontSize: 14, padding: "10px 24px", borderRadius: 4,
                  border: "none", cursor: "pointer",
                  background: copied ? "#34a853" : "#1a73e8", color: "#fff",
                  fontFamily: "inherit", transition: "background 0.2s",
                }}>{copied ? "✓ Skopiowano" : "Kopiuj kod"}</button>
                <button onClick={handleGenerate} style={{
                  fontWeight: 500, fontSize: 14, padding: "10px 24px", borderRadius: 4,
                  border: "1px solid #dadce0", cursor: "pointer",
                  background: "#fff", color: "#1a73e8", fontFamily: "inherit",
                }}>Generuj ponownie</button>
                <button onClick={handleReset} style={{
                  fontWeight: 500, fontSize: 14, padding: "10px 24px", borderRadius: 4,
                  border: "1px solid #dadce0", cursor: "pointer",
                  background: "#fff", color: "#5f6368", fontFamily: "inherit",
                }}>Nowa strona</button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {copied && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#323232", color: "#fff", padding: "12px 24px",
          borderRadius: 8, fontSize: 14, fontWeight: 500, zIndex: 100,
          fontFamily: "inherit",
          boxShadow: "0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14)",
        }}>Kod skopiowany do schowka</div>
      )}
    </>
  );
}
