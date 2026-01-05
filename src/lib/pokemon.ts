import type { Pokemon } from "../data/kanto";
import type { RegionKey } from "../data/regions";
import { KANTO_POKEMONS } from "../data/kanto";

// Helpers de formatação
const pad3 = (n: number) => String(n).padStart(3, "0");

const formatMeters = (decimeters: number) => {
    const m = decimeters / 10;
    const s = m.toFixed(2).replace(/\.?0+$/, "");
    return `${s} m`;
};

const formatKg = (hectograms: number) => {
    const kg = hectograms / 10;
    const s = kg.toFixed(1).replace(/\.0$/, "");
    return `${s} kg`;
};

const formatName = (apiName: string) => {
    const keepDash = apiName === "ho-oh";
    const parts = apiName.split("-").map((p) => {
        if (!p) return p;
        return p.charAt(0).toUpperCase() + p.slice(1);
    });
    return keepDash ? parts.join("-") : parts.join(" ");
};

// Type chart (defensivo) para weaknesses
type TypeName =
    | "Normal" | "Fire" | "Water" | "Electric" | "Grass" | "Ice"
    | "Fighting" | "Poison" | "Ground" | "Flying" | "Psychic" | "Bug"
    | "Rock" | "Ghost" | "Dragon" | "Dark" | "Steel" | "Fairy";

const ALL_TYPES: TypeName[] = [
    "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying",
    "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
];

const DEF_MULT: Record<TypeName, Partial<Record<TypeName, number>>> = {
    Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
    Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
    Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
    Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
    Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
    Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
    Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Ghost: 0, Fairy: 0.5 },
    Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
    Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
    Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
    Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
    Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
    Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
    Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
    Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
    Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
    Steel: { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
    Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
};

const attackMultiplier = (attack: TypeName, defense: TypeName) => {
    const m = DEF_MULT[attack]?.[defense];
    return typeof m === "number" ? m : 1;
};

export const computeWeaknesses = (defTypes: string[]): string[] => {
    const defenses = defTypes as TypeName[];
    const weak: TypeName[] = [];
    for (const atk of ALL_TYPES) {
        let mult = 1;
        for (const def of defenses) mult *= attackMultiplier(atk, def);
        if (mult > 1) weak.push(atk);
    }
    return weak;
};

// Fetch via PokeAPI
const API = "https://pokeapi.co/api/v2/pokemon";

const mapLimit = async <T, R>(
    items: T[],
    limit: number,
    fn: (item: T, idx: number) => Promise<R>
): Promise<R[]> => {
    const out: R[] = [];
    let i = 0;

    const workers = Array.from({ length: Math.max(1, limit) }, async () => {
        while (i < items.length) {
            const idx = i++;
            out[idx] = await fn(items[idx], idx);
        }
    });

    await Promise.all(workers);
    return out;
};

const toSerebiiImg = (id: number) => `https://www.serebii.net/pokemon/art/${pad3(id)}.png`;

const normalizeTypes = (types: string[]): string[] => {
    return types.map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
};

const fetchPokemon = async (id: number): Promise<Pokemon> => {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error(`Falha ao buscar Pokémon #${id} (${res.status})`);
    const data = await res.json();

    const types = normalizeTypes((data.types ?? []).map((x: any) => x.type?.name).filter(Boolean));
    const weaknesses = computeWeaknesses(types);

    return {
        id,
        num: pad3(id),
        name: formatName(data.name ?? `Pokemon ${id}`),
        img: toSerebiiImg(id),
        type: types,
        height: formatMeters(data.height ?? 0),
        weight: formatKg(data.weight ?? 0),
        weaknesses,
    };
};

const cacheKey = (region: RegionKey) => `pokedexpro_region_${region}_v1`;

export const getRegionPokemons = async (
    region: RegionKey,
    from: number,
    to: number
): Promise<Pokemon[]> => {
    if (region === "kanto") return KANTO_POKEMONS;

    const key = cacheKey(region);
    const cached = localStorage.getItem(key);
    if (cached) {
        try {
            const parsed = JSON.parse(cached) as Pokemon[];
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
            //
        }
    }

    const ids = Array.from({ length: to - from + 1 }, (_, i) => from + i);

    const list = await mapLimit(ids, 10, async (id) => {
        try {
            return await fetchPokemon(id);
        } catch {
            return {
                id,
                num: pad3(id),
                name: `Pokémon ${pad3(id)}`,
                img: toSerebiiImg(id),
                type: ["Normal"],
                height: "N/A",
                weight: "N/A",
                weaknesses: ["Fighting"],
            };
        }
    });

    localStorage.setItem(key, JSON.stringify(list));
    return list;
};
