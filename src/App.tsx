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
// Types: icons
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
// i18n
// ------------------------
type Lang = "pt" | "en";

const I18N = {
  pt: {
    nav: {
      start: "Início",
      types: "Tipos",
      about: "Sobre",
    },
    common: {
      back: "Voltar",
      close: "Fechar",
      loading: "Carregando…",
      loadingPokemon: "Carregando Pokémons...",
      openPokedex: "Abrir Pokédex",
      notFound: "Nenhuma correspondência encontrada",
      placeholderUnknown: "?",
      fansNotice: "Este é um projeto realizado por fãs sem fins lucrativos.",
      copyright: "© 2025 PokédexPro.",
    },
    regionSelect: {
      title: "Escolha uma região.",
      subtitle: "Selecione uma geração para abrir a Pokédex correspondente.",
      createTeam: "Crie seu time",
    },
    home: {
      titlePrefix: "escolha seu",
      titleHighlight: "companheiro",
      subtitle: "Explore a Pokédex da geração selecionada.",
      searchPlaceholder: "Buscar Pokémon...",
      countLoading: "Carregando Pokémons...",
      count: (n: number) => `${n} Pokémon`,
    },
    team: {
      badge: "Forme seu time",
      title: "Eu escolho você!",
      subtitle: "Escolha até 6 Pokémon de qualquer geração.",
      yourTeam: "Seu time",
      selectedCount: (n: number) => `${n}/6 selecionados`,
      stats: "Estatísticas",
      downloadCard: "Baixar card",
      generating: "Gerando...",
      clearTeam: "Limpar time",
      close: "Fechar",
      tipsTitle: "Feedback do time",
      tipsSubtitle:
        "Dicas rápidas baseadas nos tipos e fraquezas do seu time.",
      teamTypes: "Tipos no time",
      tips: "Dicas",
      topWeaknesses: "Fraquezas mais frequentes",
      emptySlot: (i: number) => `Pokémon ${i}`,
      filterSearchPlaceholder: "Buscar Pokémon (nome ou número)...",
      filterAll: "Todas",
      filterTypes: "Tipos",
      filterTypesTitle: "Filtrar por tipos",
      clear: "Limpar",
      noTypesSelected: "Nenhum tipo selecionado.",
      typesSelected: (n: number) => `${n} tipo(s) selecionado(s).`,
      clearAllFilters: "Limpar busca e filtros",
      loadingAllTitle: "Carregando lista completa…",
      loadingAllSubtitle:
        "Isso pode levar alguns segundos no primeiro carregamento.",
      availableCount: (n: number) => `${n} Pokémon disponíveis`,
      regionNoneFound: "Nenhum Pokémon encontrado nesta geração",
      adjustFilters: "Ajuste sua busca ou filtros.",
      selected: "Selecionado",
      select: "Selecionar",
      remove: "Remover",
      removeFromTeam: (name: string) => `Remover ${name} do time`,
    },
    types: {
      title: "Tipos",
      subtitle:
        "Selecione um elemento para ver todos os Pokémon desse tipo (todas as regiões).",
      searchPlaceholder: "Buscar tipo...",
      backToTypes: "Voltar aos Tipos",
      typeOf: (typeLabel: string) => `Pokémon do tipo ${typeLabel}`,
      found: (n: number) => `${n} Pokémon encontrados.`,
      infoDefault: "Tipo elemental do universo Pokémon.",
    },
    about: {
      title: "Sobre o Projeto",
      body1:
        "PokédexPro é um projeto desenvolvido para um trabalho acadêmico da disciplina de Banco de Dados pela UFERSA.",
      body2: "Desenvolvido com React, Tailwind CSS e muita dedicação.",
    },
    modal: {
      species: "Espécie de Pokémon",
      height: "Altura",
      weight: "Peso",
      weaknesses: "Fraquezas",
      evolution: "Cadeia de Evolução",
    },
  },
  en: {
    nav: {
      start: "Home",
      types: "Types",
      about: "About",
    },
    common: {
      back: "Back",
      close: "Close",
      loading: "Loading…",
      loadingPokemon: "Loading Pokémon...",
      openPokedex: "Open Pokédex",
      notFound: "No matches found",
      placeholderUnknown: "?",
      fansNotice: "This is a non-profit fan project.",
      copyright: "© 2025 PokédexPro.",
    },
    regionSelect: {
      title: "Choose a region.",
      subtitle: "Select a generation to open the corresponding Pokédex.",
      createTeam: "Build your team",
    },
    home: {
      titlePrefix: "choose your",
      titleHighlight: "partner",
      subtitle: "Explore the Pokédex for the selected generation.",
      searchPlaceholder: "Search Pokémon...",
      countLoading: "Loading Pokémon...",
      count: (n: number) => `${n} Pokémon`,
    },
    team: {
      badge: "Build your team",
      title: "I choose you!",
      subtitle: "Pick up to 6 Pokémon from any generation.",
      yourTeam: "Your team",
      selectedCount: (n: number) => `${n}/6 selected`,
      stats: "Stats",
      downloadCard: "Download card",
      generating: "Generating...",
      clearTeam: "Clear team",
      close: "Close",
      tipsTitle: "Team feedback",
      tipsSubtitle:
        "Quick tips based on your team types and repeated weaknesses.",
      teamTypes: "Team types",
      tips: "Tips",
      topWeaknesses: "Most common weaknesses",
      emptySlot: (i: number) => `Pokémon ${i}`,
      filterSearchPlaceholder: "Search Pokémon (name or number)...",
      filterAll: "All",
      filterTypes: "Types",
      filterTypesTitle: "Filter by types",
      clear: "Clear",
      noTypesSelected: "No types selected.",
      typesSelected: (n: number) => `${n} type(s) selected.`,
      clearAllFilters: "Clear search and filters",
      loadingAllTitle: "Loading full list…",
      loadingAllSubtitle:
        "This can take a few seconds on the first load.",
      availableCount: (n: number) => `${n} Pokémon available`,
      regionNoneFound: "No Pokémon found in this generation",
      adjustFilters: "Adjust your search or filters.",
      selected: "Selected",
      select: "Select",
      remove: "Remove",
      removeFromTeam: (name: string) => `Remove ${name} from team`,
    },
    types: {
      title: "Types",
      subtitle:
        "Select an element to view all Pokémon of that type (all regions).",
      searchPlaceholder: "Search type...",
      backToTypes: "Back to Types",
      typeOf: (typeLabel: string) => `Pokémon of type ${typeLabel}`,
      found: (n: number) => `${n} Pokémon found.`,
      infoDefault: "An elemental Pokémon type.",
    },
    about: {
      title: "About the Project",
      body1:
        "PokédexPro is a project built for an academic assignment in Database Systems at UFERSA.",
      body2: "Built with React, Tailwind CSS, and a lot of dedication.",
    },
    modal: {
      species: "Pokémon Species",
      height: "Height",
      weight: "Weight",
      weaknesses: "Weaknesses",
      evolution: "Evolution Chain",
    },
  },
} as const;

const t = (lang: Lang, path: string): string => {
  const parts = path.split(".");
  let cur: any = I18N[lang];
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) cur = cur[p];
    else return path;
  }
  return typeof cur === "string" ? cur : path;
};

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
// Types: assets + names + descriptions (PT/EN)
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

const TYPE_TRANSLATIONS_PT: Record<string, string> = {
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

const TYPE_DESCRIPTIONS_PT: Record<string, string> = {
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

const TYPE_DESCRIPTIONS_EN: Record<string, string> = {
  Normal:
    "Normal-type Pokémon thrive across many environments—fields, forests, cities, and towns—making them among the most common and adaptable.",
  Fire:
    "Fire-type Pokémon are usually found in hot and open areas like deserts, grasslands, and volcanic mountains.",
  Water:
    "Water-type Pokémon inhabit diverse aquatic environments such as oceans, rivers, lakes, swamps, and reefs, adapting to different depths and currents.",
  Electric:
    "Electric-type Pokémon appear in many habitats, including cities, forests, and industrial areas, often drawn to sources of electricity.",
  Grass:
    "Grass-type Pokémon live in natural areas with dense vegetation—forests, gardens, jungles—and often blend into flora.",
  Ice:
    "Ice-type Pokémon live in extreme cold—icy peaks, glaciers, frozen caves, and polar regions—adapted to very low temperatures.",
  Fighting:
    "Fighting-type Pokémon are often seen in training-focused locations (cities, gyms), but also appear in forests, fields, and mountains.",
  Poison:
    "Poison-type Pokémon are commonly found in caves, swamps, and polluted areas.",
  Ground:
    "Ground-type Pokémon inhabit caves, mountains, deserts, and rocky or sandy terrain, often using the earth to hide or battle.",
  Flying:
    "Flying-type Pokémon are found in high places—the skies, mountains, and treetops—where they can perch and take off easily.",
  Psychic:
    "Psychic-type Pokémon appear in many habitats—from fields and forests to urban parks—often linked to calmer environments.",
  Bug:
    "Bug-type Pokémon usually live in forests and tall-grass areas with abundant vegetation.",
  Rock:
    "Rock-type Pokémon are found in rocky environments—mountains, caves, quarries—and places rich in minerals and fossils.",
  Ghost:
    "Ghost-type Pokémon inhabit dark, isolated, or eerie places such as abandoned towers, shadowy forests, and caves.",
  Dragon:
    "Dragon-type Pokémon are rare and powerful, often living in remote areas near water, mountains, caves, or hidden islands.",
  Dark:
    "Dark-type Pokémon tend to inhabit places that match their nature—quiet, shadowy, and secluded areas.",
  Steel:
    "Steel-type Pokémon are often found in industrial or urban settings, as well as rocky regions rich in metals.",
  Fairy:
    "Fairy-type Pokémon frequently live in natural, serene places—lush forests, flower fields, rivers, and mountains.",
};

const typeLabel = (lang: Lang, type: string) =>
  lang === "pt" ? TYPE_TRANSLATIONS_PT[type] || type : type;

const typeDescription = (lang: Lang, type: string) => {
  if (lang === "en") return TYPE_DESCRIPTIONS_EN[type] || TYPE_DESCRIPTIONS_PT[type];
  return TYPE_DESCRIPTIONS_PT[type] || TYPE_DESCRIPTIONS_EN[type];
};

// ------------------------
// Regions
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
  lang,
  setLang,
  setView,
  currentView,
  regionKeyForEasterEgg,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  setView: (v: "region" | "home" | "types" | "about" | "team") => void;
  currentView: "region" | "home" | "types" | "about" | "team";
  regionKeyForEasterEgg?: RegionKey;
}) => (
  <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
    {regionKeyForEasterEgg && (
      <div
        className={[
          "h-[3px] w-full bg-gradient-to-r opacity-70",
          REGION_HEADER_STRIP[regionKeyForEasterEgg],
        ].join(" ")}
      />
    )}

    <div className="container mx-auto px-6 h-16 flex items-center">
      <div className="flex-1" />
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
          {t(lang, "nav.start")}
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
          {t(lang, "nav.types")}
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
          {t(lang, "nav.about")}
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-end">
        <button
          onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          className={[
            "inline-flex items-center gap-2 px-3 py-2 rounded-full",
            "bg-white/80 border border-white/60 shadow-sm",
            "text-xs font-extrabold text-slate-700",
            "hover:bg-white transition",
            "focus:outline-none focus:ring-4 focus:ring-sky-200/60",
          ].join(" ")}
          aria-label="Toggle language"
          title="Toggle language"
        >
          {lang === "pt" ? "PT-BR" : "EN"}
        </button>
      </div>
    </div>
  </header>
);

const FilterDock = ({
  searchTerm,
  setSearchTerm,
  placeholder,
}: {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  placeholder: string;
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
// Easter egg background per generation
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
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-fuchsia-200/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl" />

      <div
        className={[
          "absolute top-24 left-[12%] w-20 h-20 rounded-full blur-2xl",
          egg.a,
        ].join(" ")}
      />
      <div
        className={[
          "absolute top-[28%] right-[14%] w-16 h-16 rounded-full blur-2xl",
          egg.b,
        ].join(" ")}
      />
      <div
        className={[
          "absolute bottom-[18%] left-[22%] w-24 h-24 rounded-full blur-3xl",
          egg.c,
        ].join(" ")}
      />
      <div
        className={[
          "absolute bottom-[10%] right-[26%] w-14 h-14 rounded-full blur-2xl",
          egg.d,
        ].join(" ")}
      />
    </div>
  );
};

// ------------------------
// Screen: Region Selection
// ------------------------
const RegionSelect = ({
  lang,
  onSelect,
  onCreateTeam,
}: {
  lang: Lang;
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
        aria-label={t(lang, "regionSelect.createTeam")}
      >
        <img src={iconPng} alt="PokédexPro" className="w-5 h-5" />
        <span className="text-sm font-extrabold text-slate-700">
          {t(lang, "regionSelect.createTeam")}
        </span>
      </button>

      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mt-6 mb-4">
        {t(lang, "regionSelect.title").split(" ").slice(0, -1).join(" ")}{" "}
        <span className="text-sky-600">
          {t(lang, "regionSelect.title").split(" ").slice(-1)}
        </span>
      </h1>
      <p className="text-slate-600 max-w-xl mx-auto">
        {t(lang, "regionSelect.subtitle")}
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
            {t(lang, "common.openPokedex")} <ArrowRight size={16} />
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
  lang,
  searchTerm,
  setSearchTerm,
  filteredPokemon,
  onPokemonClick,
  regionLabel,
  isLoading,
}: {
  lang: Lang;
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
        {regionLabel}: {t(lang, "home.titlePrefix")}{" "}
        <span className="text-sky-600">{t(lang, "home.titleHighlight")}</span>.
      </h1>

      <p className="text-slate-600 max-w-xl mx-auto">
        {t(lang, "home.subtitle")}
      </p>
    </div>

    <FilterDock
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      placeholder={t(lang, "home.searchPlaceholder")}
    />

    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 bg-white/75 px-4 py-2 rounded-full text-xs font-extrabold text-slate-600 border border-white/60 shadow-sm">
        {isLoading
          ? t(lang, "home.countLoading")
          : I18N[lang].home.count(filteredPokemon.length)}
      </span>
    </div>

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
            <p className="font-bold">{t(lang, "common.notFound")}</p>
          </div>
        )}
      </>
    )}
  </main>
);

// ------------------------
// Team Builder
// ------------------------
const TeamBuilder = ({
  lang,
  allPokemon,
  isLoadingAll,
  ensureAllLoaded,
  team,
  setTeam,
}: {
  lang: Lang;
  allPokemon: Pokemon[];
  isLoadingAll: boolean;
  ensureAllLoaded: () => void;
  team: Pokemon[];
  setTeam: (t: Pokemon[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Stats + card download
  const [showStats, setShowStats] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const teamCardRef = useRef<HTMLDivElement | null>(null);

  const teamStats = useMemo(() => {
    const typeCount = new Map<string, number>();
    const weaknessCount = new Map<string, number>();

    for (const p of team) {
      for (const t0 of p.type || []) {
        typeCount.set(t0, (typeCount.get(t0) || 0) + 1);
      }
      for (const w of p.weaknesses || []) {
        weaknessCount.set(w, (weaknessCount.get(w) || 0) + 1);
      }
    }

    const typesSorted = Array.from(typeCount.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const weaknessesSorted = Array.from(weaknessCount.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const teamTypesSet = new Set(typeCount.keys());

    const WEAKNESS_FIX: Record<string, { add: string[]; notePT: string; noteEN: string }> =
      {
        Electric: {
          add: ["Ground"],
          notePT: "Ground é imune a golpes Elétricos.",
          noteEN: "Ground is immune to Electric moves.",
        },
        Ground: {
          add: ["Water", "Grass", "Ice"],
          notePT: "Esses tipos costumam responder bem a golpes Terrestres.",
          noteEN: "These types often respond well against Ground threats.",
        },
        Rock: {
          add: ["Water", "Grass", "Fighting", "Ground", "Steel"],
          notePT: "Esses tipos ajudam a lidar com adversários do tipo Pedra.",
          noteEN: "These types help deal with Rock opponents.",
        },
        Fire: {
          add: ["Water", "Ground", "Rock"],
          notePT: "Boa resposta contra equipes focadas em Fogo.",
          noteEN: "Strong answers against Fire-focused teams.",
        },
        Water: {
          add: ["Electric", "Grass"],
          notePT: "Cobertura clássica contra Água.",
          noteEN: "Classic coverage against Water.",
        },
        Grass: {
          add: ["Fire", "Ice", "Flying", "Bug", "Poison"],
          notePT: "Boas opções para enfrentar Grama.",
          noteEN: "Good options to face Grass.",
        },
        Ice: {
          add: ["Fire", "Fighting", "Rock", "Steel"],
          notePT: "Tipos fortes contra Gelo.",
          noteEN: "Strong types against Ice.",
        },
        Fighting: {
          add: ["Flying", "Psychic", "Fairy"],
          notePT: "Cobertura típica contra Lutador.",
          noteEN: "Typical coverage against Fighting.",
        },
        Psychic: {
          add: ["Bug", "Ghost", "Dark"],
          notePT: "Esses tipos ajudam a enfrentar Psíquico.",
          noteEN: "These types help handle Psychic.",
        },
        Dark: {
          add: ["Fighting", "Bug", "Fairy"],
          notePT: "Boa resposta contra Sombrio.",
          noteEN: "Good answers against Dark.",
        },
        Dragon: {
          add: ["Ice", "Fairy", "Dragon"],
          notePT: "Respostas tradicionais contra Dragão.",
          noteEN: "Traditional answers against Dragon.",
        },
        Fairy: {
          add: ["Steel", "Poison"],
          notePT: "Tipos fortes contra Fada.",
          noteEN: "Strong types against Fairy.",
        },
        Ghost: {
          add: ["Dark", "Ghost"],
          notePT: "Boa resposta contra Fantasma.",
          noteEN: "Good answers against Ghost.",
        },
        Bug: {
          add: ["Fire", "Flying", "Rock"],
          notePT: "Cobertura comum contra Inseto.",
          noteEN: "Common coverage against Bug.",
        },
        Poison: {
          add: ["Ground", "Psychic"],
          notePT: "Boa resposta contra Veneno.",
          noteEN: "Good answers against Poison.",
        },
        Steel: {
          add: ["Fire", "Fighting", "Ground"],
          notePT: "Cobertura comum contra Metal.",
          noteEN: "Common coverage against Steel.",
        },
        Flying: {
          add: ["Electric", "Ice", "Rock"],
          notePT: "Cobertura comum contra Voador.",
          noteEN: "Common coverage against Flying.",
        },
        Normal: {
          add: ["Fighting"],
          notePT: "Resposta clássica contra Normal.",
          noteEN: "Classic answer against Normal.",
        },
      };

    const suggestions: JSX.Element[] = [];

    const pushTip = (key: string, el: JSX.Element) => {
      if (!suggestions.some((x) => (x.key as any) === key)) suggestions.push(el);
    };

    if (team.length === 0) {
      pushTip(
        "empty",
        <span key="empty">
          {lang === "pt"
            ? "Monte um time (até 6) para receber sugestões mais precisas."
            : "Build a team (up to 6) to receive more precise suggestions."}
        </span>
      );
      return { typesSorted, weaknessesSorted, suggestions };
    }

    if (team.length < 6) {
      pushTip(
        "fill6",
        <span key="fill6">
          {lang === "pt" ? (
            <>
              Considere completar o time com <strong>6 Pokémon</strong> para
              melhorar a cobertura.
            </>
          ) : (
            <>
              Consider filling your team to <strong>6 Pokémon</strong> to improve
              coverage.
            </>
          )}
        </span>
      );
    }

    if (teamTypesSet.size <= 3) {
      pushTip(
        "lowdiv",
        <span key="lowdiv">
          {lang === "pt"
            ? "Seu time tem pouca diversidade de tipos. Variar os elementos ajuda a reduzir fraquezas repetidas."
            : "Your team has low type diversity. Varying types helps reduce repeated weaknesses."}
        </span>
      );
    }

    const repeated = typesSorted.filter(([, c]) => c >= 3).map(([tt]) => tt);
    if (repeated.length > 0) {
      pushTip(
        "repeated",
        <span
          key="repeated"
          className="inline-flex items-center gap-2 flex-wrap"
        >
          {lang === "pt" ? "Muitos Pokémon compartilham:" : "Many Pokémon share:"}
          {repeated.map((tt) => (
            <span key={tt} className="inline-flex items-center gap-1">
              <TypeBadge type={tt} size="sm" />
            </span>
          ))}
          {lang === "pt"
            ? "Isso pode aumentar fraquezas duplicadas."
            : "This can increase duplicated weaknesses."}
        </span>
      );
    }

    const topWeak = weaknessesSorted.slice(0, 5);
    for (const [weakType, count] of topWeak) {
      const fix = WEAKNESS_FIX[weakType];
      if (!fix) continue;

      const candidates = fix.add.filter((tt) => !teamTypesSet.has(tt));
      if (candidates.length === 0) continue;

      const key = `fix-${weakType}`;
      pushTip(
        key,
        <span key={key} className="inline-flex items-center gap-2 flex-wrap">
          {lang === "pt"
            ? "Sua fraqueza mais recorrente inclui:"
            : "A recurring weakness includes:"}
          <span className="inline-flex items-center gap-1">
            <TypeBadge type={weakType} size="sm" />
            <span className="text-xs font-extrabold text-slate-600">
              x{count}
            </span>
          </span>
          •{" "}
          {lang === "pt" ? "Considere adicionar:" : "Consider adding:"}
          <span className="inline-flex items-center gap-1 flex-wrap">
            {candidates.slice(0, 3).map((tt) => (
              <TypeBadge key={tt} type={tt} size="sm" />
            ))}
          </span>
          <span className="text-slate-500">
            ({lang === "pt" ? fix.notePT : fix.noteEN})
          </span>
        </span>
      );
    }

    return {
      typesSorted,
      weaknessesSorted,
      suggestions,
    };
  }, [team, lang]);

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
      a.download = `pokedexpro-team.png`;
      a.click();
    } finally {
      setIsDownloadingCard(false);
    }
  };

  // filters
  const [regionFilter, setRegionFilter] = useState<RegionKey | "all">("all");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [typesOpen, setTypesOpen] = useState(false);
  const typesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (allPokemon.length === 0) ensureAllLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    allPokemon.forEach((p) => p.type.forEach((tt) => types.add(tt)));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [allPokemon]);

  const toggleType = (tt: string) => {
    setTypeFilters((prev) =>
      prev.includes(tt) ? prev.filter((x) => x !== tt) : [...prev, tt]
    );
  };

  const clearFilters = () => {
    setRegionFilter("all");
    setTypeFilters([]);
  };

  const filteredAll = useMemo(() => {
    let list = allPokemon;

    if (regionFilter !== "all") {
      const r = regionMap.get(regionFilter);
      if (r) list = list.filter((p) => p.id >= r.from && p.id <= r.to);
    }

    if (typeFilters.length > 0) {
      list = list.filter((p) => p.type.some((tt) => typeFilters.includes(tt)));
    }

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

  // ------------------------
  // Team slot (updated)
  // ------------------------
  const TeamSlot = ({ index }: { index: number }) => {
    const p = team[index];
    if (!p) {
      return (
        <div
          className={[
            "rounded-3xl border border-dashed border-slate-200",
            "bg-white/55 backdrop-blur-xl",
            "min-h-[160px] flex items-center justify-center",
            "shadow-[0_10px_30px_rgba(15,23,42,0.06)]",
          ].join(" ")}
        >
          <span className="text-xs font-extrabold text-slate-400">
            {I18N[lang].team.emptySlot(index + 1)}
          </span>
        </div>
      );
    }

    return (
      <div
        className={[
          "relative rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl",
          "shadow-[0_12px_30px_rgba(15,23,42,0.08)]",
          "min-h-[160px] px-4 py-4",
          "flex flex-col items-center justify-center text-center",
        ].join(" ")}
      >
        <button
          onClick={() => removeFromTeam(p.id)}
          className={[
            "absolute -top-2 -right-2",
            "w-8 h-8 rounded-full bg-white/90 border border-white/70 shadow-sm",
            "text-slate-600 hover:text-rose-600 hover:bg-white transition",
            "flex items-center justify-center",
            "focus:outline-none focus:ring-4 focus:ring-rose-200/60",
          ].join(" ")}
          aria-label={I18N[lang].team.removeFromTeam(p.name)}
          title={t(lang, "team.remove")}
        >
          <X size={16} />
        </button>

        <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
          <img
            src={p.img}
            alt={p.name}
            className="w-20 h-20 object-contain drop-shadow-sm"
            onError={(e) => {
              const idNum = Number(p.num);
              (e.target as HTMLImageElement).src = Number.isFinite(idNum)
                ? toSerebiiImg(idNum)
                : "https://via.placeholder.com/96?text=?";
            }}
          />
        </div>

        <div className="mt-3">
          <div className="text-sm font-extrabold text-slate-800 leading-tight">
            {p.name}
          </div>
          <div className="text-[11px] font-black text-slate-400 font-mono mt-0.5">
            #{p.num}
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            {p.type.slice(0, 2).map((tt) => (
              <TypeBadge key={tt} type={tt} size="sm" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Minimal pick tile
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
        aria-label={
          selected
            ? `${t(lang, "team.remove")} ${p.name}`
            : `${t(lang, "team.select")} ${p.name}`
        }
        title={selected ? t(lang, "team.selected") : t(lang, "team.select")}
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

  // Dock: search + filters
  const TeamFilterDock = () => (
    <div className="sticky top-20 z-40 flex justify-center w-full px-4 mb-10">
      <div className="w-full max-w-4xl rounded-full p-1 bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t(lang, "team.filterSearchPlaceholder")}
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

          <div className="hidden sm:block">
            <select
              value={regionFilter}
              onChange={(e) =>
                setRegionFilter(e.target.value as RegionKey | "all")
              }
              className={[
                "rounded-full px-4 py-2 text-sm font-extrabold",
                "bg-slate-50 text-slate-700",
                "border border-transparent focus:border-sky-200 focus:bg-white",
                "focus:outline-none focus:ring-2 focus:ring-sky-200/60 transition",
                "cursor-pointer",
              ].join(" ")}
              aria-label="Filter by generation"
              title="Filter by generation"
            >
              <option value="all">{t(lang, "team.filterAll")}</option>
              {REGIONS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div ref={typesRef} className="relative">
            <button
              onClick={() => setTypesOpen((v) => !v)}
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-2",
                "bg-slate-50 text-slate-700",
                "border border-transparent hover:bg-white",
                "focus:outline-none focus:ring-2 focus:ring-sky-200/60 transition",
              ].join(" ")}
              aria-label="Filter by types"
              title="Filter by types"
            >
              {typeFilters.length === 0 ? (
                <span className="text-xs font-extrabold px-2">
                  {t(lang, "team.filterTypes")}
                </span>
              ) : (
                <div className="flex items-center gap-1">
                  {typeFilters.slice(0, 2).map((tt) => (
                    <div
                      key={tt}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center"
                      title={tt}
                    >
                      <TypeBadge type={tt} size="sm" />
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
                    {t(lang, "team.filterTypesTitle")}
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
                    {t(lang, "team.clear")}
                  </button>
                </div>

                <div className="grid grid-cols-9 gap-2">
                  {allTypes.map((tt) => {
                    const selected = typeFilters.includes(tt);
                    return (
                      <button
                        key={tt}
                        onClick={() => toggleType(tt)}
                        className={[
                          "w-9 h-9 rounded-full flex items-center justify-center",
                          "bg-white/75 border border-white/60 shadow-sm",
                          "hover:bg-white transition",
                          selected ? "ring-2 ring-sky-200/80" : "",
                          "focus:outline-none focus:ring-2 focus:ring-sky-200/60",
                        ].join(" ")}
                        title={tt}
                        aria-label={`Type ${tt}`}
                      >
                        <TypeBadge type={tt} size="sm" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 text-xs font-semibold text-slate-500">
                  {typeFilters.length === 0
                    ? t(lang, "team.noTypesSelected")
                    : I18N[lang].team.typesSelected(typeFilters.length)}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              clearFilters();
              setSearchTerm("");
            }}
            disabled={regionFilter === "all" && typeFilters.length === 0 && !searchTerm}
            className={[
              "hidden sm:inline-flex items-center justify-center",
              "w-10 h-10 rounded-full",
              "bg-white/80 border border-white/60 shadow-sm",
              "text-slate-600 hover:text-rose-600 hover:bg-white transition",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-sky-200/60",
            ].join(" ")}
            title={t(lang, "team.clearAllFilters")}
            aria-label={t(lang, "team.clearAllFilters")}
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
            {t(lang, "team.badge")}
          </span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mt-6 mb-3">
          {t(lang, "team.title").split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-sky-600">
            {t(lang, "team.title").split(" ").slice(-1)}
          </span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {t(lang, "team.subtitle")}
        </p>
      </div>

      {/* Toolbar */}
      <div className="max-w-5xl mx-auto mt-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-left">
          <div className="text-sm font-extrabold text-slate-800">
            {t(lang, "team.yourTeam")}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            {I18N[lang].team.selectedCount(team.length)}
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
            {t(lang, "team.stats")}
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
            {isDownloadingCard
              ? t(lang, "team.generating")
              : t(lang, "team.downloadCard")}
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
            {t(lang, "team.clearTeam")}
          </button>
        </div>
      </div>

      {/* Team card (captured by html2canvas) */}
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

        {/* Stats */}
        {showStats && (
          <div className="mt-4 rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-left">
                <div className="text-sm font-extrabold text-slate-900">
                  {t(lang, "team.tipsTitle")}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  {t(lang, "team.tipsSubtitle")}
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
                {t(lang, "team.close")}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                  {t(lang, "team.teamTypes")}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {teamStats.typesSorted.length === 0 ? (
                    <div className="text-sm font-semibold text-slate-500">
                      {lang === "pt"
                        ? "Nenhum Pokémon selecionado."
                        : "No Pokémon selected."}
                    </div>
                  ) : (
                    teamStats.typesSorted.map(([tt, c]) => (
                      <div
                        key={tt}
                        className="inline-flex items-center gap-2 bg-white rounded-full border border-slate-100 px-3 py-1.5 shadow-sm"
                        title={`${tt}: ${c}`}
                      >
                        <TypeBadge type={tt} size="sm" />
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
                  {t(lang, "team.tips")}
                </div>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700 list-disc pl-5">
                  {teamStats.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                {teamStats.weaknessesSorted.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                      {t(lang, "team.topWeaknesses")}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {teamStats.weaknessesSorted.slice(0, 5).map(([w, c]) => (
                        <div
                          key={w}
                          className="inline-flex items-center gap-2 bg-white rounded-full border border-slate-100 px-3 py-1.5 shadow-sm"
                          title={`${w}: ${c}`}
                        >
                          <TypeBadge type={w} size="sm" />
                          <span className="text-xs font-extrabold text-slate-700">
                            x{c}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <TeamFilterDock />

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-white/75 px-4 py-2 rounded-full text-xs font-extrabold text-slate-600 border border-white/60 shadow-sm">
            {isLoadingAll
              ? t(lang, "team.loadingAllTitle")
              : I18N[lang].team.availableCount(filteredAll.length)}
          </span>
        </div>

        {isLoadingAll ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <div className="w-16 h-16 bg-white/80 border border-white/60 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Search size={22} />
            </div>
            <p className="font-bold">{t(lang, "team.loadingAllTitle")}</p>
            <p className="text-xs mt-2 text-slate-400">
              {t(lang, "team.loadingAllSubtitle")}
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
                      {t(lang, "team.regionNoneFound")}
                    </div>
                    <div className="text-xs font-semibold text-slate-400 mt-2">
                      {t(lang, "team.adjustFilters")}
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
// Types Page
// ------------------------
const TypesPage = ({
  lang,
  allPokemon,
  isLoadingAll,
  onPokemonClick,
}: {
  lang: Lang;
  allPokemon: Pokemon[];
  isLoadingAll: boolean;
  onPokemonClick: (p: Pokemon) => void;
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeSearch, setTypeSearch] = useState("");

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    allPokemon.forEach((p) => p.type.forEach((tt) => types.add(tt)));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [allPokemon]);

  const allTypesFiltered = useMemo(() => {
    if (!typeSearch) return allTypes;
    const lower = typeSearch.toLowerCase();
    return allTypes.filter((tt) => tt.toLowerCase().includes(lower));
  }, [typeSearch, allTypes]);

  const filteredByType = useMemo(() => {
    if (!selectedType) return [];
    return allPokemon.filter((p) => p.type.includes(selectedType));
  }, [selectedType, allPokemon]);

  if (isLoadingAll) {
    return (
      <div className="container mx-auto px-4 py-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/75 px-4 py-2 rounded-full text-xs font-extrabold text-slate-600 border border-white/60 shadow-sm">
          {t(lang, "common.loadingPokemon")}
        </div>
        <div className="mt-10 text-slate-500 font-semibold">
          {lang === "pt"
            ? "Preparando dados de todas as regiões (cache local ajuda a acelerar)."
            : "Preparing all regions data (local cache can speed this up)."}
        </div>
      </div>
    );
  }

  if (selectedType) {
    const desc = typeDescription(lang, selectedType) || t(lang, "types.infoDefault");

    return (
      <div className="container mx-auto px-4 py-10 pb-24">
        <button
          onClick={() => setSelectedType(null)}
          className="inline-flex items-center gap-2 mb-8 text-slate-600 hover:text-sky-700 transition-colors font-extrabold"
        >
          <ArrowLeft size={20} /> {t(lang, "types.backToTypes")}
        </button>

        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="flex justify-center mb-4">
            <TypeBadge type={selectedType} size="lg" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {I18N[lang].types.typeOf(typeLabel(lang, selectedType))}
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
            {I18N[lang].types.found(filteredByType.length)}
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
      <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
        {t(lang, "types.title")}
      </h2>
      <p className="text-slate-600 mb-10">{t(lang, "types.subtitle")}</p>

      <div className="max-w-md mx-auto mb-6">
        <FilterDock
          searchTerm={typeSearch}
          setSearchTerm={setTypeSearch}
          placeholder={t(lang, "types.searchPlaceholder")}
        />
      </div>

      <div className="grid grid-cols-5 gap-6 max-w-6xl mx-auto">
        {allTypesFiltered.map((tt) => (
          <button
            key={tt}
            className="flex flex-col items-center gap-2 group"
            onClick={() => setSelectedType(tt)}
          >
            <div className="group-hover:-translate-y-2 transition-transform duration-200">
              <TypeBadge type={tt} size="xl" />
            </div>
            <span className="font-extrabold text-slate-700 group-hover:text-sky-700 transition-colors text-center text-sm">
              {typeLabel(lang, tt)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AboutPage = ({ lang }: { lang: Lang }) => (
  <div className="container mx-auto px-4 py-20 pb-28 flex flex-col items-center text-center">
    <div className="w-20 h-20 bg-white/80 border border-white/60 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
      <img src={iconPng} alt="PokédexPro" className="w-12 h-12 object-contain" />
    </div>
    <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
      {t(lang, "about.title")}
    </h2>
    <div className="max-w-2xl bg-white/75 p-10 rounded-3xl border border-white/60 shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
      <p className="text-lg text-slate-700 leading-relaxed">
        {t(lang, "about.body1")}
      </p>
      <div className="w-16 h-1 bg-slate-100 mx-auto my-8"></div>
      <p className="text-sm text-slate-600 font-semibold">
        {t(lang, "about.body2")}
      </p>
    </div>
  </div>
);

const Footer = ({ lang }: { lang: Lang }) => (
  <footer className="mt-auto py-10">
    <div className="container mx-auto px-6 text-center">
      <p className="text-slate-600 font-semibold mb-2">
        {t(lang, "common.fansNotice")}
      </p>
      <p className="text-slate-500 text-sm">{t(lang, "common.copyright")}</p>
    </div>
  </footer>
);

// ------------------------
// Evolution: cache
// ------------------------
type EvoCacheEntry = { prev: EvoRef[]; next: EvoRef[]; nextChain: EvoRef[] };
type EvoCache = Record<number, EvoCacheEntry>;

const PokemonModal = ({
  lang,
  pokemon,
  onClose,
  onSelect,
  lookupByNum,
  evolutionFor,
}: {
  lang: Lang;
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
            <span className="text-xs text-slate-400">
              {t(lang, "common.placeholderUnknown")}
            </span>
          )}
        </div>
        <span className="text-xs font-extrabold text-slate-600">{ref.name}</span>
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
          aria-label={t(lang, "common.close")}
          title={t(lang, "common.close")}
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
            {pokemon.type.map((tt: string) => (
              <div key={tt} className="flex flex-col items-center gap-2">
                <TypeBadge type={tt} size="lg" />
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                  {typeLabel(lang, tt)}
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
            <p className="text-slate-500 font-medium">{t(lang, "modal.species")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Ruler size={14} /> {t(lang, "modal.height")}
              </div>
              <p className="text-xl font-bold text-slate-800">{pokemon.height}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Weight size={14} /> {t(lang, "modal.weight")}
              </div>
              <p className="text-xl font-bold text-slate-800">{pokemon.weight}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-4">
              {t(lang, "modal.weaknesses")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {pokemon.weaknesses.map((w: string) => (
                <div
                  key={w}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm"
                >
                  <TypeBadge type={w} size="sm" />
                  <span className="text-sm font-bold text-slate-700">
                    {typeLabel(lang, w)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {evo && (evo.prev.length > 0 || nextToShow.length > 0) && (
            <div>
              <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                {t(lang, "modal.evolution")}
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
                        (e.target as HTMLImageElement).src = Number.isFinite(idNum)
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
  const [lang, setLang] = useState<Lang>("pt");

  const [view, setView] = useState<"region" | "home" | "types" | "about" | "team">(
    "region"
  );

  const [region, setRegion] = useState<RegionKey>("kanto");
  const [regionPokemon, setRegionPokemon] = useState<Pokemon[]>([]);
  const [filteredRegionPokemon, setFilteredRegionPokemon] = useState<Pokemon[]>(
    []
  );
  const [isLoadingRegion, setIsLoadingRegion] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const [team, setTeam] = useState<Pokemon[]>([]);

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [evoCache, setEvoCache] = useState<EvoCache>({});

  const regionLabel = useMemo(() => {
    const r = REGIONS.find((x) => x.key === region);
    return r ? r.label : "Region";
  }, [region]);

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

  useEffect(() => {
    if (view === "types" && allPokemon.length === 0) {
      void loadAllRegions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

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
            return cid
              ? { num: pad3(cid), name: cname || `#${pad3(cid)}` }
              : null;
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
      // silent
    }
  };

  useEffect(() => {
    if (!selectedPokemon) return;
    void fetchEvolutionForPokemon(selectedPokemon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPokemon?.id]);

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

  const headerRegionStrip = view === "home" ? region : undefined;

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col bg-gradient-to-br from-sky-50 via-white to-fuchsia-50">
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
        lang={lang}
        setLang={setLang}
        setView={setView}
        currentView={view}
        regionKeyForEasterEgg={headerRegionStrip}
      />

      {view === "region" && (
        <RegionSelect
          lang={lang}
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
          lang={lang}
          allPokemon={allPokemon}
          isLoadingAll={isLoadingAll}
          ensureAllLoaded={() => void loadAllRegions()}
          team={team}
          setTeam={setTeam}
        />
      )}

      {view === "home" && (
        <Home
          lang={lang}
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
          lang={lang}
          allPokemon={allPokemon}
          isLoadingAll={isLoadingAll}
          onPokemonClick={setSelectedPokemon}
        />
      )}

      {view === "about" && <AboutPage lang={lang} />}

      <Footer lang={lang} />

      <PokemonModal
        lang={lang}
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
