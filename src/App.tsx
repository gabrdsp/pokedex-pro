import { useEffect, useMemo, useRef, useState } from "react";
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
  Download,
} from "lucide-react";

import html2canvas from "html2canvas";

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

// Placeholder (pokeball PNG)
const POKEBALL_PLACEHOLDER =
  "https://www.kindpng.com/picc/m/604-6046492_pokeball-png-free-download-circle-transparent-png.png";

// ------------------------
// Tipos: descrição
// ------------------------
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
    "from-red-400 via-yellow-400 to-blue-400 hover:from-red-500 hover:via-yellow-500 hover:to-blue-500",
  johto:
    "from-amber-400 via-slate-300 to-zinc-400 hover:from-amber-500 hover:via-slate-400 hover:to-zinc-500",
  hoenn:
    "from-blue-400 via-green-300 to-rose-500 hover:from-blue-500 hover:via-green-300 hover:to-rose-600",
  sinnoh:
    "from-sky-400 via-indigo-300 to-pink-400 hover:from-sky-500 hover:via-indigo-400 hover:to-pink-500",
  unova:
    "from-zinc-900 via-zinc-600 to-zinc-300 hover:from-black hover:via-zinc-700 hover:to-zinc-400",
  kalos:
    "from-blue-500 via-slate-300 to-red-500 hover:from-blue-600 hover:via-slate-400 hover:to-red-600",
  alola:
    "from-orange-400 via-amber-300 to-purple-400 hover:from-orange-500 hover:via-amber-400 hover:to-purple-500",
  galar:
    "from-sky-400 via-cyan-300 to-pink-400 hover:from-sky-500 hover:via-cyan-400 hover:to-pink-500",
  paldea:
    "from-red-500 via-fuchsia-400 to-violet-500 hover:from-red-600 hover:via-fuchsia-500 hover:to-violet-600",
};

// Gradiente sutil para “faixa” do header (easter egg)
const REGION_HEADER_STRIP: Record<RegionKey, string> = {
  kanto: "from-red-400 via-yellow-400 to-blue-400",
  johto: "from-amber-400 via-slate-300 to-zinc-400",
  hoenn: "from-blue-400 via-green-300 to-rose-500",
  sinnoh: "from-sky-400 via-indigo-300 to-pink-400",
  unova: "from-zinc-900 via-zinc-600 to-zinc-300",
  kalos: "from-blue-500 via-slate-300 to-red-500",
  alola: "from-orange-400 via-amber-300 to-purple-400",
  galar: "from-sky-400 via-cyan-300 to-pink-400",
  paldea: "from-red-500 via-fuchsia-400 to-violet-500",
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

const SkeletonPokemonCard = () => (
  <div
    className={[
      "relative overflow-hidden h-full",
      "rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl",
      "shadow-[0_12px_30px_rgba(15,23,42,0.06)]",
      "p-6 flex flex-col items-center justify-between",
      "animate-pulse",
    ].join(" ")}
  >
    <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-slate-200/40 blur-2xl opacity-60" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/25" />

    <div className="relative z-10 self-end w-14 h-4 rounded bg-slate-200/60" />

    <div className="relative z-10 w-32 h-32 my-4 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
      <img
        src={POKEBALL_PLACEHOLDER}
        alt="Placeholder"
        className="w-14 h-14 opacity-60"
      />
    </div>

    <div className="relative z-10 w-full flex flex-col items-center gap-3">
      <div className="w-28 h-5 rounded bg-slate-200/60" />
      <div className="flex gap-2">
        <div className="w-10 h-10 rounded-full bg-slate-200/60" />
        <div className="w-10 h-10 rounded-full bg-slate-200/60" />
      </div>
    </div>
  </div>
);

const Header = ({
  setView,
  currentView,
  regionKeyForEasterEgg,
}: {
  setView: (v: "region" | "home" | "types" | "about" | "team") => void;
  currentView: "region" | "home" | "types" | "about" | "team";
  regionKeyForEasterEgg?: RegionKey;
}) => (
  <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
    {/* Easter egg sutil: faixa gradiente muda conforme a região (somente quando informado) */}
    {regionKeyForEasterEgg && (
      <div
        className={[
          "h-[3px] w-full bg-gradient-to-r opacity-70",
          REGION_HEADER_STRIP[regionKeyForEasterEgg],
        ].join(" ")}
      />
    )}

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
// Easter egg background por geração (sutil, sem poluir)
// ------------------------
const RegionEasterEgg = ({ regionKey }: { regionKey: RegionKey }) => {
  const egg = useMemo(() => {
    switch (regionKey) {
      case "kanto":
        return {
          a: "bg-red-200/25",
          b: "bg-yellow-200/20",
          c: "bg-blue-200/20",
          d: "bg-emerald-200/18",
        };
      case "johto":
        return {
          a: "bg-amber-200/22",
          b: "bg-slate-200/18",
          c: "bg-zinc-200/16",
          d: "bg-amber-100/16",
        };
      case "hoenn":
        return {
          a: "bg-blue-200/22",
          b: "bg-emerald-200/18",
          c: "bg-rose-200/18",
          d: "bg-sky-200/16",
        };
      case "sinnoh":
        return {
          a: "bg-sky-200/22",
          b: "bg-indigo-200/18",
          c: "bg-pink-200/18",
          d: "bg-violet-200/16",
        };
      case "unova":
        return {
          a: "bg-zinc-300/18",
          b: "bg-zinc-200/14",
          c: "bg-zinc-400/12",
          d: "bg-zinc-100/12",
        };
      case "kalos":
        return {
          a: "bg-blue-200/22",
          b: "bg-red-200/18",
          c: "bg-slate-200/16",
          d: "bg-indigo-200/14",
        };
      case "alola":
        return {
          a: "bg-orange-200/22",
          b: "bg-amber-200/18",
          c: "bg-purple-200/18",
          d: "bg-pink-200/12",
        };
      case "galar":
        return {
          a: "bg-sky-200/22",
          b: "bg-cyan-200/18",
          c: "bg-pink-200/18",
          d: "bg-indigo-200/12",
        };
      case "paldea":
        return {
          a: "bg-red-200/18",
          b: "bg-fuchsia-200/18",
          c: "bg-violet-200/16",
          d: "bg-amber-200/12",
        };
      default:
        return {
          a: "bg-cyan-200/20",
          b: "bg-fuchsia-200/18",
          c: "bg-amber-200/16",
          d: "bg-sky-200/12",
        };
    }
  }, [regionKey]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* blobs principais (já existiam) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-fuchsia-200/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl" />

      {/* partículas/bolhas sutis por região */}
      <div className={["absolute top-24 left-[12%] w-20 h-20 rounded-full blur-2xl", egg.a].join(" ")} />
      <div className={["absolute top-[28%] right-[14%] w-16 h-16 rounded-full blur-2xl", egg.b].join(" ")} />
      <div className={["absolute bottom-[18%] left-[22%] w-24 h-24 rounded-full blur-3xl", egg.c].join(" ")} />
      <div className={["absolute bottom-[10%] right-[26%] w-14 h-14 rounded-full blur-2xl", egg.d].join(" ")} />
    </div>
  );
};

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
        {isLoading ? "Carregando Pokémons..." : `${filteredPokemon.length} Pokémon`}
      </span>
    </div>

    {/* Skeleton grid (substitui “Carregando…”) */}
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <SkeletonPokemonCard key={i} />
        ))}
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

    // NOVO: estatísticas + download do card
  const [showStats, setShowStats] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const teamCardRef = useRef<HTMLDivElement | null>(null);

    const teamStats = useMemo(() => {
    const typeCount = new Map<string, number>();
    const weaknessCount = new Map<string, number>();

    for (const p of team) {
      for (const t of p.type || []) {
        typeCount.set(t, (typeCount.get(t) || 0) + 1);
      }
      for (const w of p.weaknesses || []) {
        weaknessCount.set(w, (weaknessCount.get(w) || 0) + 1);
      }
    }

    const typesSorted = Array.from(typeCount.entries()).sort((a, b) => b[1] - a[1]);
    const weaknessesSorted = Array.from(weaknessCount.entries()).sort((a, b) => b[1] - a[1]);

    const teamTypesSet = new Set(typeCount.keys());

    // Heurísticas simples de “como reduzir fraqueza”
    // (não é um type-chart completo, mas cobre os casos mais intuitivos)
    const WEAKNESS_FIX: Record<
      string,
      { add: string[]; note: string }
    > = {
      Electric: {
        add: ["Ground"],
        note: "Ground é imune a golpes Elétricos.",
      },
      Ground: {
        add: ["Water", "Grass", "Ice"],
        note: "Esses tipos costumam responder bem a golpes Terrestres.",
      },
      Rock: {
        add: ["Water", "Grass", "Fighting", "Ground", "Steel"],
        note: "Esses tipos ajudam a lidar com adversários do tipo Pedra.",
      },
      Fire: {
        add: ["Water", "Ground", "Rock"],
        note: "Boa resposta contra equipes focadas em Fogo.",
      },
      Water: {
        add: ["Electric", "Grass"],
        note: "Cobertura clássica contra Água.",
      },
      Grass: {
        add: ["Fire", "Ice", "Flying", "Bug", "Poison"],
        note: "Boas opções para enfrentar Grama.",
      },
      Ice: {
        add: ["Fire", "Fighting", "Rock", "Steel"],
        note: "Tipos fortes contra Gelo.",
      },
      Fighting: {
        add: ["Flying", "Psychic", "Fairy"],
        note: "Cobertura típica contra Lutador.",
      },
      Psychic: {
        add: ["Bug", "Ghost", "Dark"],
        note: "Esses tipos ajudam a enfrentar Psíquico.",
      },
      Dark: {
        add: ["Fighting", "Bug", "Fairy"],
        note: "Boa resposta contra Sombrio.",
      },
      Dragon: {
        add: ["Ice", "Fairy", "Dragon"],
        note: "Respostas tradicionais contra Dragão.",
      },
      Fairy: {
        add: ["Steel", "Poison"],
        note: "Tipos fortes contra Fada.",
      },
      Ghost: {
        add: ["Dark", "Ghost"],
        note: "Boa resposta contra Fantasma.",
      },
      Bug: {
        add: ["Fire", "Flying", "Rock"],
        note: "Cobertura comum contra Inseto.",
      },
      Poison: {
        add: ["Ground", "Psychic"],
        note: "Boa resposta contra Veneno.",
      },
      Steel: {
        add: ["Fire", "Fighting", "Ground"],
        note: "Cobertura comum contra Metal.",
      },
      Flying: {
        add: ["Electric", "Ice", "Rock"],
        note: "Cobertura comum contra Voador.",
      },
      Normal: {
        add: ["Fighting"],
        note: "Resposta clássica contra Normal.",
      },
    };

    // Sugestões com JSX (ícones)
    const suggestions: JSX.Element[] = [];

    const pushTip = (key: string, el: JSX.Element) => {
      // evita duplicações grosseiras
      if (!suggestions.some((x) => (x.key as any) === key)) suggestions.push(el);
    };

    if (team.length === 0) {
      pushTip(
        "empty",
        <span key="empty">Monte um time (até 6) para receber sugestões mais precisas.</span>
      );
      return { typesSorted, weaknessesSorted, suggestions };
    }

    if (team.length < 6) {
      pushTip(
        "fill6",
        <span key="fill6">
          Considere completar o time com <strong>6 Pokémon</strong> para melhorar a cobertura.
        </span>
      );
    }

    // Pouca diversidade de tipos
    if (teamTypesSet.size <= 3) {
      pushTip(
        "lowdiv",
        <span key="lowdiv">
          Seu time tem pouca diversidade de tipos. Variar os elementos ajuda a reduzir fraquezas repetidas.
        </span>
      );
    }

    // Repetição alta do mesmo tipo
    const repeated = typesSorted.filter(([, c]) => c >= 3).map(([t]) => t);
    if (repeated.length > 0) {
      pushTip(
        "repeated",
        <span key="repeated" className="inline-flex items-center gap-2 flex-wrap">
          Muitos Pokémon compartilham:
          {repeated.map((t) => (
            <span key={t} className="inline-flex items-center gap-1">
              <TypeBadge type={t} size="sm" />
            </span>
          ))}
          Isso pode aumentar fraquezas duplicadas.
        </span>
      );
    }

    // Dicas baseadas nas fraquezas mais recorrentes
    const topWeak = weaknessesSorted.slice(0, 5); // pega até 5 fraquezas
    for (const [weakType, count] of topWeak) {
      const fix = WEAKNESS_FIX[weakType];
      if (!fix) continue;

      // sugere apenas tipos que ainda NÃO existem no time
      const candidates = fix.add.filter((t) => !teamTypesSet.has(t));
      if (candidates.length === 0) continue;

      const key = `fix-${weakType}`;
      pushTip(
        key,
        <span key={key} className="inline-flex items-center gap-2 flex-wrap">
          Sua fraqueza mais recorrente inclui:
          <span className="inline-flex items-center gap-1">
            <TypeBadge type={weakType} size="sm" />
            <span className="text-xs font-extrabold text-slate-600">x{count}</span>
          </span>
          • Considerar adicionar:
          <span className="inline-flex items-center gap-1 flex-wrap">
            {candidates.slice(0, 3).map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </span>
          <span className="text-slate-500">({fix.note})</span>
        </span>
      );
    }

    return {
      typesSorted,
      weaknessesSorted,
      suggestions,
    };
  }, [team]);

  const downloadTeamCard = async () => {
    if (!teamCardRef.current || team.length === 0) return;

    setIsDownloadingCard(true);
    try {
      const canvas = await html2canvas(teamCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `pokedexpro-time.png`;
      a.click();
    } finally {
      setIsDownloadingCard(false);
    }
  };

  // NOVO: filtros
  const [regionFilter, setRegionFilter] = useState<RegionKey | "all">("all");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [typesOpen, setTypesOpen] = useState(false);
  const typesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (allPokemon.length === 0) ensureAllLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fecha popover ao clicar fora
  useEffect(() => {
    if (!typesOpen) return;

    const onDown = (e: MouseEvent) => {
      if (!typesRef.current) return;
      if (!typesRef.current.contains(e.target as Node)) setTypesOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [typesOpen]);

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

  const regionMap = useMemo(() => {
    const m = new Map<RegionKey, (typeof REGIONS)[number]>();
    REGIONS.forEach((r) => m.set(r.key, r));
    return m;
  }, []);

  // NOVO: tipos disponíveis (para o filtro)
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    allPokemon.forEach((p) => p.type.forEach((t) => types.add(t)));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [allPokemon]);

  const toggleType = (t: string) => {
    setTypeFilters((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const clearFilters = () => {
    setRegionFilter("all");
    setTypeFilters([]);
  };

  const filteredAll = useMemo(() => {
    let list = allPokemon;

    // filtro por geração
    if (regionFilter !== "all") {
      const r = regionMap.get(regionFilter);
      if (r) list = list.filter((p) => p.id >= r.from && p.id <= r.to);
    }

    // filtro por tipos (OR: qualquer tipo selecionado)
    if (typeFilters.length > 0) {
      list = list.filter((p) => p.type.some((t) => typeFilters.includes(t)));
    }

    // busca
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.num.includes(lower) ||
          String(p.id).includes(lower)
      );
    }

    return list;
  }, [allPokemon, searchTerm, regionFilter, typeFilters, regionMap]);

  // regiões a exibir (se filtrou por geração, mostra só a seção daquela)
  const regionsToShow = useMemo(() => {
    if (regionFilter === "all") return REGIONS;
    const r = regionMap.get(regionFilter);
    return r ? [r] : REGIONS;
  }, [regionFilter, regionMap]);

  const byRegion = useMemo(() => {
    return regionsToShow.map((r) => {
      const list = filteredAll.filter((p) => p.id >= r.from && p.id <= r.to);
      return { region: r, list };
    });
  }, [filteredAll, regionsToShow]);

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
            Pokémon {index + 1}
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

  // NOVO: dock de busca + filtros (mesma estética do FilterDock)
  const TeamFilterDock = () => (
    <div className="sticky top-20 z-40 flex justify-center w-full px-4 mb-10">
      <div className="w-full max-w-4xl rounded-full p-1 bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
        <div className="flex items-center gap-2 w-full">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar Pokémon (nome ou número)..."
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

          {/* Geração (select) */}
          <div className="hidden sm:block">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as RegionKey | "all")}
              className={[
                "rounded-full px-4 py-2 text-sm font-extrabold",
                "bg-slate-50 text-slate-700",
                "border border-transparent focus:border-sky-200 focus:bg-white",
                "focus:outline-none focus:ring-2 focus:ring-sky-200/60 transition",
                "cursor-pointer",
              ].join(" ")}
              aria-label="Filtrar por geração"
              title="Filtrar por geração"
            >
              <option value="all">Todas</option>
              {REGIONS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipos (ícones) */}
          <div ref={typesRef} className="relative">
            <button
              onClick={() => setTypesOpen((v) => !v)}
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-2",
                "bg-slate-50 text-slate-700",
                "border border-transparent hover:bg-white",
                "focus:outline-none focus:ring-2 focus:ring-sky-200/60 transition",
              ].join(" ")}
              aria-label="Filtrar por tipos"
              title="Filtrar por tipos"
            >
              {/* ícone “pilha” simples: usa TypeBadge pequeno se já houver seleção */}
              {typeFilters.length === 0 ? (
                <span className="text-xs font-extrabold px-2">Tipos</span>
              ) : (
                <div className="flex items-center gap-1">
                  {typeFilters.slice(0, 2).map((t) => (
                    <div
                      key={t}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center"
                      title={t}
                    >
                      <TypeBadge type={t} size="sm" />
                    </div>
                  ))}
                  {typeFilters.length > 2 && (
                    <span className="text-xs font-black text-slate-500 ml-1">
                      +{typeFilters.length - 2}
                    </span>
                  )}
                </div>
              )}
            </button>

            {typesOpen && (
              <div
                className={[
                  "absolute right-0 mt-2 w-[320px] sm:w-[360px]",
                  "rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl",
                  "shadow-[0_18px_55px_rgba(15,23,42,0.16)]",
                  "p-4",
                ].join(" ")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-extrabold text-slate-800">
                    Filtrar por tipos
                  </div>
                  <button
                    onClick={() => setTypeFilters([])}
                    disabled={typeFilters.length === 0}
                    className={[
                      "text-xs font-extrabold px-3 py-1.5 rounded-full",
                      "bg-white/80 border border-white/60 shadow-sm",
                      "text-slate-700 hover:bg-white transition",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "focus:outline-none focus:ring-2 focus:ring-sky-200/60",
                    ].join(" ")}
                  >
                    Limpar
                  </button>
                </div>

                <div className="grid grid-cols-9 gap-2">
                  {allTypes.map((t) => {
                    const selected = typeFilters.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={[
                          "w-9 h-9 rounded-full flex items-center justify-center",
                          "bg-white/75 border border-white/60 shadow-sm",
                          "hover:bg-white transition",
                          selected ? "ring-2 ring-sky-200/80" : "",
                          "focus:outline-none focus:ring-2 focus:ring-sky-200/60",
                        ].join(" ")}
                        title={t}
                        aria-label={`Tipo ${t}`}
                      >
                        <TypeBadge type={t} size="sm" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 text-xs font-semibold text-slate-500">
                  {typeFilters.length === 0
                    ? "Nenhum tipo selecionado."
                    : `${typeFilters.length} tipo(s) selecionado(s).`}
                </div>
              </div>
            )}
          </div>

          {/* Limpar filtros (compacto) */}
          <button
            onClick={clearFilters}
            disabled={regionFilter === "all" && typeFilters.length === 0 && !searchTerm}
            className={[
              "hidden sm:inline-flex items-center justify-center",
              "w-10 h-10 rounded-full",
              "bg-white/80 border border-white/60 shadow-sm",
              "text-slate-600 hover:text-rose-600 hover:bg-white transition",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-sky-200/60",
            ].join(" ")}
            title="Limpar busca e filtros"
            aria-label="Limpar busca e filtros"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-14 pb-24">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 border border-white/60 shadow-sm">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-extrabold text-slate-700">
            Forme seu time
          </span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mt-6 mb-3">
          Eu <span className="text-sky-600">escolho</span> você!
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Escolha até 6 Pokémon de qualquer geração.
        </p>
      </div>

            {/* Toolbar fora do card do time */}
      <div className="max-w-5xl mx-auto mt-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-left">
          <div className="text-sm font-extrabold text-slate-800">Seu time</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            {team.length}/6 selecionados
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStats((v) => !v)}
            className={[
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-white/80 border border-white/60 shadow-sm",
              "text-sm font-extrabold text-slate-700",
              "hover:bg-white transition",
              "focus:outline-none focus:ring-4 focus:ring-sky-200/60",
            ].join(" ")}
          >
            <Info size={16} />
            Estatísticas
          </button>

          <button
            onClick={downloadTeamCard}
            disabled={team.length === 0 || isDownloadingCard}
            className={[
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-white/80 border border-white/60 shadow-sm",
              "text-sm font-extrabold text-slate-700",
              "hover:bg-white transition",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-4 focus:ring-sky-200/60",
            ].join(" ")}
          >
            <Download size={16} />
            {isDownloadingCard ? "Gerando..." : "Baixar card"}
          </button>

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
      </div>

      {/* Card do time (capturado pelo html2canvas) */}
      <div className="max-w-5xl mx-auto mt-4">
        <div
          ref={teamCardRef}
          className="rounded-[2rem] border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_18px_55px_rgba(15,23,42,0.10)] p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <TeamSlot key={i} index={i} />
            ))}
          </div>
        </div>

        {/* Estatísticas (só aparece ao clicar) */}
        {showStats && (
          <div className="mt-4 rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-left">
                <div className="text-sm font-extrabold text-slate-900">
                  Feedback do time
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  Dicas rápidas baseadas nos tipos e fraquezas do seu time.
                </div>
              </div>

              <button
                onClick={() => setShowStats(false)}
                className={[
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-white/80 border border-white/60 shadow-sm",
                  "text-sm font-extrabold text-slate-700",
                  "hover:bg-white transition",
                  "focus:outline-none focus:ring-4 focus:ring-sky-200/60",
                ].join(" ")}
              >
                <X size={16} />
                Fechar
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                  Tipos no time
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {teamStats.typesSorted.length === 0 ? (
                    <div className="text-sm font-semibold text-slate-500">
                      Nenhum Pokémon selecionado.
                    </div>
                  ) : (
                    teamStats.typesSorted.map(([t, c]) => (
                      <div
                        key={t}
                        className="inline-flex items-center gap-2 bg-white rounded-full border border-slate-100 px-3 py-1.5 shadow-sm"
                        title={`${t}: ${c}`}
                      >
                        <TypeBadge type={t} size="sm" />
                        <span className="text-xs font-extrabold text-slate-700">
                          x{c}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                  Dicas
                </div>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700 list-disc pl-5">
                  {teamStats.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                {teamStats.weaknessesSorted.length > 0 && (
                  <div className="mt-4 text-xs font-semibold text-slate-500">
                    Fraquezas mais frequentes:{" "}
                    <span className="font-extrabold text-slate-700">
                      {teamStats.weaknessesSorted
                        .slice(0, 5)
                        .map(([w, c]) => `${w} (${c})`)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        {/* SUBSTITUI o FilterDock aqui */}
        <TeamFilterDock />

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
                      Ajuste sua busca ou filtros.
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

  // Team
  const [team, setTeam] = useState<Pokemon[]>([]);

  // Modal
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Evolução (cache)
  const [evoCache, setEvoCache] = useState<EvoCache>({});

  const regionLabel = useMemo(() => {
    const r = REGIONS.find((x) => x.key === region);
    return r ? r.label : "Região";
  }, [region]);

  // ------------------------
  // Load: região (home)
  // ------------------------
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

  // ------------------------
  // Load: todas as regiões (para Tipos, Time e evolução universal)
  // ------------------------
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

  // ------------------------
  // Filtro (home)
  // ------------------------
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

  // ------------------------
  // Evolução via PokeAPI (para qualquer geração)
  // API citada: https://pokeapi.co (pokemon-species + evolution_chain)
  // ------------------------
  const fetchEvolutionForPokemon = async (p: Pokemon) => {
    const hasLocalEvo = Boolean(
      (p as any).prev_evolution?.length || (p as any).next_evolution?.length
    );
    if (hasLocalEvo) return;

    if (evoCache[p.id]) return;

    try {
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

  // ------------------------
  // Lookups
  // ------------------------
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

  // Header strip: só mostra quando estiver na Home (muda conforme região)
  const headerRegionStrip = view === "home" ? region : undefined;

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col bg-gradient-to-br from-sky-50 via-white to-fuchsia-50">
      {/* Easter egg: fundo sutil muda com a região quando em Home; no resto mantém neutro */}
      {view === "home" ? (
        <RegionEasterEgg regionKey={region} />
      ) : (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-200/30 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-fuchsia-200/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl" />
        </div>
      )}

      <Header
        setView={setView}
        currentView={view}
        regionKeyForEasterEgg={headerRegionStrip}
      />

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
