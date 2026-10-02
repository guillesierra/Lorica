"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { analyzeMessage, type AnalysisResult, type RiskLevel } from "@lorica/detection";
import { threatSnapshot } from "@lorica/knowledge";

const examples = [
  {
    label: "Falso hijo",
    text: "Mamá, soy tu hijo. Se me ha roto el móvil y este es mi nuevo número. Necesito que me hagas un Bizum urgente, no puedo hablar ahora."
  },
  {
    label: "Alerta bancaria",
    text: "URGENTE: se ha detectado un nuevo dispositivo. Tu cuenta será bloqueada hoy. Confirma contraseña, PIN y código SMS en https://bbva-acceso-seguro.example/login"
  },
  {
    label: "URL con letra cambiada",
    text: "Correos: falta el número de su calle. Actualice ahora en https://cоrreos-entrega.example/actualizar" // The first o is Cyrillic.
  },
  {
    label: "Falsa Seguridad Social",
    text: "Seg Social: Tiene una actualizacion pendiente. Consulte su informacion y gestione el tramite correspondiente. https://seg-pocpcxa-es.online/Y8PIv8"
  }
] as const;

const riskCopy: Record<RiskLevel, { label: string; title: string; color: string }> = {
  low: { label: "Riesgo bajo", title: "No vemos señales fuertes", color: "#648875" },
  medium: { label: "Precaución", title: "Conviene verificarlo", color: "#a17b42" },
  high: { label: "Riesgo alto", title: "Hay señales importantes", color: "#a75f59" },
  critical: { label: "Riesgo crítico", title: "No actúes todavía", color: "#914b50" }
};

export function Analyzer() {
  const [text, setText] = useState("");
  const [sender, setSender] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!result) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [result]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim().length < 4) return;
    setCopied(false);
    setResult(analyzeMessage(text, {
      knownMaliciousDomains: threatSnapshot.domains,
      knownMaliciousUrls: threatSnapshot.urls,
      sender: sender.trim()
    }));
  }

  async function copySummary() {
    if (!result || !navigator.clipboard) return;
    const content = [
      `Lorica: ${riskCopy[result.riskLevel].label} (${result.score}/100)`,
      result.summary,
      ...result.findings.slice(0, 5).map((item) => `- ${item.title}`),
      "Este análisis es orientativo y puede equivocarse."
    ].join("\n");
    await navigator.clipboard.writeText(content);
    setCopied(true);
  }

  const meta = result ? riskCopy[result.riskLevel] : null;

  return (
    <>
      <section className="analyzer-wrap shell" aria-labelledby="analyzer-title">
        <form className="analyzer-card" onSubmit={submit}>
          <div className="analyzer-inner">
            <div className="input-head">
              <label id="analyzer-title" htmlFor="message">Pega el mensaje, correo o enlace</label>
              <span className="privacy-pill">Análisis local y privado</span>
            </div>
            <textarea
              id="message"
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, 12_000))}
              placeholder="Ej.: Se ha detectado un acceso no autorizado. Verifica tu cuenta en…"
              autoComplete="off"
              spellCheck="false"
              aria-describedby="privacy-description"
            />
            <label className="sender-label" htmlFor="sender">Teléfono o alias remitente (opcional)</label>
            <input
              id="sender"
              className="sender-input"
              inputMode="text"
              value={sender}
              onChange={(event) => setSender(event.target.value.slice(0, 80))}
              placeholder="Ej.: +34 600 000 000 o nombre que aparece en el SMS"
              autoComplete="off"
              spellCheck="false"
            />
            <p className="sender-note">No hay una lista abierta y fiable de teléfonos fraudulentos integrada. En SMS con alias alfanumérico, contrástalo en la <a href="https://numeracionyoperadores.cnmc.es/alias" target="_blank" rel="noreferrer">consulta oficial de la CNMC</a>. El identificador de llamada puede suplantarse.</p>
            <div className="input-footer">
              <span id="privacy-description" className="char-count">{text.length.toLocaleString("es-ES")} / 12.000 · No visitamos los enlaces</span>
              <button className="primary-button" disabled={text.trim().length < 4} type="submit">
                <span aria-hidden="true">◇</span> Analizar señales
              </button>
            </div>
          </div>
        </form>
        <div className="samples" aria-label="Ejemplos seguros">
          <span>Prueba un ejemplo:</span>
          {examples.map((example) => (
            <button className="sample-button" key={example.label} type="button" onClick={() => { setText(example.text); setResult(null); }}>
              {example.label}
            </button>
          ))}
        </div>
      </section>

      {result && meta ? (
        <section ref={resultRef} className="result shell" aria-live="polite" aria-labelledby="result-title">
          <div className="result-head">
            <div className="score-ring" style={{ "--score": result.score, "--score-color": meta.color } as CSSProperties}>
              <div className="score-value">{result.score}<small>sobre 100</small></div>
            </div>
            <div className="risk-copy">
              <span className={`risk-label risk-${result.riskLevel}`}>{meta.label}</span>
              <h2 id="result-title">{meta.title}</h2>
              <p>{result.summary}</p>
            </div>
            <button className="secondary-button" type="button" onClick={copySummary}>{copied ? "Copiado" : "Copiar resumen"}</button>
          </div>
          <div className="result-body">
            <div className="findings">
              <h2 className="section-title">Señales detectadas <span>{result.findings.length} hallazgos</span></h2>
              {result.findings.length ? (
                <div className="finding-list">
                  {result.findings.map((item, index) => (
                    <article className="finding-item" key={`${item.ruleId}-${index}`}>
                      <span className={`severity-dot ${item.severity}`} aria-label={`Severidad ${item.severity}`} />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.detail}</p>
                        {item.evidence ? <code className="evidence">{item.evidence}</code> : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : <div className="empty-findings">Ninguna regla ha encontrado señales fuertes. Aun así, comprueba la identidad por otro canal.</div>}
            </div>
            <aside className="actions-panel" aria-label="Qué hacer ahora">
              <h2 className="section-title">Qué hacer ahora</h2>
              <ol className="action-list">
                {result.actions.map((action) => <li key={action}>{action}</li>)}
              </ol>
              {result.indicators.length ? (
                <div className="indicator-block">
                  <h2 className="section-title">Indicadores extraídos</h2>
                  <div className="indicator-chips">
                    {result.indicators.slice(0, 12).map((item) => <span className="indicator-chip" key={`${item.type}-${item.value}`}>{item.type}: {item.displayValue}</span>)}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
          <div className="result-note">Reglas {result.ruleSetVersion}. No es una certificación de seguridad ni una acusación. Las listas de amenazas pueden contener errores.</div>
        </section>
      ) : null}
    </>
  );
}
