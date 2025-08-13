
export type Project = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: "Web3" | "AI";
  chain?: string;          // for Web3
  sector?: string;         // for AI or Web3
  stage?: "Idea" | "MVP" | "Seed" | "Series A+" | "Public";
  region?: string;
  tags?: string[];
};

export type Investor = {
  id: string;
  name: string;
  url: string;
  chequeMinUSD?: number;
  chequeMaxUSD?: number;
  stages: Array<"Pre-seed" | "Seed" | "Series A" | "Series B+">;
  focus: string[]; // keywords like "DeFi", "Infra", "Agentic AI"
  region?: string;
  notes?: string;
};
