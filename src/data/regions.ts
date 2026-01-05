export type RegionKey =
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar"
  | "paldea";

export type RegionDef = {
  key: RegionKey;
  label: string;
  from: number;
  to: number;
  color: string; // tailwind classes
};

export const REGIONS: RegionDef[] = [
  { key: "kanto", label: "Kanto", from: 1, to: 151, color: "bg-emerald-500 hover:bg-emerald-600" },
  { key: "johto", label: "Johto", from: 152, to: 251, color: "bg-amber-500 hover:bg-amber-600" },
  { key: "hoenn", label: "Hoenn", from: 252, to: 386, color: "bg-sky-500 hover:bg-sky-600" },
  { key: "sinnoh", label: "Sinnoh", from: 387, to: 493, color: "bg-indigo-500 hover:bg-indigo-600" },
  { key: "unova", label: "Unova", from: 494, to: 649, color: "bg-slate-700 hover:bg-slate-800" },
  { key: "kalos", label: "Kalos", from: 650, to: 721, color: "bg-pink-500 hover:bg-pink-600" },
  { key: "alola", label: "Alola", from: 722, to: 809, color: "bg-teal-500 hover:bg-teal-600" },
  { key: "galar", label: "Galar", from: 810, to: 905, color: "bg-violet-500 hover:bg-violet-600" },
  { key: "paldea", label: "Paldea", from: 906, to: 1025, color: "bg-rose-500 hover:bg-rose-600" },
];
