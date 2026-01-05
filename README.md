# 🎮 Pokédex Pro

Uma aplicação web moderna e interativa para explorar dados dos 151 Pokémon da primeira geração. Desenvolvida como projeto acadêmico para a disciplina de Banco de Dados na **UFERSA**.

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC.svg)
![Vite](https://img.shields.io/badge/Vite-5+-purple.svg)

</div>

---

## ✨ Características

### 🔍 Busca Inteligente
- Busque Pokémon pelo **nome** ou **número da Pokédex**
- Busca em tempo real com resultado instantâneo
- Barra de pesquisa sticky com backdrop blur

### 🏷️ Filtro por Tipo
- 15 tipos elementais diferentes (Gen 1)
- Visualização visual com ícones e cores específicas
- Filtragem dinâmica e responsiva
- Suporte completo a português

### 📋 Informações Detalhadas
- **Modal interativo** com detalhes completos do Pokémon
- Altura e peso
- Fraquezas e tipos
- **Cadeia de evolução** com navegação interativa
- Imagens de alta qualidade do Serebii

### 🎨 Design Responsivo
- Interface moderna e intuitiva
- Totalmente responsivo (mobile-first)
- Animações suaves e transições
- Tema claro com cores temáticas por tipo
- Barra de scroll sempre visível

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|-----------|-----------|
| **React 18** | Framework para UI com hooks |
| **TypeScript** | Type-safety completo |
| **Tailwind CSS** | Estilização utility-first |
| **Vite** | Build tool moderno |
| **Lucide React** | Ícones vectorizados |
| **gh-pages** | Deploy automático |

---

## 🏗️ Arquitetura

### Componentes Principais

- **Header**: Navegação sticky com logo e menu
- **FilterDock**: Barra de busca sticky
- **Home**: Grid responsivo de Pokémon
- **TypesPage**: Visualização por tipo elemental
- **PokemonModal**: Modal detalhado com evolução
- **TypeBadge**: Badge interativo de tipo
- **Footer**: Rodapé com informações

### Estado Global

```typescript
- view: 'home' | 'types' | 'about'
- searchTerm: string
- selectedPokemon: Pokemon | null
- filteredPokemon: Pokemon[]
- allTypes: string[]
```

---

## 💡 Funcionalidades Principais

### 1️⃣ Busca de Pokémon
- Busca por nome (case-insensitive)
- Busca por número Pokédex
- Atualização em tempo real

### 2️⃣ Filtro por Tipo
- 15 tipos com cores e ícones únicos
- Visualização de Pokémon por tipo
- Navegação intuitiva

### 3️⃣ Modal de Detalhes
- Imagem grande e ampliada
- Tipos, altura e peso
- Cadeia completa de evolução
- Clique para navegar entre evoluções

### 4️⃣ Responsividade
- Mobile: 1 coluna
- Tablet: 2-3 colunas
- Desktop: 4-5 colunas
- Modal otimizado para todos os tamanhos

---

## 📦 Dataset

### Estrutura de Pokémon

```typescript
{
  id: number;                    // ID único
  num: string;                   // Número Pokédex (001-151)
  name: string;                  // Nome
  img: string;                   // URL da imagem Serebii
  type: string[];                // Tipos (1-2)
  height: string;                // Altura
  weight: string;                // Peso
  weaknesses: string[];          // Fraquezas de tipo
  prev_evolution?: EvolutionRef[];
  next_evolution?: EvolutionRef[];
}
```

### Tipagens
🍃 Grass 💀 Poison 🔥 Fire ☁ Flying 🌊 Water 🐛 Bug ⚪ Normal ⚡ Electric ⛰️ Ground 🪨 Rock 🧠 Psychic 🥊 Fighting ❄ Ice 👻 Ghost 🐉 Dragon ⚙️ Steel 🦋 Fairy

---

## 🔧 Instalação e Uso

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Setup

```bash
# Clone o repositório
git clone https://github.com/gabrdsp/pokedex-pro.git
cd pokedex-pro

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy para GitHub Pages
npm run deploy
```

### Scripts Disponíveis

```bash
npm run dev      # Servidor Vite em desenvolvimento
npm run build    # Build para produção
npm run preview  # Visualiza build localmente
npm run deploy   # Build + Deploy GitHub Pages
```

---

## 🌍 Deploy

Hospedado no GitHub Pages:
```
https://gabrdsp.github.io/pokedex-pro
```

---

## 🎓 Contexto Acadêmico

Desenvolvido para a disciplina de **Banco de Dados** na **UFERSA** (Universidade Federal Rural do Semi-Árido).

### Objetivos Alcançados
- ✅ Estruturação de dados em JSON
- ✅ Filtros e buscas eficientes
- ✅ Interface responsiva e moderna
- ✅ Tratamento de erros
- ✅ Deploy em produção

---

## 📄 Licença

Projeto fan-made sem fins lucrativos. Pokémon é uma propriedade de The Pokémon Company, Nintendo e Game Freak.

Código licenciado sob MIT.

---

## 🙏 Agradecimentos

- **Serebii** pelos recursos de imagens
- **UFERSA** pelo aprendizado

---

## 🔗 Links

- [GitHub](https://github.com/gabrdsp/pokedex-pro)
- [Live Demo](https://gabrdsp.github.io/pokedex-pro)
- [Serebii Pokédex](https://www.serebii.net)

---

<div align="center">

**Feito com dedicação e carinho 💙**

*Uma Pokédex para explorar, aprender e se divertir!* 🎮✨

</div>
