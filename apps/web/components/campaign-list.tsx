"use client";

import { useMemo, useState } from "react";
import { scamCampaigns } from "@lorica/knowledge";

const filters = ["Todas", "SMS", "Email", "WhatsApp", "Llamada", "Web"] as const;

export function CampaignList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [query, setQuery] = useState("");
  const campaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return scamCampaigns.filter((campaign) => {
      const matchesChannel = filter === "Todas" || campaign.channels.includes(filter);
      const searchable = [campaign.title, campaign.impersonates, campaign.requestedDataOrAction, ...campaign.channels, ...campaign.techniques].join(" ").toLocaleLowerCase("es");
      return matchesChannel && (!normalizedQuery || searchable.includes(normalizedQuery));
    }).sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  }, [filter, query]);

  return (
    <>
      <div className="filter-row" aria-label="Filtrar por canal">
        {filters.map((item) => (
          <button key={item} type="button" className={`filter-button ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>
            {item}
          </button>
        ))}
      </div>
      <label className="campaign-search-label" htmlFor="campaign-search">Buscar por estafa, marca, petición o técnica</label>
      <input id="campaign-search" className="campaign-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej.: facturas, DGT, inversión…" />
      <p className="campaign-count" aria-live="polite">{campaigns.length} de {scamCampaigns.length} casos</p>
      <div className="campaign-grid">
        {campaigns.map((campaign) => (
          <article className="campaign-card" key={campaign.id}>
            <div className="campaign-meta">
              <time dateTime={campaign.publishedAt}>{new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${campaign.publishedAt}T12:00:00Z`))}</time>
              {campaign.incidentAt ? <span>Hechos: {new Intl.DateTimeFormat("es-ES", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${campaign.incidentAt}T12:00:00Z`))}</span> : null}
              <span>Importancia {campaign.severity}</span>
              <span>{campaign.evidence === "victim-report" ? "Relato publicado · no verificado independientemente" : "Aviso o actuación oficial"}</span>
            </div>
            <h2>{campaign.title}</h2>
            <p><strong>Suplanta a:</strong> {campaign.impersonates}</p>
            <p><strong>Busca:</strong> {campaign.requestedDataOrAction}</p>
            {campaign.messageExample ? <blockquote className="message-example"><strong>Mensaje reportado o ejemplo</strong><br />{campaign.messageExample}</blockquote> : null}
            <div className="tag-row">
              {campaign.channels.map((channel) => <span className="tag" key={channel}>{channel}</span>)}
              {campaign.techniques.map((technique) => <span className="tag" key={technique}>{technique}</span>)}
            </div>
            <a className="source-link" href={campaign.sourceUrl} target="_blank" rel="noreferrer">{campaign.evidence === "victim-report" ? "Ver relato publicado (no verificado independientemente)" : "Ver fuente oficial"}</a>
          </article>
        ))}
      </div>
      {campaigns.length === 0 ? <p className="empty-findings">No hay casos que coincidan con esos filtros.</p> : null}
    </>
  );
}
