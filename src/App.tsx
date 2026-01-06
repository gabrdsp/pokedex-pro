import { useEffect, useMemo, useState } from "react";
import iconPng from "./assets/icon.png";
import {
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  Weight,
  Ruler,
  CircleDot,
  Info,
  Check,
  Trash2,
  Users,
} from "lucide-react";

import { REGIONS, type RegionKey } from "./data/regions";
import { getRegionPokemons } from "./lib/pokemon";
import type { Pokemon } from "./data/kanto";

// ------------------------
// Tipos: ícones
// ------------------------
import GO_Bug from "./assets/itypes/GO_Bug.png";
import GO_Dark from "./assets/itypes/GO_Dark.png";
import GO_Dragon from "./assets/itypes/GO_Dragon.png";
import GO_Electric from "./assets/itypes/GO_Electric.png";
import GO_Fairy from "./assets/itypes/GO_Fairy.png";
import GO_Fighting from "./assets/itypes/GO_Fighting.png";
import GO_Fire from "./assets/itypes/GO_Fire.png";
import GO_Flying from "./assets/itypes/GO_Flying.png";
import GO_Ghost from "./assets/itypes/GO_Ghost.png";
import GO_Grass from "./assets/itypes/GO_Grass.png";
import GO_Ground from "./assets/itypes/GO_Ground.png";
import GO_Ice from "./assets/itypes/GO_Ice.png";
import GO_Normal from "./assets/itypes/GO_Normal.png";
import GO_Poison from "./assets/itypes/GO_Poison.png";
import GO_Psychic from "./assets/itypes/GO_Psychic.png";
import GO_Rock from "./assets/itypes/GO_Rock.png";
import GO_Steel from "./assets/itypes/GO_Steel.png";
import GO_Water from "./assets/itypes/GO_Water.png";

// ------------------------
// Helpers
// ------------------------
type EvoRef = { num: string; name: string };

const pad3 = (n: number) => String(n).padStart(3, "0");

const formatName = (apiName: string) => {
  const keepDash = apiName === "ho-oh";
  const parts = apiName.split("-").map((p) => {
    if (!p) return p;
    return p.charAt(0).toUpperCase() + p.slice(1);
  });
  return keepDash ? parts.join("-") : parts.join(" ");
};

const extractIdFromUrl = (url?: string): number | null => {
  if (!url) return null;
  const m = url.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
};

// Fallback image (Serebii arts)
const toSerebiiImg = (id: number) =>
  `https://www.serebii.net/pokemon/art/${pad3(id)}.png`;

// ------------------------
// Tipos: descrição
// ------------------------

// NOVO: mapa de imagens para os 18 tipos
const TYPE_IMAGES: Record<string, string> = {
  Grass: GO_Grass,
  Poison: GO_Poison,
  Fire: GO_Fire,
  Flying: GO_Flying,
  Water: GO_Water,
  Bug: GO_Bug,
  Normal: GO_Normal,
  Electric: GO_Electric,
  Ground: GO_Ground,
  Rock: GO_Rock,
  Psychic: GO_Psychic,
  Fighting: GO_Fighting,
  Ice: GO_Ice,
  Ghost: GO_Ghost,
  Dragon: GO_Dragon,
  Steel: GO_Steel,
  Fairy: GO_Fairy,
  Dark: GO_Dark,
};

const TYPE_TRANSLATIONS: Record<string, string> = {
  Grass: "Grama",
  Poison: "Veneno",
  Fire: "Fogo",
  Flying: "Voador",
  Water: "Água",
  Bug: "Inseto",
  Normal: "Normal",
  Electric: "Elétrico",
  Ground: "Terra",
  Rock: "Pedra",
  Psychic: "Psíquico",
  Fighting: "Lutador",
  Ice: "Gelo",
  Ghost: "Fantasma",
  Dragon: "Dragão",
  Steel: "Metal",
  Fairy: "Fada",
  Dark: "Sombrio",
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  Normal:
    "Os Pokémons do tipo Normal habitam uma grande variedade de biomas, como campos, florestas, pradarias, cidades e áreas urbanas, sendo um dos tipos mais comuns e adaptáveis.",
  Fire:
    "Os Pokémons do tipo Fogo habitam locais quentes e abertos como desertos, pastagens, montanhas vulcânicas",
  Water:
    "Os Pokémons do tipo Água habitam uma vasta gama de ambientes aquáticos, como oceanos, rios, lagos, pântanos e recifes, incluindo áreas costeiras e até mesmo águas doces paradas como lagoas, adaptando-se a diferentes correntes, profundidades e salinidade, sendo frequentemente encontrados em locais com chuvas intensas, que favorecem sua aparição. ",
  Electric:
    "Os Pokémons do tipo elétrico vivem em diversos habitats, como locais industriais, usinas de energia, cidades e florestas, sendo atraídos por atividade elétrica",
  Grass:
    "Os Pokémons do tipo Grama habitam principalmente ambientes naturais como florestas, jardins, selvas e áreas com vegetação densa, onde se camuflam e se alimentam da flora local, sendo encontrados perto de árvores, capinzais e até mesmo em terrenos com flores, sendo alguns mais específicos de regiões tropicais ou áreas arborizadas.",
  Ice:
    "Os Pokémons do tipo Gelo vivem em ambientes extremamente frios, como topos de montanhas geladas, cavernas de gelo, geleiras e os polos, adaptando-se a baixíssimas temperaturas.",
  Fighting:
    "Os Pokémon do tipo Lutador são frequentemente encontrados em áreas urbanas, como cidades e academias de ginástica, mas também podem ser encontrados em ambientes naturais como florestas, campos e montanhas.",
  Poison:
    "Os Pokémon do tipo Venenoso habitam, predominantemente, em cavernas, pântanos e áreas poluídas",
  Ground:
    "Os Pokémons do tipo Terrestre habitam principalmente cavernas, montanhas, desertos, planícies, e terrenos rochosos ou arenosos, aproveitando seu controle sobre o solo para se esconder ou lutar, sendo comuns em locais secos e com rochas, com movimentos como Earthquake, Mud-Slap e Dig refletindo seus habitats e habilidades. ",
  Flying:
    "Os Pokémon do tipo Voador habitam principalmente em locais de alta altitude, como os céus, e em ambientes que oferecem pontos de pousos, como montanhas e topos de árvores em florestas.",
  Psychic:
    "Os Pokémons do tipo Psíquico habitam uma grande variedade de biomas, como campos, florestas, centro urbanos, como parques.",
  Bug:
    "Os Pokémons do tipo Inseto habitam principalmente florestas, áreas com grama alta e zonas com vegetação densa. Eles são comumente encontrados em habitats como áreas verdes e parques.",
  Rock:
    "Os Pokémons do tipo Pedra habitam locais rochosos como montanhas, cavernas, pedreiras, estacionamentos, rodovias e até grandes construções, aproveitando ambientes com muitas rochas e minerais, além de fósseis pré-históricos encontrados em praias.",
  Ghost:
    "Os Pokémons do tipo Fantasma habitam, predominantemente, em locais sombrios, assustadores e isolados, como cavernas, florestas escuras e torres abandonadas.",
  Dragon:
    "Os Pokémons do tipo Dragão são raros e poderosos, habitando locais variados como rios, lagos, montanhas, cavernas e até áreas costeiras ou isoladas, muitas vezes em locais turísticos ou pontos de encontro de água, refletindo sua natureza mística e evasiva, como Dratini perto de lagos e Dragonite em ilhas secretas.",
  Dark:
    "Os Pokémons do tipo Sombrio geralmente habitam locais que refletem sua natureza, ou seja, áreas escuras e isoladas",
  Steel:
    "Os Pokémons do tipo Metal são frequentemente encontrados em habitats que remetem a ambientes industriais, urbanos ou geológicos, como cidades, fábricas e montanhas rochosas.",
  Fairy:
    "Os Pokémons do tipo Fada habitam principalmente locais na natureza, como florestas densas, campos floridos, rios e montanhas",
};

// ------------------------
// Regiões
// ------------------------
const REGION_GRADIENTS: Record<RegionKey, string> = {
  kanto:
    "from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500",
  johto:
    "from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500",
  hoenn:
    "from-sky-400 via-blue-400 to-indigo-400 hover:from-sky-500 hover:via-blue-500 hover:to-indigo-500",
  sinnoh:
    "from-indigo-400 via-violet-400 to-fuchsia-400 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500",
  unova:
    "from-slate-400 via-zinc-400 to-stone-400 hover:from-slate-500 hover:via-zinc-500 hover:to-stone-500",
  kalos:
    "from-pink-400 via-fuchsia-400 to-violet-400 hover:from-pink-500 hover:via-fuchsia-500 hover:to-violet-500",
  alola:
    "from-teal-400 via-emerald-400 to-lime-400 hover:from-teal-500 hover:via-emerald-500 hover:to-lime-500",
  galar:
    "from-violet-400 via-purple-400 to-indigo-400 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500",
  paldea:
    "from-rose-400 via-pink-400 to-amber-400 hover:from-rose-500 hover:via-pink-500 hover:to-amber-500",
};

// ------------------------
// UI Components
// ------------------------
const TypeBadge = ({
  type,
  size = "md",
  onClick,
}: {
  type: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
}) => {
  const imgSrc = TYPE_IMAGES[type];

  const sizeClasses =
    size === "lg"
      ? "w-16 h-16 p-4"
      : size === "xl"
      ? "w-24 h-24 p-6"
      : size === "sm"
      ? "w-7 h-7 p-1"
      : "w-10 h-10 p-2";

  return (
    <div
      onClick={onClick}
      className={[
        "flex items-center justify-center",
        "transition-transform duration-200 hover:scale-110",
        onClick ? "cursor-pointer" : "",
        sizeClasses,
      ].join(" ")}
      title={type}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={type} className="w-full h-full object-contain" />
      ) : (
        <CircleDot className="w-full h-full" strokeWidth={2.5} />
      )}
    </div>
  );
};

const PokemonCard = ({
  pokemon,
  onClick,
}: {
  pokemon: Pokemon;
  onClick: (p: Pokemon) => void;
}) => (
  <div
    onClick={() => onClick(pokemon)}
    className={[
      "group relative overflow-hidden cursor-pointer h-full",
      "rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl",
      "shadow-[0_12px_30px_rgba(15,23,42,0.08)]",
      "hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)]",
      "transition-all duration-300 hover:-translate-y-1",
      "p-6 flex flex-col items-center justify-between",
    ].join(" ")}
  >
    <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-cyan-200/40 via-fuchsia-200/30 to-amber-200/30 blur-2xl opacity-70 group-hover:opacity-90 transition-opacity" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/30" />

    <span className="relative z-10 self-end text-slate-400 font-mono text-sm font-bold">
      #{pokemon.num}
    </span>

    <div className="relative z-10 w-32 h-32 my-4 transition-transform duration-500 group-hover:scale-110">
      <img
        src={pokemon.img}
        alt={pokemon.name}
        className="w-full h-full object-contain drop-shadow-md"
        onError={(e) => {
          const idNum = Number(pokemon.num);
          (e.target as HTMLImageElement).src = Number.isFinite(idNum)
            ? toSerebiiImg(idNum)
            : "https://via.placeholder.com/150?text=?";
        }}
      />
    </div>

    <div className="relative z-10 text-center w-full">
      <h3 className="text-slate-800 text-lg font-extrabold mb-3 tracking-tight">
        {pokemon.name}
      </h3>
      <div className="flex justify-center gap-2">
        {pokemon.type.map((t: string) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </div>
  </div>
);

const Header = ({
  setView,
  currentView,
}: {
  setView: (v: "region" | "home" | "types" | "about" | "team") => void;
  currentView: "region" | "home" | "types" | "about" | "team";
}) => (
  <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
    <div className="container mx-auto px-6 h-16 flex items-center justify-center">
      <nav className="flex items-center justify-center gap-2 text-sm font-extrabold text-slate-600">
        <button
          onClick={() => setView("region")}
          className={[
            "px-4 py-2 rounded-full transition-colors text-center inline-flex items-center justify-center",
            currentView === "region"
              ? "bg-sky-50 text-sky-700 border border-sky-100"
              : "hover:bg-slate-50 hover:text-slate-900",
          ].join(" ")}
        >
          Início
        </button>

        <button
          onClick={() => setView("types")}
          className={[
            "px-4 py-2 rounded-full transition-colors text-center inline-flex items-center justify-center",
            currentView === "types"
              ? "bg-sky-50 text-sky-700 border border-sky-100"
              : "hover:bg-slate-50 hover:text-slate-900",
          ].join(" ")}
        >
          Tipos
        </button>

        <button
          onClick={() => setView("about")}
          className={[
            "px-4 py-2 rounded-full transition-colors text-center inline-flex items-center justify-center",
            currentView === "about"
              ? "bg-sky-50 text-sky-700 border border-sky-100"
              : "hover:bg-slate-50 hover:text-slate-900",
          ].join(" ")}
        >
          Sobre
        </button>
      </nav>
    </div>
  </header>
);

const FilterDock = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Buscar...",
}: {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  placeholder?: string;
}) => (
  <div className="sticky top-20 z-40 flex justify-center w-full px-4 mb-10">
    <div className="max-w-md w-full rounded-full p-1 bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={[
            "w-full rounded-full pl-10 pr-4 py-2 text-sm",
            "bg-slate-50 text-slate-800 placeholder:text-slate-400",
            "border border-transparent focus:border-sky-200 focus:bg-white",
            "focus:outline-none focus:ring-2 focus:ring-sky-200/60 transition",
          ].join(" ")}
        />
      </div>
    </div>
  </div>
);

// ------------------------
// Tela: Seleção de Região
// ------------------------
const RegionSelect = ({
  onSelect,
  onCreateTeam,
}: {
  onSelect: (region: RegionKey) => void;
  onCreateTeam: () => void;
}) => (
  <main className="container mx-auto px-4 py-16 pb-24">
    <div className="text-center py-8">
      <button
        onClick={onCreateTeam}
        className={[
          "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 border border-white/60 shadow-sm",
          "hover:bg-white/90 hover:border-white/80 transition",
          "focus:outline-none focus:ring-4 focus:ring-sky-200/60",
        ].join(" ")}
        aria-label="Crie seu time"
      >
        <img src={iconPng} alt="PokédexPro" className="w-5 h-5" />
        <span className="text-sm font-extrabold text-slate-700">
          Crie seu time
        </span>
      </button>

      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mt-6 mb-4">
        Escolha uma <span className="text-sky-600">região</span>.
      </h1>
      <p className="text-slate-600 max-w-xl mx-auto">
        Selecione uma geração para abrir a Pokédex correspondente.
      </p>
    </div>

    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {REGIONS.map((r) => (
        <button
          key={r.key}
          onClick={() => onSelect(r.key)}
          className={[
            "group relative overflow-hidden text-left",
            "rounded-3xl px-6 py-6 text-white",
            "bg-gradient-to-br",
            REGION_GRADIENTS[r.key],
            "shadow-[0_18px_55px_rgba(15,23,42,0.16)]",
            "hover:shadow-[0_24px_70px_rgba(15,23,42,0.22)]",
            "transition-all duration-300 hover:-translate-y-1",
            "focus:outline-none focus:ring-4 focus:ring-white/60",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-white/25 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

          <div className="relative z-10 text-xl font-extrabold">{r.label}</div>
          <div className="relative z-10 text-white/90 text-sm font-semibold mt-1">
            #{String(r.from).padStart(3, "0")} – #{String(r.to).padStart(3, "0")}
          </div>

          <div className="relative z-10 mt-5 inline-flex items-center gap-2 text-white/95 text-sm font-extrabold">
            Abrir Pokédex <ArrowRight size={16} />
          </div>
        </button>
      ))}
    </div>
  </main>
);

// ------------------------
// Home
// ------------------------
const Home = ({
  searchTerm,
  setSearchTerm,
  filteredPokemon,
  onPokemonClick,
  regionLabel,
  isLoading,
}: {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filteredPokemon: Pokemon[];
  onPokemonClick: (p: Pokemon) => void;
  regionLabel: string;
  isLoading: boolean;
}) => (
  <main className="container mx-auto px-4 relative pb-24">
    <div className="text-center py-14">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 border border-white/60 shadow-sm">
        <img src={iconPng} alt="PokédexPro" className="w-5 h-5" />
        <span className="text-sm font-extrabold text-slate-700">
          {regionLabel}
        </span>
      </div>

      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mt-6 mb-3">
        {regionLabel}: escolha seu{" "}
        <span className="text-sky-600">companheiro</span>.
      </h1>

      <p className="text-slate-600 max-w-xl mx-auto">
        Explore a Pokédex da geração selecionada.
      </p>
    </div>

    <FilterDock
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      placeholder="Buscar Pokémon..."
    />

    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 bg-white/75 px-4 py-2 rounded-full text-xs font-extrabold text-slate-600 border border-white/60 shadow-sm">
        {isLoading ? "Carregando..." : `${filteredPokemon.length} Pokémon`}
      </span>
    </div>

    {isLoading ? (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="w-16 h-16 bg-white/80 border border-white/60 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Search size={22} />
        </div>
        <p className="font-bold">Buscando dados da região…</p>
        <p className="text-xs mt-2 text-slate-400">
          Primeiro carregamento pode levar alguns segundos.
        </p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={onPokemonClick}
            />
          ))}
        </div>

        {filteredPokemon.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <div className="w-16 h-16 bg-white/80 border border-white/60 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Search size={22} />
            </div>
            <p className="font-bold">Nenhuma correspondência encontrada</p>
          </div>
        )}
      </>
    )}
  </main>
);

// ------------------------
// Team Builder (novo)
// - escolha até 6 Pokémon, de TODAS as gerações
// - listagem agrupada por geração (REGIONS)
// - Cards: apenas imagem (mais prático)
// ------------------------
const TeamBuilder = ({
  allPokemon,
  isLoadingAll,
  ensureAllLoaded,
  team,
  setTeam,
}: {
  allPokemon: Pokemon[];
  isLoadingAll: boolean;
  ensureAllLoaded: () => void;
  team: Pokemon[];
  setTeam: (t: Pokemon[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (allPokemon.length === 0) ensureAllLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teamIds = useMemo(() => new Set(team.map((p) => p.id)), [team]);

  const togglePokemon = (p: Pokemon) => {
    const exists = teamIds.has(p.id);
    if (exists) {
      setTeam(team.filter((x) => x.id !== p.id));
      return;
    }
    if (team.length >= 6) return;
    setTeam([...team, p]);
  };

  const removeFromTeam = (id: number) => setTeam(team.filter((p) => p.id !== id));

  const filteredAll = useMemo(() => {
    if (!searchTerm) return allPokemon;
    const lower = searchTerm.toLowerCase();
    return allPokemon.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.num.includes(lower) ||
        String(p.id).includes(lower)
    );
  }, [allPokemon, searchTerm]);

  const byRegion = useMemo(() => {
    return REGIONS.map((r) => {
      const list = filteredAll.filter((p) => p.id >= r.from && p.id <= r.to);
      return { region: r, list };
    });
  }, [filteredAll]);

  const TeamSlot = ({ index }: { index: number }) => {
    const p = team[index];
    if (!p) {
      return (
        <div
          className={[
            "rounded-3xl border border-dashed border-slate-200",
            "bg-white/55 backdrop-blur-xl",
            "h-20 flex items-center justify-center",
            "shadow-[0_10px_30px_rgba(15,23,42,0.06)]",
          ].join(" ")}
        >
          <span className="text-xs font-extrabold text-slate-400">
            Slot {index + 1}
          </span>
        </div>
      );
    }

    return (
      <div
        className={[
          "relative rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl",
          "shadow-[0_12px_30px_rgba(15,23,42,0.08)]",
          "h-20 flex items-center gap-3 px-4",
        ].join(" ")}
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
          <img
            src={p.img}
            alt={p.name}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              const idNum = Number(p.num);
              (e.target as HTMLImageElement).src = Number.isFinite(idNum)
                ? toSerebiiImg(idNum)
                : "https://via.placeholder.com/64?text=?";
            }}
          />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-800 truncate">
              {p.name}
            </span>
            <span className="text-xs font-black text-slate-400 font-mono">
              #{p.num}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {p.type.slice(0, 2).map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </div>

        <button
          onClick={() => removeFromTeam(p.id)}
          className={[
            "absolute -top-2 -right-2",
            "w-8 h-8 rounded-full bg-white/90 border border-white/70 shadow-sm",
            "text-slate-600 hover:text-rose-600 hover:bg-white transition",
            "flex items-center justify-center",
            "focus:outline-none focus:ring-4 focus:ring-rose-200/60",
          ].join(" ")}
          aria-label={`Remover ${p.name} do time`}
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // Card minimalista: apenas imagem + estado selecionado
  const PokemonPickTile = ({ p }: { p: Pokemon }) => {
    const selected = teamIds.has(p.id);
    const disabled = !selected && team.length >= 6;

    return (
      <button
        onClick={() => !disabled && togglePokemon(p)}
        className={[
          "group relative overflow-hidden",
          "rounded-2xl border border-white/60 bg-white/75 backdrop-blur-xl",
          "shadow-[0_10px_28px_rgba(15,23,42,0.07)]",
          "hover:shadow-[0_14px_36px_rgba(15,23,42,0.11)]",
          "transition-all duration-200",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5",
          selected ? "ring-4 ring-sky-200/70" : "",
          "p-3",
          "focus:outline-none focus:ring-4 focus:ring-sky-200/60",
        ].join(" ")}
        aria-label={selected ? `Remover ${p.name}` : `Adicionar ${p.name}`}
        title={selected ? "Selecionado" : "Selecionar"}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br from-cyan-200/35 via-fuchsia-200/25 to-amber-200/25 blur-2xl opacity-70" />

        <div className="relative z-10 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
            <img
              src={p.img}
              alt={p.name}
              className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-sm"
              onError={(e) => {
                const idNum = Number(p.num);
                (e.target as HTMLImageElement).src = Number.isFinite(idNum)
                  ? toSerebiiImg(idNum)
                  : "https://via.placeholder.com/64?text=?";
              }}
            />
          </div>
        </div>

        {/* Check de selecionado */}
        <div className="absolute top-2 right-2 z-20">
          {selected ? (
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <Check size={14} />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/80 border border-white/70 text-slate-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition">
              <ArrowRight size={14} />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <main className="container mx-auto px-4 py-14 pb-24">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 border border-white/60 shadow-sm">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-extrabold text-slate-700">
            Monte seu time (até 6)
          </span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mt-6 mb-3">
          Crie seu <span className="text-sky-600">time</span>.
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Escolha até 6 Pokémon de qualquer geração. A lista abaixo está
          separada por geração para facilitar.
        </p>
      </div>

      <div className="max-w-5xl mx-auto mt-10">
        <div className="rounded-[2rem] border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_18px_55px_rgba(15,23,42,0.10)] p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-left">
              <div className="text-sm font-extrabold text-slate-800">
                Seu time
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1">
                {team.length}/6 selecionados
              </div>
            </div>

            <button
              onClick={() => setTeam([])}
              disabled={team.length === 0}
              className={[
                "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-white/80 border border-white/60 shadow-sm",
                "text-sm font-extrabold text-slate-700",
                "hover:bg-white transition",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-4 focus:ring-sky-200/60",
              ].join(" ")}
            >
              <Trash2 size={16} />
              Limpar time
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <TeamSlot key={i} index={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <FilterDock
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar Pokémon (nome ou número)..."
        />

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-white/75 px-4 py-2 rounded-full text-xs font-extrabold text-slate-600 border border-white/60 shadow-sm">
            {isLoadingAll
              ? "Carregando lista completa…"
              : `${filteredAll.length} Pokémon disponíveis`}
          </span>
        </div>

        {isLoadingAll ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <div className="w-16 h-16 bg-white/80 border border-white/60 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Search size={22} />
            </div>
            <p className="font-bold">Preparando todas as gerações…</p>
            <p className="text-xs mt-2 text-slate-400">
              Isso pode levar alguns segundos no primeiro carregamento.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-10">
            {byRegion.map(({ region, list }) => (
              <section key={region.key}>
                <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
                  <div className="text-left">
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {region.label}
                    </h2>
                    <div className="text-sm font-semibold text-slate-500 mt-1">
                      #{String(region.from).padStart(3, "0")} – #
                      {String(region.to).padStart(3, "0")} • {list.length} Pokémon
                    </div>
                  </div>
                </div>

                {list.length === 0 ? (
                  <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-10 text-center text-slate-500 shadow-sm">
                    <div className="font-extrabold">
                      Nenhum Pokémon encontrado nesta geração
                    </div>
                    <div className="text-xs font-semibold text-slate-400 mt-2">
                      Ajuste sua busca.
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                    {list.map((p) => (
                      <PokemonPickTile key={p.id} p={p} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

// ------------------------
// Tipos
// ------------------------
const TypesPage = ({
  allPokemon,
  isLoadingAll,
  onPokemonClick,
}: {
  allPokemon: Pokemon[];
  isLoadingAll: boolean;
  onPokemonClick: (p: Pokemon) => void;
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeSearch, setTypeSearch] = useState("");

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    allPokemon.forEach((p) => p.type.forEach((t) => types.add(t)));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [allPokemon]);

  const allTypesFiltered = useMemo(() => {
    if (!typeSearch) return allTypes;
    const lower = typeSearch.toLowerCase();
    return allTypes.filter((t) => t.toLowerCase().includes(lower));
  }, [typeSearch, allTypes]);

  const filteredByType = useMemo(() => {
    if (!selectedType) return [];
    return allPokemon.filter((p) => p.type.includes(selectedType));
  }, [selectedType, allPokemon]);

  if (isLoadingAll) {
    return (
      <div className="container mx-auto px-4 py-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/75 px-4 py-2 rounded-full text-xs font-extrabold text-slate-600 border border-white/60 shadow-sm">
          Carregando Pokédex completa…
        </div>
        <div className="mt-10 text-slate-500 font-semibold">
          Preparando dados de todas as regiões (cache local ajuda a acelerar).
        </div>
      </div>
    );
  }

  if (selectedType) {
    const desc =
      TYPE_DESCRIPTIONS[selectedType] || "Tipo elemental do universo Pokémon.";

    return (
      <div className="container mx-auto px-4 py-10 pb-24">
        <button
          onClick={() => setSelectedType(null)}
          className="inline-flex items-center gap-2 mb-8 text-slate-600 hover:text-sky-700 transition-colors font-extrabold"
        >
          <ArrowLeft size={20} /> Voltar aos Tipos
        </button>

        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="flex justify-center mb-4">
            <TypeBadge type={selectedType} size="lg" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Pokémon do tipo {TYPE_TRANSLATIONS[selectedType] || selectedType}
          </h2>

          <div className="mt-4 inline-flex items-start gap-3 text-left bg-white/75 border border-white/60 rounded-2xl p-5 shadow-sm">
            <div className="mt-0.5 text-sky-600">
              <Info size={18} />
            </div>
            <p className="text-slate-700 font-semibold leading-relaxed">
              {desc}
            </p>
          </div>

          <p className="text-slate-600 mt-5 font-semibold">
            {filteredByType.length} Pokémon encontrados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredByType.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={onPokemonClick}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 pb-24 text-center">
      <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Tipos</h2>
      <p className="text-slate-600 mb-10">
        Selecione um elemento para ver todos os Pokémon desse tipo (todas as
        regiões).
      </p>

      <div className="max-w-md mx-auto mb-6">
        <FilterDock
          searchTerm={typeSearch}
          setSearchTerm={setTypeSearch}
          placeholder="Buscar tipo..."
        />
      </div>

      <div className="grid grid-cols-5 gap-6 max-w-6xl mx-auto">
        {allTypesFiltered.map((type: string) => (
          <button
            key={type}
            className="flex flex-col items-center gap-2 group"
            onClick={() => setSelectedType(type)}
          >
            <div className="group-hover:-translate-y-2 transition-transform duration-200">
              <TypeBadge type={type} size="xl" />
            </div>
            <span className="font-extrabold text-slate-700 group-hover:text-sky-700 transition-colors text-center text-sm">
              {TYPE_TRANSLATIONS[type] || type}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="container mx-auto px-4 py-20 pb-28 flex flex-col items-center text-center">
    <div className="w-20 h-20 bg-white/80 border border-white/60 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
      <img src={iconPng} alt="PokédexPro" className="w-12 h-12 object-contain" />
    </div>
    <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
      Sobre o Projeto
    </h2>
    <div className="max-w-2xl bg-white/75 p-10 rounded-3xl border border-white/60 shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
      <p className="text-lg text-slate-700 leading-relaxed">
        PokédexPro é um projeto desenvolvido para um trabalho acadêmico da
        disciplina de{" "}
        <span className="font-extrabold text-sky-600">Banco de Dados</span> pela{" "}
        <span className="font-extrabold text-slate-900">UFERSA</span>.
      </p>
      <div className="w-16 h-1 bg-slate-100 mx-auto my-8"></div>
      <p className="text-sm text-slate-600 font-semibold">
        Desenvolvido com React, Tailwind CSS e muita dedicação.
      </p>
    </div>
  </div>
);

const Footer = () => (
  <footer className="mt-auto py-10">
    <div className="container mx-auto px-6 text-center">
      <p className="text-slate-600 font-semibold mb-2">
        Este é um projeto realizado por fãs sem fins lucrativos.
      </p>
      <p className="text-slate-500 text-sm">© 2025 PokédexPro.</p>
    </div>
  </footer>
);

// ------------------------
// Evolução: cache
// ------------------------
type EvoCacheEntry = { prev: EvoRef[]; next: EvoRef[]; nextChain: EvoRef[] };
type EvoCache = Record<number, EvoCacheEntry>;

const PokemonModal = ({
  pokemon,
  onClose,
  onSelect,
  lookupByNum,
  evolutionFor,
}: {
  pokemon: Pokemon | null;
  onClose: () => void;
  onSelect: (p: Pokemon) => void;
  lookupByNum: (num: string) => Pokemon | null;
  evolutionFor: (p: Pokemon) => {
    prev: EvoRef[];
    next: EvoRef[];
    nextChain: EvoRef[];
  } | null;
}) => {
  if (!pokemon) return null;

  const evo = evolutionFor(pokemon);

  const renderEvoNode = (ref: EvoRef) => {
    const pData = lookupByNum(ref.num);
    const idNum = Number(ref.num);
    const img =
      pData?.img || (Number.isFinite(idNum) ? toSerebiiImg(idNum) : "");
    return (
      <button
        key={ref.num}
        className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity"
        onClick={() => pData && onSelect(pData)}
        title={ref.name}
      >
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 overflow-hidden">
          {img ? (
            <img src={img} className="w-10 h-10" alt={ref.name} />
          ) : (
            <span className="text-xs text-slate-400">?</span>
          )}
        </div>
        <span className="text-xs font-extrabold text-slate-600">
          {ref.name}
        </span>
      </button>
    );
  };

  const nextToShow = evo
    ? evo.nextChain.length > 0
      ? evo.nextChain
      : evo.next
    : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col md:flex-row bg-white">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-sm transition"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-5/12 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 relative flex flex-col items-center justify-center p-10 border-r border-slate-100">
          <div className="absolute top-10 left-10 text-8xl font-black text-slate-200/60 select-none">
            {pokemon.num}
          </div>

          <img
            src={pokemon.img}
            alt={pokemon.name}
            className="relative z-10 w-56 h-56 object-contain drop-shadow-xl"
            onError={(e) => {
              const idNum = Number(pokemon.num);
              (e.target as HTMLImageElement).src = Number.isFinite(idNum)
                ? toSerebiiImg(idNum)
                : "https://via.placeholder.com/256?text=?";
            }}
          />

          <div className="flex gap-4 mt-8 relative z-10">
            {pokemon.type.map((t: string) => (
              <div key={t} className="flex flex-col items-center gap-2">
                <TypeBadge type={t} size="lg" />
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-7/12 p-10 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
              {pokemon.name}
            </h2>
            <p className="text-slate-500 font-medium">Espécie de Pokémon</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Ruler size={14} /> Altura
              </div>
              <p className="text-xl font-bold text-slate-800">
                {pokemon.height}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Weight size={14} /> Peso
              </div>
              <p className="text-xl font-bold text-slate-800">
                {pokemon.weight}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-4">
              Fraquezas
            </h3>
            <div className="flex flex-wrap gap-3">
              {pokemon.weaknesses.map((w: string) => (
                <div
                  key={w}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm"
                >
                  <TypeBadge type={w} size="sm" />
                  <span className="text-sm font-bold text-slate-700">{w}</span>
                </div>
              ))}
            </div>
          </div>

          {evo && (evo.prev.length > 0 || nextToShow.length > 0) && (
            <div>
              <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                Cadeia de Evolução
              </h3>

              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {evo.prev.map((prev) => (
                  <div key={prev.num} className="flex items-center gap-4">
                    {renderEvoNode(prev)}
                    <ArrowRight size={16} className="text-slate-300" />
                  </div>
                ))}

                <div className="flex flex-col items-center scale-110">
                  <div className="w-14 h-14 rounded-full bg-sky-50 border-2 border-sky-100 flex items-center justify-center mb-2 shadow-sm overflow-hidden">
                    <img
                      src={pokemon.img}
                      className="w-10 h-10"
                      alt={pokemon.name}
                      onError={(e) => {
                        const idNum = Number(pokemon.num);
                        (e.target as HTMLImageElement).src = Number.isFinite(
                          idNum
                        )
                          ? toSerebiiImg(idNum)
                          : "https://via.placeholder.com/64?text=?";
                      }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-sky-700">
                    {pokemon.name}
                  </span>
                </div>

                {nextToShow.map((next) => (
                  <div key={next.num} className="flex items-center gap-4">
                    <ArrowRight size={16} className="text-slate-300" />
                    {renderEvoNode(next)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ------------------------
// App
// ------------------------
const App = () => {
  const [view, setView] = useState<
    "region" | "home" | "types" | "about" | "team"
  >("region");

  // Região selecionada (home)
  const [region, setRegion] = useState<RegionKey>("kanto");
  const [regionPokemon, setRegionPokemon] = useState<Pokemon[]>([]);
  const [filteredRegionPokemon, setFilteredRegionPokemon] = useState<Pokemon[]>(
    []
  );
  const [isLoadingRegion, setIsLoadingRegion] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pokédex completa (todas as regiões) — usada por Tipos e Time e também para evolução/lookup
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // Team (novo)
  const [team, setTeam] = useState<Pokemon[]>([]);

  // Modal
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Evolução (cache)
  const [evoCache, setEvoCache] = useState<EvoCache>({});

  const regionLabel = useMemo(() => {
    const r = REGIONS.find((x) => x.key === region);
    return r ? r.label : "Região";
  }, [region]);

  // Load: região (home)
  const loadRegion = async (rKey: RegionKey) => {
    const r = REGIONS.find((x) => x.key === rKey)!;

    setRegion(rKey);
    setSearchTerm("");
    setSelectedPokemon(null);
    setIsLoadingRegion(true);

    try {
      const list = await getRegionPokemons(rKey, r.from, r.to);
      setRegionPokemon(list);
      setFilteredRegionPokemon(list);
    } finally {
      setIsLoadingRegion(false);
    }
  };

  // Load: todas as regiões (para Tipos, Time e evolução universal)
  const loadAllRegions = async () => {
    if (isLoadingAll) return;
    setIsLoadingAll(true);

    try {
      const results = await Promise.all(
        REGIONS.map(async (r) => {
          try {
            return await getRegionPokemons(r.key, r.from, r.to);
          } catch {
            return [] as Pokemon[];
          }
        })
      );

      const merged = results.flat();

      const map = new Map<number, Pokemon>();
      for (const p of merged) map.set(p.id, p);

      const list = Array.from(map.values()).sort((a, b) => a.id - b.id);
      setAllPokemon(list);
    } finally {
      setIsLoadingAll(false);
    }
  };

  // Ao entrar em Tipos, garante pokédex completa
  useEffect(() => {
    if (view === "types" && allPokemon.length === 0) {
      void loadAllRegions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Filtro (home)
  useEffect(() => {
    let result = regionPokemon;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(lower) || p.num.includes(lower)
      );
    }
    setFilteredRegionPokemon(result);
  }, [searchTerm, regionPokemon]);

  // Evolução via PokeAPI (para qualquer geração)
  const fetchEvolutionForPokemon = async (p: Pokemon) => {
    const hasLocalEvo = Boolean(
      (p as any).prev_evolution?.length || (p as any).next_evolution?.length
    );
    if (hasLocalEvo) return;

    if (evoCache[p.id]) return;

    try {
      // AQUI está a API citada: PokeAPI (species) + evolution_chain
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${p.id}`
      );
      if (!speciesRes.ok) return;
      const species = await speciesRes.json();

      const evoUrl: string | undefined = species?.evolution_chain?.url;
      if (!evoUrl) return;

      const evoRes = await fetch(evoUrl);
      if (!evoRes.ok) return;
      const evoData = await evoRes.json();

      const root = evoData?.chain;
      if (!root) return;

      const nodeMap = new Map<number, { prev: EvoRef[]; next: EvoRef[] }>();
      const childrenMap = new Map<number, number[]>();

      const build = (node: any, ancestors: EvoRef[]) => {
        const s = node?.species;
        const id = extractIdFromUrl(s?.url);
        const name = typeof s?.name === "string" ? formatName(s.name) : "";

        if (!id) return;

        const children = (node?.evolves_to || [])
          .map((child: any) => extractIdFromUrl(child?.species?.url))
          .filter((x: any) => typeof x === "number") as number[];

        childrenMap.set(id, children);

        const nextRefs: EvoRef[] = (node?.evolves_to || [])
          .map((child: any) => {
            const cid = extractIdFromUrl(child?.species?.url);
            const cname =
              typeof child?.species?.name === "string"
                ? formatName(child.species.name)
                : "";
            return cid ? { num: pad3(cid), name: cname || `#${pad3(cid)}` } : null;
          })
          .filter(Boolean) as EvoRef[];

        nodeMap.set(id, { prev: ancestors, next: nextRefs });

        const newAncestors = [...ancestors, { num: pad3(id), name }];

        for (const child of node?.evolves_to || []) {
          build(child, newAncestors);
        }
      };

      build(root, []);

      const buildNextChain = (startId: number): EvoRef[] => {
        const chain: EvoRef[] = [];
        let cur = startId;

        const seen = new Set<number>();
        seen.add(cur);

        while (true) {
          const kids = childrenMap.get(cur) || [];
          if (kids.length !== 1) break;

          const nxt = kids[0];
          if (!nxt || seen.has(nxt)) break;
          seen.add(nxt);

          const nxtNameGuess = (() => {
            const curEntry = nodeMap.get(cur);
            const fromCur = curEntry?.next?.find((x) => Number(x.num) === nxt);
            if (fromCur?.name) return fromCur.name;
            return `#${pad3(nxt)}`;
          })();

          chain.push({ num: pad3(nxt), name: nxtNameGuess });
          cur = nxt;
        }

        return chain;
      };

      const entry = nodeMap.get(p.id);
      if (!entry) return;

      const nextChain = buildNextChain(p.id);

      setEvoCache((prev) => ({
        ...prev,
        [p.id]: {
          prev: entry.prev,
          next: entry.next,
          nextChain,
        },
      }));
    } catch {
      // silencioso
    }
  };

  useEffect(() => {
    if (!selectedPokemon) return;
    void fetchEvolutionForPokemon(selectedPokemon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPokemon?.id]);

  // Lookups
  const lookupByNum = (num: string): Pokemon | null => {
    const fromAll = allPokemon.find((p) => p.num === num);
    if (fromAll) return fromAll;

    const fromRegion = regionPokemon.find((p) => p.num === num);
    if (fromRegion) return fromRegion;

    return null;
  };

  const evolutionFor = (
    p: Pokemon
  ): { prev: EvoRef[]; next: EvoRef[]; nextChain: EvoRef[] } | null => {
    const prevLocal = (p as any).prev_evolution as EvoRef[] | undefined;
    const nextLocal = (p as any).next_evolution as EvoRef[] | undefined;

    if ((prevLocal && prevLocal.length) || (nextLocal && nextLocal.length)) {
      const next = nextLocal || [];
      return {
        prev: prevLocal || [],
        next,
        nextChain: next,
      };
    }

    const cached = evoCache[p.id];
    if (!cached) return null;
    return cached;
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col bg-gradient-to-br from-sky-50 via-white to-fuchsia-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-fuchsia-200/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl" />
      </div>

      <Header setView={setView} currentView={view} />

      {view === "region" && (
        <RegionSelect
          onCreateTeam={async () => {
            setSelectedPokemon(null);
            setView("team");
            if (allPokemon.length === 0) await loadAllRegions();
          }}
          onSelect={async (r) => {
            setView("home");
            await loadRegion(r);
          }}
        />
      )}

      {view === "team" && (
        <TeamBuilder
          allPokemon={allPokemon}
          isLoadingAll={isLoadingAll}
          ensureAllLoaded={() => void loadAllRegions()}
          team={team}
          setTeam={setTeam}
        />
      )}

      {view === "home" && (
        <Home
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredPokemon={filteredRegionPokemon}
          onPokemonClick={setSelectedPokemon}
          regionLabel={regionLabel}
          isLoading={isLoadingRegion}
        />
      )}

      {view === "types" && (
        <TypesPage
          allPokemon={allPokemon}
          isLoadingAll={isLoadingAll}
          onPokemonClick={setSelectedPokemon}
        />
      )}

      {view === "about" && <AboutPage />}

      <Footer />

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        onSelect={setSelectedPokemon}
        lookupByNum={lookupByNum}
        evolutionFor={evolutionFor}
      />
    </div>
  );
};

export default App;
