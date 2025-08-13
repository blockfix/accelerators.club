
'use client';
import { useEffect, useMemo, useState } from "react";
import Logo from "./Logo";
import { ProjectCard, InvestorCard } from "./Card";
import type { Project, Investor } from "./types";
import aiData from "../data/ai.json";
import web3Data from "../data/web3.json";
import investorData from "../data/investors.json";

type Tab = "Web3" | "AI" | "Investors";

const defaultTabs: Tab[] = ["Web3", "AI", "Investors"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Tab>("Web3");
  const [region, setRegion] = useState("All");
  const [stage, setStage] = useState("All");
  const [chain, setChain] = useState("All");
  const [sector, setSector] = useState("All");

  // Combine static data and localStorage (client-side add)
  const [ai, setAi] = useState<Project[]>(aiData as Project[]);
  const [web3, setWeb3] = useState<Project[]>(web3Data as Project[]);
  const [investors, setInvestors] = useState<Investor[]>(investorData as Investor[]);

  useEffect(() => {
    const lsAi = JSON.parse(localStorage.getItem("ac.ai") || "[]");
    const lsW3 = JSON.parse(localStorage.getItem("ac.w3") || "[]");
    const lsInv = JSON.parse(localStorage.getItem("ac.inv") || "[]");
    if (lsAi.length) setAi((d) => [...d, ...lsAi]);
    if (lsW3.length) setWeb3((d) => [...d, ...lsW3]);
    if (lsInv.length) setInvestors((d) => [...d, ...lsInv]);
  }, []);

  const filteredProjects = useMemo(() => {
    const base = active === "Web3" ? web3 : ai;
    const q = query.toLowerCase().trim();
    return base.filter(p => {
      const inQuery = !q || [p.name, p.description, p.chain, p.sector, ...(p.tags||[])].filter(Boolean).join(" ").toLowerCase().includes(q);
      const regOk = region === "All" || (p.region || "").toLowerCase() === region.toLowerCase();
      const stgOk = stage === "All" || (p.stage || "") === stage;
      const chOk = chain === "All" || (p.chain || "").toLowerCase() === chain.toLowerCase();
      const secOk = sector === "All" || (p.sector || "").toLowerCase() === sector.toLowerCase();
      return inQuery && regOk && stgOk && chOk && secOk;
    });
  }, [active, ai, web3, query, region, stage, chain, sector]);

  const filteredInvestors = useMemo(() => {
    const q = query.toLowerCase().trim();
    return investors.filter(i => {
      const inQuery = !q || [i.name, i.notes, i.region, ...(i.focus||[])].filter(Boolean).join(" ").toLowerCase().includes(q);
      const regOk = region === "All" || (i.region || "").toLowerCase() === region.toLowerCase();
      return inQuery && regOk;
    });
  }, [investors, query, region]);

  // Derive filter option sets
  const regions = useMemo(() => {
    const src = active === "Investors" ? investors.map(i => i.region) : (active === "Web3" ? web3 : ai).map(p => p.region);
    return ["All", ...Array.from(new Set(src.filter(Boolean) as string[]))];
  }, [active, ai, web3, investors]);

  const chains = useMemo(() => ["All", ...Array.from(new Set(web3.map(p => p.chain).filter(Boolean) as string[]))], [web3]);
  const sectors = useMemo(() => ["All", ...Array.from(new Set([...ai, ...web3].map(p => p.sector).filter(Boolean) as string[]))], [ai, web3]);
  const stages = useMemo(() => ["All", "Idea", "MVP", "Seed", "Series A+", "Public"], []);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
      <header className="glass flex flex-col md:flex-row md:items-center gap-4 justify-between p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden md:inline text-sm text-slate-300">Web3 & AI Directory</span>
        </div>
        <div className="flex gap-2">
          {defaultTabs.map(t => (
            <button key={t} onClick={() => setActive(t)} className={`pill ${active===t ? 'ring-1 ring-brand-400' : ''}`}>{t}</button>
          ))}
        </div>
      </header>

      <section className="section">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder={`Search ${active.toLowerCase()} by name, tag, sector…`}
            className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <div className="flex flex-wrap gap-2">
            <select value={region} onChange={e=>setRegion(e.target.value)} className="pill">
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {active!=="Investors" ? (
              <>
                <select value={stage} onChange={e=>setStage(e.target.value)} className="pill">
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={chain} onChange={e=>setChain(e.target.value)} className="pill">
                  {chains.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={sector} onChange={e=>setSector(e.target.value)} className="pill">
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {active === "Investors"
            ? filteredInvestors.map(i => <InvestorCard key={i.id} i={i} />)
            : filteredProjects.map(p => <ProjectCard key={p.id} p={p} />)
          }
        </div>

        <div className="text-xs text-slate-400 mt-6">
          Tip: Add more entries by editing files in <code>/data/*.json</code> then re-deploy, or use the Import button below to load CSV/JSON locally (saved to your browser).
        </div>

        <ImportControls
          onImport={(payload) => {
            try {
              if (active === "Investors") {
                localStorage.setItem("ac.inv", JSON.stringify(payload)); setInvestors([...(investorData as Investor[]), ...payload]);
              } else if (active === "Web3") {
                localStorage.setItem("ac.w3", JSON.stringify(payload)); setWeb3([...(web3Data as Project[]), ...payload]);
              } else {
                localStorage.setItem("ac.ai", JSON.stringify(payload)); setAi([...(aiData as Project[]), ...payload]);
              }
              alert("Imported to local browser storage. To make it permanent, edit /data/*.json and redeploy.");
            } catch (e) { alert("Import failed: " + (e as Error).message); }
          }}
          active={active}
        />
      </section>

      <footer className="opacity-80 text-center pb-8">
        <p className="text-sm">© {new Date().getFullYear()} acclerators.club • Built with Next.js</p>
      </footer>
    </main>
  );
}

function ImportControls({ onImport, active }:{ onImport: (payload:any[])=>void, active:string }) {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<"json"|"csv">("json");

  function parseCSV(csv: string) {
    const [headerLine, ...lines] = csv.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(",").map(h=>h.trim());
    return lines.map(line => {
      const values = line.split(",").map(v=>v.trim());
      const obj: Record<string, any> = {};
      headers.forEach((h, idx) => obj[h] = values[idx]);
      return obj;
    });
  }

  function doImport() {
    try {
      const payload = format === "json" ? JSON.parse(text) : parseCSV(text);
      onImport(payload);
      setText("");
    } catch (e:any) {
      alert("Invalid input: " + e.message);
    }
  }

  return (
    <div className="mt-6 space-y-2">
      <details className="glass p-4">
        <summary className="cursor-pointer text-sm">Import {active} (CSV or JSON) – local only</summary>
        <div className="mt-3 space-y-2">
          <select value={format} onChange={e=>setFormat(e.target.value as any)} className="pill">
            <option value="json">JSON array</option>
            <option value="csv">CSV (header line required)</option>
          </select>
          <textarea
            value={text}
            onChange={e=>setText(e.target.value)}
            placeholder={format==="json" ? "[{...}]" : "name,url,description,category,chain,sector,stage,region"}
            className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
          />
          <div className="flex gap-2">
            <button onClick={doImport} className="pill">Import</button>
            <span className="text-xs text-slate-400">Data is saved to your browser (localStorage). For permanent listings, edit files in <code>/data</code> & redeploy.</span>
          </div>
        </div>
      </details>
    </div>
  );
}
