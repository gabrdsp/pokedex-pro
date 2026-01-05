// src/data/kanto.ts
// This module is "complete" (compiles and runs) even if your Kanto dataset contains extra fields
// like candy, egg, spawn_chance, multipliers, etc.
//
// Recommended setup:
// 1) Create a file: src/data/kanto.raw.json
// 2) Paste the FULL Kanto dataset array there (151 entries), as pure JSON (no "export", no trailing commas).
// 3) This file will import that JSON and normalize it to the app-friendly structure.
//
// IMPORTANT (Vite):
// - Importing JSON directly works in Vite/TS.
// - Ensure tsconfig has "resolveJsonModule": true (usually already OK in Vite templates).

export type PokemonRef = { num: string; name: string };

export type Pokemon = {
  id: number;
  num: string;
  name: string;
  img: string;
  type: string[];
  height: string;
  weight: string;
  weaknesses: string[];

  prev_evolution?: PokemonRef[];
  next_evolution?: PokemonRef[];

  // Optional extra fields (your dataset includes these)
  candy?: string;
  candy_count?: number;
  egg?: string;
  spawn_chance?: number;
  avg_spawns?: number;
  spawn_time?: string;
  multipliers?: number[] | null;
};

// This is the example line you requested (exactly in the same format):
export const KANTO_EXAMPLE_LINE = {
  id: 1,
  num: "001",
  name: "Bulbasaur",
  img: "https://www.serebii.net/pokemon/art/001.png",
  type: ["Grass", "Poison"],
  height: "0.71 m",
  weight: "6.9 kg",
  candy: "Bulbasaur Candy",
  candy_count: 25,
  egg: "2 km",
  spawn_chance: 0.69,
  avg_spawns: 69,
  spawn_time: "20:00",
  multipliers: [1.58],
  weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
  next_evolution: [
    { num: "002", name: "Ivysaur" },
    { num: "003", name: "Venusaur" },
  ],
} satisfies Pokemon;

// ---- Load the full Kanto dataset from JSON (you paste the 151 entries there) ----
import KANTO_RAW from "./kanto.raw.json";

// ---- Normalization helpers ----
function normalizeTypeList(rawType: unknown): string[] {
  // Handles both:
  // - ["Psychic", "Fairy"]
  // - ["Psychic, Fairy"]  (bad data we’ve seen in the snippet)
  if (!Array.isArray(rawType)) return [];
  return rawType
    .flatMap((t) => {
      if (typeof t !== "string") return [];
      return t.split(",").map((x) => x.trim()).filter(Boolean);
    })
    .filter(Boolean);
}

function normalizePokemon(raw: any): Pokemon {
  return {
    id: Number(raw.id),
    num: String(raw.num),
    name: String(raw.name),
    img: String(raw.img),
    type: normalizeTypeList(raw.type),
    height: String(raw.height),
    weight: String(raw.weight),
    weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses.map(String) : [],

    prev_evolution: Array.isArray(raw.prev_evolution)
      ? raw.prev_evolution.map((e: any) => ({ num: String(e.num), name: String(e.name) }))
      : undefined,

    next_evolution: Array.isArray(raw.next_evolution)
      ? raw.next_evolution.map((e: any) => ({ num: String(e.num), name: String(e.name) }))
      : undefined,

    // Keep extra fields if present
    candy: typeof raw.candy === "string" ? raw.candy : undefined,
    candy_count: typeof raw.candy_count === "number" ? raw.candy_count : undefined,
    egg: typeof raw.egg === "string" ? raw.egg : undefined,
    spawn_chance: typeof raw.spawn_chance === "number" ? raw.spawn_chance : undefined,
    avg_spawns: typeof raw.avg_spawns === "number" ? raw.avg_spawns : undefined,
    spawn_time: typeof raw.spawn_time === "string" ? raw.spawn_time : undefined,
    multipliers: Array.isArray(raw.multipliers)
      ? raw.multipliers.map(Number)
      : raw.multipliers === null
        ? null
        : undefined,
  };
}

// Export normalized list used by the app
export const KANTO_POKEMONS: Pokemon[] = (Array.isArray(KANTO_RAW) ? KANTO_RAW : []).map(normalizePokemon);

// Optional: quick sanity check helper (you can remove if you want)
export const KANTO_META = {
  region: "Kanto",
  expectedCount: 151,
  actualCount: KANTO_POKEMONS.length,
};
