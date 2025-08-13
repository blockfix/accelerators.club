
import { ExternalLink, LinkIcon } from "lucide-react";
import type { Project, Investor } from "./types";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <a href={p.url} target="_blank" rel="noreferrer"
      className="glass block p-5 md:p-6 hover:ring-1 hover:ring-brand-400/60 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{p.name}</h3>
          <p className="text-sm text-slate-300 mt-1 line-clamp-3">{p.description}</p>
        </div>
        <ExternalLink className="w-5 h-5 shrink-0 opacity-70" />
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="chip">{p.category}</span>
        {p.chain ? <span className="chip">{p.chain}</span> : null}
        {p.stage ? <span className="chip">{p.stage}</span> : null}
        {p.region ? <span className="chip">{p.region}</span> : null}
        {p.sector ? <span className="chip">{p.sector}</span> : null}
        {p.tags?.slice(0,4).map(t => <span key={t} className="chip">{t}</span>)}
      </div>
    </a>
  );
}

export function InvestorCard({ i }: { i: Investor }) {
  const min = i.chequeMinUSD ?? null;
  const max = i.chequeMaxUSD ?? null;
  const cheque = (min || max) ? `$${(min or 0)/1000}k – $${(max or min or 0)/1000}k` : null;
  return (
    <a href={i.url} target="_blank" rel="noreferrer"
      className="glass block p-5 md:p-6 hover:ring-1 hover:ring-brand-400/60 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{i.name}</h3>
          <p className="text-sm text-slate-300 mt-1">{i.notes ?? ""}</p>
        </div>
        <LinkIcon className="w-5 h-5 shrink-0 opacity-70" />
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {cheque ? <span className="chip">{cheque}</span> : null}
        {i.region ? <span className="chip">{i.region}</span> : null}
        {i.stages?.map(s => <span key={s} className="chip">{s}</span>)}
        {i.focus?.slice(0,4).map(f => <span key={f} className="chip">{f}</span>)}
      </div>
    </a>
  );
}
