"use client";

import { useMemo, useState } from "react";
import { scamCampaigns } from "@lorica/knowledge";

const filters = ["Todas", "SMS", "Email", "WhatsApp", "Llamada", "Web"] as const;

export function CampaignList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const campaigns = useMemo(() => filter === "Todas" ? scamCampaigns : scamCampaigns.filter((campaign) => campaign.channels.includes(filter)), [filter]);

  return (
    <>
      <div className="filter-row" aria-label="Filtrar por canal">
        {filters.map((item) => (
          <button key={item} type="button" className={`filter-button ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>
            {item}
          </button>
        ))}
      </div>
      <div className="campaign-grid">
        {campaigns.map((campaign) => (
          <article className="campaign-card" key={campaign.id}>
            <div className="campaign-meta">
              <time dateTime={campaign.publishedAt}>{new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${campaign.publishedAt}T12:00:00Z`))}</time>
              <span>Importancia {campaign.severity}</span>
            </div>
            <h2>{campaign.title}</h2>
            <p><strong>Suplanta a:</strong> {campaign.impersonates}</p>
            <p><strong>Busca:</strong> {campaign.requestedDataOrAction}</p>
            <div className="tag-row">
              {campaign.channels.map((channel) => <span className="tag" key={channel}>{channel}</span>)}
              {campaign.techniques.map((technique) => <span className="tag" key={technique}>{technique}</span>)}
            </div>
            <a className="source-link" href={campaign.sourceUrl} target="_blank" rel="noreferrer">Ver aviso oficial de INCIBE</a>
          </article>
        ))}
      </div>
    </>
  );
}
