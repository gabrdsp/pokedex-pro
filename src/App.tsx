import { useState, useEffect, useMemo } from 'react';
import iconPng from './assets/icon.png';
import {
  Search, X, ArrowRight, ArrowLeft, Weight, Ruler,
  Leaf, Flame, Droplets, Bug, Zap, Skull,
  Wind, Mountain, Hexagon, Snowflake, Eye,
  Swords, Shield, Star, Ghost, CircleDot, Crown
} from 'lucide-react';

// --- DATASET COMPLETO (1-151) ---
const POKEMON_DATA = {
  "id": "pokemon",
  "pokemons": [
    { "id": 1, "num": "001", "name": "Bulbasaur", "img": "https://www.serebii.net/pokemon/art/001.png", "type": ["Grass", "Poison"], "height": "0.71 m", "weight": "6.9 kg", "candy": "Bulbasaur Candy", "candy_count": 25, "egg": "2 km", "spawn_chance": 0.69, "avg_spawns": 69, "spawn_time": "20:00", "multipliers": [1.58], "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "next_evolution": [{ "num": "002", "name": "Ivysaur" }, { "num": "003", "name": "Venusaur" }] },
    { "id": 2, "num": "002", "name": "Ivysaur", "img": "https://www.serebii.net/pokemon/art/002.png", "type": ["Grass", "Poison"], "height": "0.99 m", "weight": "13.0 kg", "candy": "Bulbasaur Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.042, "avg_spawns": 4.2, "spawn_time": "07:00", "multipliers": [1.2, 1.6], "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "prev_evolution": [{ "num": "001", "name": "Bulbasaur" }], "next_evolution": [{ "num": "003", "name": "Venusaur" }] },
    { "id": 3, "num": "003", "name": "Venusaur", "img": "https://www.serebii.net/pokemon/art/003.png", "type": ["Grass", "Poison"], "height": "2.01 m", "weight": "100.0 kg", "candy": "Bulbasaur Candy", "egg": "Not in Eggs", "spawn_chance": 0.017, "avg_spawns": 1.7, "spawn_time": "11:30", "multipliers": null, "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "prev_evolution": [{ "num": "001", "name": "Bulbasaur" }, { "num": "002", "name": "Ivysaur" }] },
    { "id": 4, "num": "004", "name": "Charmander", "img": "https://www.serebii.net/pokemon/art/004.png", "type": ["Fire"], "height": "0.61 m", "weight": "8.5 kg", "candy": "Charmander Candy", "candy_count": 25, "egg": "2 km", "spawn_chance": 0.253, "avg_spawns": 25.3, "spawn_time": "08:45", "multipliers": [1.65], "weaknesses": ["Water", "Ground", "Rock"], "next_evolution": [{ "num": "005", "name": "Charmeleon" }, { "num": "006", "name": "Charizard" }] },
    { "id": 5, "num": "005", "name": "Charmeleon", "img": "https://www.serebii.net/pokemon/art/005.png", "type": ["Fire"], "height": "1.09 m", "weight": "19.0 kg", "candy": "Charmander Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.012, "avg_spawns": 1.2, "spawn_time": "19:00", "multipliers": [1.79], "weaknesses": ["Water", "Ground", "Rock"], "prev_evolution": [{ "num": "004", "name": "Charmander" }], "next_evolution": [{ "num": "006", "name": "Charizard" }] },
    { "id": 6, "num": "006", "name": "Charizard", "img": "https://www.serebii.net/pokemon/art/006.png", "type": ["Fire", "Flying"], "height": "1.70 m", "weight": "90.5 kg", "candy": "Charmander Candy", "egg": "Not in Eggs", "spawn_chance": 0.0031, "avg_spawns": 0.31, "spawn_time": "13:34", "multipliers": null, "weaknesses": ["Water", "Electric", "Rock"], "prev_evolution": [{ "num": "004", "name": "Charmander" }, { "num": "005", "name": "Charmeleon" }] },
    { "id": 7, "num": "007", "name": "Squirtle", "img": "https://www.serebii.net/pokemon/art/007.png", "type": ["Water"], "height": "0.51 m", "weight": "9.0 kg", "candy": "Squirtle Candy", "candy_count": 25, "egg": "2 km", "spawn_chance": 0.58, "avg_spawns": 58, "spawn_time": "04:25", "multipliers": [2.1], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "008", "name": "Wartortle" }, { "num": "009", "name": "Blastoise" }] },
    { "id": 8, "num": "008", "name": "Wartortle", "img": "https://www.serebii.net/pokemon/art/008.png", "type": ["Water"], "height": "0.99 m", "weight": "22.5 kg", "candy": "Squirtle Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.034, "avg_spawns": 3.4, "spawn_time": "07:02", "multipliers": [1.4], "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "007", "name": "Squirtle" }], "next_evolution": [{ "num": "009", "name": "Blastoise" }] },
    { "id": 9, "num": "009", "name": "Blastoise", "img": "https://www.serebii.net/pokemon/art/009.png", "type": ["Water"], "height": "1.60 m", "weight": "85.5 kg", "candy": "Squirtle Candy", "egg": "Not in Eggs", "spawn_chance": 0.0067, "avg_spawns": 0.67, "spawn_time": "00:06", "multipliers": null, "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "007", "name": "Squirtle" }, { "num": "008", "name": "Wartortle" }] },
    { "id": 10, "num": "010", "name": "Caterpie", "img": "https://www.serebii.net/pokemon/art/010.png", "type": ["Bug"], "height": "0.30 m", "weight": "2.9 kg", "candy": "Caterpie Candy", "candy_count": 12, "egg": "2 km", "spawn_chance": 3.032, "avg_spawns": 303.2, "spawn_time": "16:35", "multipliers": [1.05], "weaknesses": ["Fire", "Flying", "Rock"], "next_evolution": [{ "num": "011", "name": "Metapod" }, { "num": "012", "name": "Butterfree" }] },
    { "id": 11, "num": "011", "name": "Metapod", "img": "https://www.serebii.net/pokemon/art/011.png", "type": ["Bug"], "height": "0.71 m", "weight": "9.9 kg", "candy": "Caterpie Candy", "candy_count": 50, "egg": "Not in Eggs", "spawn_chance": 0.187, "avg_spawns": 18.7, "spawn_time": "02:11", "multipliers": [3.55, 3.79], "weaknesses": ["Fire", "Flying", "Rock"], "prev_evolution": [{ "num": "010", "name": "Caterpie" }], "next_evolution": [{ "num": "012", "name": "Butterfree" }] },
    { "id": 12, "num": "012", "name": "Butterfree", "img": "https://www.serebii.net/pokemon/art/012.png", "type": ["Bug", "Flying"], "height": "1.09 m", "weight": "32.0 kg", "candy": "Caterpie Candy", "egg": "Not in Eggs", "spawn_chance": 0.022, "avg_spawns": 2.2, "spawn_time": "05:23", "multipliers": null, "weaknesses": ["Fire", "Electric", "Ice", "Flying", "Rock"], "prev_evolution": [{ "num": "010", "name": "Caterpie" }, { "num": "011", "name": "Metapod" }] },
    { "id": 13, "num": "013", "name": "Weedle", "img": "https://www.serebii.net/pokemon/art/013.png", "type": ["Bug", "Poison"], "height": "0.30 m", "weight": "3.2 kg", "candy": "Weedle Candy", "candy_count": 12, "egg": "2 km", "spawn_chance": 7.12, "avg_spawns": 712, "spawn_time": "02:21", "multipliers": [1.01, 1.09], "weaknesses": ["Fire", "Flying", "Psychic", "Rock"], "next_evolution": [{ "num": "014", "name": "Kakuna" }, { "num": "015", "name": "Beedrill" }] },
    { "id": 14, "num": "014", "name": "Kakuna", "img": "https://www.serebii.net/pokemon/art/014.png", "type": ["Bug", "Poison"], "height": "0.61 m", "weight": "10.0 kg", "candy": "Weedle Candy", "candy_count": 50, "egg": "Not in Eggs", "spawn_chance": 0.44, "avg_spawns": 44, "spawn_time": "02:30", "multipliers": [3.01, 3.41], "weaknesses": ["Fire", "Flying", "Psychic", "Rock"], "prev_evolution": [{ "num": "013", "name": "Weedle" }], "next_evolution": [{ "num": "015", "name": "Beedrill" }] },
    { "id": 15, "num": "015", "name": "Beedrill", "img": "https://www.serebii.net/pokemon/art/015.png", "type": ["Bug", "Poison"], "height": "0.99 m", "weight": "29.5 kg", "candy": "Weedle Candy", "egg": "Not in Eggs", "spawn_chance": 0.051, "avg_spawns": 5.1, "spawn_time": "04:50", "multipliers": null, "weaknesses": ["Fire", "Flying", "Psychic", "Rock"], "prev_evolution": [{ "num": "013", "name": "Weedle" }, { "num": "014", "name": "Kakuna" }] },
    { "id": 16, "num": "016", "name": "Pidgey", "img": "https://www.serebii.net/pokemon/art/016.png", "type": ["Normal", "Flying"], "height": "0.30 m", "weight": "1.8 kg", "candy": "Pidgey Candy", "candy_count": 12, "egg": "2 km", "spawn_chance": 15.98, "avg_spawns": 1.598, "spawn_time": "01:34", "multipliers": [1.71, 1.92], "weaknesses": ["Electric", "Rock"], "next_evolution": [{ "num": "017", "name": "Pidgeotto" }, { "num": "018", "name": "Pidgeot" }] },
    { "id": 17, "num": "017", "name": "Pidgeotto", "img": "https://www.serebii.net/pokemon/art/017.png", "type": ["Normal", "Flying"], "height": "1.09 m", "weight": "30.0 kg", "candy": "Pidgey Candy", "candy_count": 50, "egg": "Not in Eggs", "spawn_chance": 1.02, "avg_spawns": 102, "spawn_time": "01:30", "multipliers": [1.79], "weaknesses": ["Electric", "Rock"], "prev_evolution": [{ "num": "016", "name": "Pidgey" }], "next_evolution": [{ "num": "018", "name": "Pidgeot" }] },
    { "id": 18, "num": "018", "name": "Pidgeot", "img": "https://www.serebii.net/pokemon/art/018.png", "type": ["Normal", "Flying"], "height": "1.50 m", "weight": "39.5 kg", "candy": "Pidgey Candy", "egg": "Not in Eggs", "spawn_chance": 0.13, "avg_spawns": 13, "spawn_time": "01:50", "multipliers": null, "weaknesses": ["Electric", "Rock"], "prev_evolution": [{ "num": "016", "name": "Pidgey" }, { "num": "017", "name": "Pidgeotto" }] },
    { "id": 19, "num": "019", "name": "Rattata", "img": "https://www.serebii.net/pokemon/art/019.png", "type": ["Normal"], "height": "0.30 m", "weight": "3.5 kg", "candy": "Rattata Candy", "candy_count": 25, "egg": "2 km", "spawn_chance": 13.05, "avg_spawns": 1.305, "spawn_time": "01:55", "multipliers": [2.55, 2.73], "weaknesses": ["Fighting"], "next_evolution": [{ "num": "020", "name": "Raticate" }] },
    { "id": 20, "num": "020", "name": "Raticate", "img": "https://www.serebii.net/pokemon/art/020.png", "type": ["Normal"], "height": "0.71 m", "weight": "18.5 kg", "candy": "Rattata Candy", "egg": "Not in Eggs", "spawn_chance": 0.41, "avg_spawns": 41, "spawn_time": "01:56", "multipliers": null, "weaknesses": ["Fighting"], "prev_evolution": [{ "num": "019", "name": "Rattata" }] },
    { "id": 21, "num": "021", "name": "Spearow", "img": "https://www.serebii.net/pokemon/art/021.png", "type": ["Normal", "Flying"], "height": "0.30 m", "weight": "2.0 kg", "candy": "Spearow Candy", "candy_count": 50, "egg": "2 km", "spawn_chance": 4.73, "avg_spawns": 473, "spawn_time": "12:25", "multipliers": [2.66, 2.68], "weaknesses": ["Electric", "Rock"], "next_evolution": [{ "num": "022", "name": "Fearow" }] },
    { "id": 22, "num": "022", "name": "Fearow", "img": "https://www.serebii.net/pokemon/art/022.png", "type": ["Normal", "Flying"], "height": "1.19 m", "weight": "38.0 kg", "candy": "Spearow Candy", "egg": "Not in Eggs", "spawn_chance": 0.15, "avg_spawns": 15, "spawn_time": "01:11", "multipliers": null, "weaknesses": ["Electric", "Rock"], "prev_evolution": [{ "num": "021", "name": "Spearow" }] },
    { "id": 23, "num": "023", "name": "Ekans", "img": "https://www.serebii.net/pokemon/art/023.png", "type": ["Poison"], "height": "2.01 m", "weight": "6.9 kg", "candy": "Ekans Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 2.27, "avg_spawns": 227, "spawn_time": "12:20", "multipliers": [2.21, 2.27], "weaknesses": ["Ground", "Psychic"], "next_evolution": [{ "num": "024", "name": "Arbok" }] },
    { "id": 24, "num": "024", "name": "Arbok", "img": "https://www.serebii.net/pokemon/art/024.png", "type": ["Poison"], "height": "3.51 m", "weight": "65.0 kg", "candy": "Ekans Candy", "egg": "Not in Eggs", "spawn_chance": 0.072, "avg_spawns": 7.2, "spawn_time": "01:50", "multipliers": null, "weaknesses": ["Ground", "Psychic"], "prev_evolution": [{ "num": "023", "name": "Ekans" }] },
    { "id": 25, "num": "025", "name": "Pikachu", "img": "https://www.serebii.net/pokemon/art/025.png", "type": ["Electric"], "height": "0.41 m", "weight": "6.0 kg", "candy": "Pikachu Candy", "candy_count": 50, "egg": "2 km", "spawn_chance": 0.21, "avg_spawns": 21, "spawn_time": "04:00", "multipliers": [2.34], "weaknesses": ["Ground"], "next_evolution": [{ "num": "026", "name": "Raichu" }] },
    { "id": 26, "num": "026", "name": "Raichu", "img": "https://www.serebii.net/pokemon/art/026.png", "type": ["Electric"], "height": "0.79 m", "weight": "30.0 kg", "candy": "Pikachu Candy", "egg": "Not in Eggs", "spawn_chance": 0.0076, "avg_spawns": 0.76, "spawn_time": "23:58", "multipliers": null, "weaknesses": ["Ground"], "prev_evolution": [{ "num": "025", "name": "Pikachu" }] },
    { "id": 27, "num": "027", "name": "Sandshrew", "img": "https://www.serebii.net/pokemon/art/027.png", "type": ["Ground"], "height": "0.61 m", "weight": "12.0 kg", "candy": "Sandshrew Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 1.11, "avg_spawns": 111, "spawn_time": "01:58", "multipliers": [2.45], "weaknesses": ["Water", "Grass", "Ice"], "next_evolution": [{ "num": "028", "name": "Sandslash" }] },
    { "id": 28, "num": "028", "name": "Sandslash", "img": "https://www.serebii.net/pokemon/art/028.png", "type": ["Ground"], "height": "0.99 m", "weight": "29.5 kg", "candy": "Sandshrew Candy", "egg": "Not in Eggs", "spawn_chance": 0.037, "avg_spawns": 3.7, "spawn_time": "12:34", "multipliers": null, "weaknesses": ["Water", "Grass", "Ice"], "prev_evolution": [{ "num": "027", "name": "Sandshrew" }] },
    { "id": 29, "num": "029", "name": "Nidoran ♀", "img": "https://www.serebii.net/pokemon/art/029.png", "type": ["Poison"], "height": "0.41 m", "weight": "7.0 kg", "candy": "Nidoran ♀ (Female) Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 1.38, "avg_spawns": 138, "spawn_time": "01:51", "multipliers": [1.63, 2.48], "weaknesses": ["Ground", "Psychic"], "next_evolution": [{ "num": "030", "name": "Nidorina" }, { "num": "031", "name": "Nidoqueen" }] },
    { "id": 30, "num": "030", "name": "Nidorina", "img": "https://www.serebii.net/pokemon/art/030.png", "type": ["Poison"], "height": "0.79 m", "weight": "20.0 kg", "candy": "Nidoran ♀ (Female) Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.088, "avg_spawns": 8.8, "spawn_time": "07:22", "multipliers": [1.83, 2.48], "weaknesses": ["Ground", "Psychic"], "prev_evolution": [{ "num": "029", "name": "Nidoran(Female)" }], "next_evolution": [{ "num": "031", "name": "Nidoqueen" }] },
    { "id": 31, "num": "031", "name": "Nidoqueen", "img": "https://www.serebii.net/pokemon/art/031.png", "type": ["Poison", "Ground"], "height": "1.30 m", "weight": "60.0 kg", "candy": "Nidoran ♀ (Female) Candy", "egg": "Not in Eggs", "spawn_chance": 0.012, "avg_spawns": 1.2, "spawn_time": "12:35", "multipliers": null, "weaknesses": ["Water", "Ice", "Ground", "Psychic"], "prev_evolution": [{ "num": "029", "name": "Nidoran(Female)" }, { "num": "030", "name": "Nidorina" }] },
    { "id": 32, "num": "032", "name": "Nidoran ♂", "img": "https://www.serebii.net/pokemon/art/032.png", "type": ["Poison"], "height": "0.51 m", "weight": "9.0 kg", "candy": "Nidoran ♂ (Male) Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 1.31, "avg_spawns": 131, "spawn_time": "01:12", "multipliers": [1.64, 1.7], "weaknesses": ["Ground", "Psychic"], "next_evolution": [{ "num": "033", "name": "Nidorino" }, { "num": "034", "name": "Nidoking" }] },
    { "id": 33, "num": "033", "name": "Nidorino", "img": "https://www.serebii.net/pokemon/art/033.png", "type": ["Poison"], "height": "0.89 m", "weight": "19.5 kg", "candy": "Nidoran ♂ (Male) Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.083, "avg_spawns": 8.3, "spawn_time": "09:02", "multipliers": [1.83], "weaknesses": ["Ground", "Psychic"], "prev_evolution": [{ "num": "032", "name": "Nidoran(Male)" }], "next_evolution": [{ "num": "034", "name": "Nidoking" }] },
    { "id": 34, "num": "034", "name": "Nidoking", "img": "https://www.serebii.net/pokemon/art/034.png", "type": ["Poison", "Ground"], "height": "1.40 m", "weight": "62.0 kg", "candy": "Nidoran ♂ (Male) Candy", "egg": "Not in Eggs", "spawn_chance": 0.017, "avg_spawns": 1.7, "spawn_time": "12:16", "multipliers": null, "weaknesses": ["Water", "Ice", "Ground", "Psychic"], "prev_evolution": [{ "num": "032", "name": "Nidoran(Male)" }, { "num": "033", "name": "Nidorino" }] },
    { "id": 35, "num": "035", "name": "Clefairy", "img": "https://www.serebii.net/pokemon/art/035.png", "type": ["Fairy"], "height": "0.61 m", "weight": "7.5 kg", "candy": "Clefairy Candy", "candy_count": 50, "egg": "2 km", "spawn_chance": 0.92, "avg_spawns": 92, "spawn_time": "03:30", "multipliers": [2.03, 2.14], "weaknesses": ["Fighting"], "next_evolution": [{ "num": "036", "name": "Clefable" }] },
    { "id": 36, "num": "036", "name": "Clefable", "img": "https://www.serebii.net/pokemon/art/036.png", "type": ["Fairy"], "height": "1.30 m", "weight": "40.0 kg", "candy": "Clefairy Candy", "egg": "Not in Eggs", "spawn_chance": 0.012, "avg_spawns": 1.2, "spawn_time": "03:29", "multipliers": null, "weaknesses": ["Fighting"], "prev_evolution": [{ "num": "035", "name": "Clefairy" }] },
    { "id": 37, "num": "037", "name": "Vulpix", "img": "https://www.serebii.net/pokemon/art/037.png", "type": ["Fire"], "height": "0.61 m", "weight": "9.9 kg", "candy": "Vulpix Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.22, "avg_spawns": 22, "spawn_time": "13:43", "multipliers": [2.74, 2.81], "weaknesses": ["Water", "Ground", "Rock"], "next_evolution": [{ "num": "038", "name": "Ninetales" }] },
    { "id": 38, "num": "038", "name": "Ninetales", "img": "https://www.serebii.net/pokemon/art/038.png", "type": ["Fire"], "height": "1.09 m", "weight": "19.9 kg", "candy": "Vulpix Candy", "egg": "Not in Eggs", "spawn_chance": 0.0077, "avg_spawns": 0.77, "spawn_time": "01:32", "multipliers": null, "weaknesses": ["Water", "Ground", "Rock"], "prev_evolution": [{ "num": "037", "name": "Vulpix" }] },
    { "id": 39, "num": "039", "name": "Jigglypuff", "img": "https://www.serebii.net/pokemon/art/039.png", "type": ["Normal", "Fairy"], "height": "0.51 m", "weight": "5.5 kg", "candy": "Jigglypuff Candy", "candy_count": 50, "egg": "2 km", "spawn_chance": 0.39, "avg_spawns": 39, "spawn_time": "08:46", "multipliers": [1.85], "weaknesses": ["Fighting"], "next_evolution": [{ "num": "040", "name": "Wigglytuff" }] },
    { "id": 40, "num": "040", "name": "Wigglytuff", "img": "https://www.serebii.net/pokemon/art/040.png", "type": ["Normal", "Fairy"], "height": "0.99 m", "weight": "12.0 kg", "candy": "Jigglypuff Candy", "egg": "Not in Eggs", "spawn_chance": 0.018, "avg_spawns": 1.8, "spawn_time": "12:28", "multipliers": null, "weaknesses": ["Fighting"], "prev_evolution": [{ "num": "039", "name": "Jigglypuff" }] },
    { "id": 41, "num": "041", "name": "Zubat", "img": "https://www.serebii.net/pokemon/art/041.png", "type": ["Poison", "Flying"], "height": "0.79 m", "weight": "7.5 kg", "candy": "Zubat Candy", "candy_count": 50, "egg": "2 km", "spawn_chance": 6.52, "avg_spawns": 652, "spawn_time": "12:28", "multipliers": [2.6, 3.67], "weaknesses": ["Electric", "Ice", "Psychic", "Rock"], "next_evolution": [{ "num": "042", "name": "Golbat" }] },
    { "id": 42, "num": "042", "name": "Golbat", "img": "https://www.serebii.net/pokemon/art/042.png", "type": ["Poison", "Flying"], "height": "1.60 m", "weight": "55.0 kg", "candy": "Zubat Candy", "egg": "Not in Eggs", "spawn_chance": 0.42, "avg_spawns": 42, "spawn_time": "02:15", "multipliers": null, "weaknesses": ["Electric", "Ice", "Psychic", "Rock"], "prev_evolution": [{ "num": "041", "name": "Zubat" }] },
    { "id": 43, "num": "043", "name": "Oddish", "img": "https://www.serebii.net/pokemon/art/043.png", "type": ["Grass", "Poison"], "height": "0.51 m", "weight": "5.4 kg", "candy": "Oddish Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 1.02, "avg_spawns": 102, "spawn_time": "03:58", "multipliers": [1.5], "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "next_evolution": [{ "num": "044", "name": "Gloom" }, { "num": "045", "name": "Vileplume" }] },
    { "id": 44, "num": "044", "name": "Gloom", "img": "https://www.serebii.net/pokemon/art/044.png", "type": ["Grass", "Poison"], "height": "0.79 m", "weight": "8.6 kg", "candy": "Oddish Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.064, "avg_spawns": 6.4, "spawn_time": "11:33", "multipliers": [1.49], "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "prev_evolution": [{ "num": "043", "name": "Oddish" }], "next_evolution": [{ "num": "045", "name": "Vileplume" }] },
    { "id": 45, "num": "045", "name": "Vileplume", "img": "https://www.serebii.net/pokemon/art/045.png", "type": ["Grass", "Poison"], "height": "1.19 m", "weight": "18.6 kg", "candy": "Oddish Candy", "egg": "Not in Eggs", "spawn_chance": 0.0097, "avg_spawns": 0.97, "spawn_time": "23:58", "multipliers": null, "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "prev_evolution": [{ "num": "043", "name": "Oddish" }, { "num": "044", "name": "Gloom" }] },
    { "id": 46, "num": "046", "name": "Paras", "img": "https://www.serebii.net/pokemon/art/046.png", "type": ["Bug", "Grass"], "height": "0.30 m", "weight": "5.4 kg", "candy": "Paras Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 2.36, "avg_spawns": 236, "spawn_time": "01:42", "multipliers": [2.02], "weaknesses": ["Fire", "Ice", "Poison", "Flying", "Bug", "Rock"], "next_evolution": [{ "num": "047", "name": "Parasect" }] },
    { "id": 47, "num": "047", "name": "Parasect", "img": "https://www.serebii.net/pokemon/art/047.png", "type": ["Bug", "Grass"], "height": "0.99 m", "weight": "29.5 kg", "candy": "Paras Candy", "egg": "Not in Eggs", "spawn_chance": 0.074, "avg_spawns": 7.4, "spawn_time": "01:22", "multipliers": null, "weaknesses": ["Fire", "Ice", "Poison", "Flying", "Bug", "Rock"], "prev_evolution": [{ "num": "046", "name": "Paras" }] },
    { "id": 48, "num": "048", "name": "Venonat", "img": "https://www.serebii.net/pokemon/art/048.png", "type": ["Bug", "Poison"], "height": "0.99 m", "weight": "30.0 kg", "candy": "Venonat Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 2.28, "avg_spawns": 228, "spawn_time": "02:31", "multipliers": [1.86, 1.9], "weaknesses": ["Fire", "Flying", "Psychic", "Rock"], "next_evolution": [{ "num": "049", "name": "Venomoth" }] },
    { "id": 49, "num": "049", "name": "Venomoth", "img": "https://www.serebii.net/pokemon/art/049.png", "type": ["Bug", "Poison"], "height": "1.50 m", "weight": "12.5 kg", "candy": "Venonat Candy", "egg": "Not in Eggs", "spawn_chance": 0.072, "avg_spawns": 7.2, "spawn_time": "23:40", "multipliers": null, "weaknesses": ["Fire", "Flying", "Psychic", "Rock"], "prev_evolution": [{ "num": "048", "name": "Venonat" }] },
    { "id": 50, "num": "050", "name": "Diglett", "img": "https://www.serebii.net/pokemon/art/050.png", "type": ["Ground"], "height": "0.20 m", "weight": "0.8 kg", "candy": "Diglett Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.40, "avg_spawns": 40, "spawn_time": "02:22", "multipliers": [2.69], "weaknesses": ["Water", "Grass", "Ice"], "next_evolution": [{ "num": "051", "name": "Dugtrio" }] },
    { "id": 51, "num": "051", "name": "Dugtrio", "img": "https://www.serebii.net/pokemon/art/051.png", "type": ["Ground"], "height": "0.71 m", "weight": "33.3 kg", "candy": "Dugtrio", "egg": "Not in Eggs", "spawn_chance": 0.014, "avg_spawns": 1.4, "spawn_time": "12:37", "multipliers": null, "weaknesses": ["Water", "Grass", "Ice"], "prev_evolution": [{ "num": "050", "name": "Diglett" }] },
    { "id": 52, "num": "052", "name": "Meowth", "img": "https://www.serebii.net/pokemon/art/052.png", "type": ["Normal"], "height": "0.41 m", "weight": "4.2 kg", "candy": "Meowth Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.86, "avg_spawns": 86, "spawn_time": "02:54", "multipliers": [1.98], "weaknesses": ["Fighting"], "next_evolution": [{ "num": "053", "name": "Persian" }] },
    { "id": 53, "num": "053", "name": "Persian", "img": "https://www.serebii.net/pokemon/art/053.png", "type": ["Normal"], "height": "0.99 m", "weight": "32.0 kg", "candy": "Meowth Candy", "egg": "Not in Eggs", "spawn_chance": 0.022, "avg_spawns": 2.2, "spawn_time": "02:44", "multipliers": null, "weaknesses": ["Fighting"], "prev_evolution": [{ "num": "052", "name": "Meowth" }] },
    { "id": 54, "num": "054", "name": "Psyduck", "img": "https://www.serebii.net/pokemon/art/054.png", "type": ["Water"], "height": "0.79 m", "weight": "19.6 kg", "candy": "Psyduck Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 2.54, "avg_spawns": 254, "spawn_time": "03:41", "multipliers": [2.27], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "055", "name": "Golduck" }] },
    { "id": 55, "num": "055", "name": "Golduck", "img": "https://www.serebii.net/pokemon/art/055.png", "type": ["Water"], "height": "1.70 m", "weight": "76.6 kg", "candy": "Psyduck Candy", "egg": "Not in Eggs", "spawn_chance": 0.087, "avg_spawns": 8.7, "spawn_time": "23:06", "multipliers": null, "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "054", "name": "Psyduck" }] },
    { "id": 56, "num": "056", "name": "Mankey", "img": "https://www.serebii.net/pokemon/art/056.png", "type": ["Fighting"], "height": "0.51 m", "weight": "28.0 kg", "candy": "Mankey Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.92, "avg_spawns": 92, "spawn_time": "12:52", "multipliers": [2.17, 2.28], "weaknesses": ["Flying", "Psychic", "Fairy"], "next_evolution": [{ "num": "057", "name": "Primeape" }] },
    { "id": 57, "num": "057", "name": "Primeape", "img": "https://www.serebii.net/pokemon/art/057.png", "type": ["Fighting"], "height": "0.99 m", "weight": "32.0 kg", "candy": "Mankey Candy", "egg": "Not in Eggs", "spawn_chance": 0.031, "avg_spawns": 3.1, "spawn_time": "12:33", "multipliers": null, "weaknesses": ["Flying", "Psychic", "Fairy"], "prev_evolution": [{ "num": "056", "name": "Mankey" }] },
    { "id": 58, "num": "058", "name": "Growlithe", "img": "https://www.serebii.net/pokemon/art/058.png", "type": ["Fire"], "height": "0.71 m", "weight": "19.0 kg", "candy": "Growlithe Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.92, "avg_spawns": 92, "spawn_time": "03:57", "multipliers": [2.31, 2.36], "weaknesses": ["Water", "Ground", "Rock"], "next_evolution": [{ "num": "059", "name": "Arcanine" }] },
    { "id": 59, "num": "059", "name": "Arcanine", "img": "https://www.serebii.net/pokemon/art/059.png", "type": ["Fire"], "height": "1.91 m", "weight": "155.0 kg", "candy": "Growlithe Candy", "egg": "Not in Eggs", "spawn_chance": 0.017, "avg_spawns": 1.7, "spawn_time": "03:11", "multipliers": null, "weaknesses": ["Water", "Ground", "Rock"], "prev_evolution": [{ "num": "058", "name": "Growlithe" }] },
    { "id": 60, "num": "060", "name": "Poliwag", "img": "https://www.serebii.net/pokemon/art/060.png", "type": ["Water"], "height": "0.61 m", "weight": "12.4 kg", "candy": "Poliwag Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 2.19, "avg_spawns": 219, "spawn_time": "03:40", "multipliers": [1.72, 1.73], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "061", "name": "Poliwhirl" }, { "num": "062", "name": "Poliwrath" }] },
    { "id": 61, "num": "061", "name": "Poliwhirl", "img": "https://www.serebii.net/pokemon/art/061.png", "type": ["Water"], "height": "0.99 m", "weight": "20.0 kg", "candy": "Poliwag Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.13, "avg_spawns": 13, "spawn_time": "09:14", "multipliers": [1.95], "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "060", "name": "Poliwag" }], "next_evolution": [{ "num": "062", "name": "Poliwrath" }] },
    { "id": 62, "num": "062", "name": "Poliwrath", "img": "https://www.serebii.net/pokemon/art/062.png", "type": ["Water", "Fighting"], "height": "1.30 m", "weight": "54.0 kg", "candy": "Poliwag Candy", "egg": "Not in Eggs", "spawn_chance": 0.011, "avg_spawns": 1.1, "spawn_time": "01:32", "multipliers": null, "weaknesses": ["Electric", "Grass", "Flying", "Psychic", "Fairy"], "prev_evolution": [{ "num": "060", "name": "Poliwag" }, { "num": "061", "name": "Poliwhirl" }] },
    { "id": 63, "num": "063", "name": "Abra", "img": "https://www.serebii.net/pokemon/art/063.png", "type": ["Psychic"], "height": "0.89 m", "weight": "19.5 kg", "candy": "Abra Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 0.42, "avg_spawns": 42, "spawn_time": "04:30", "multipliers": [1.36, 1.95], "weaknesses": ["Bug", "Ghost", "Dark"], "next_evolution": [{ "num": "064", "name": "Kadabra" }, { "num": "065", "name": "Alakazam" }] },
    { "id": 64, "num": "064", "name": "Kadabra", "img": "https://www.serebii.net/pokemon/art/064.png", "type": ["Psychic"], "height": "1.30 m", "weight": "56.5 kg", "candy": "Abra Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.027, "avg_spawns": 2.7, "spawn_time": "11:25", "multipliers": [1.4], "weaknesses": ["Bug", "Ghost", "Dark"], "prev_evolution": [{ "num": "063", "name": "Abra" }], "next_evolution": [{ "num": "065", "name": "Alakazam" }] },
    { "id": 65, "num": "065", "name": "Alakazam", "img": "https://www.serebii.net/pokemon/art/065.png", "type": ["Psychic"], "height": "1.50 m", "weight": "48.0 kg", "candy": "Abra Candy", "egg": "Not in Eggs", "spawn_chance": 0.0073, "avg_spawns": 0.73, "spawn_time": "12:33", "multipliers": null, "weaknesses": ["Bug", "Ghost", "Dark"], "prev_evolution": [{ "num": "063", "name": "Abra" }, { "num": "064", "name": "Kadabra" }] },
    { "id": 66, "num": "066", "name": "Machop", "img": "https://www.serebii.net/pokemon/art/066.png", "type": ["Fighting"], "height": "0.79 m", "weight": "19.5 kg", "candy": "Machop Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 0.49, "avg_spawns": 49, "spawn_time": "01:55", "multipliers": [1.64, 1.65], "weaknesses": ["Flying", "Psychic", "Fairy"], "next_evolution": [{ "num": "067", "name": "Machoke" }, { "num": "068", "name": "Machamp" }] },
    { "id": 67, "num": "067", "name": "Machoke", "img": "https://www.serebii.net/pokemon/art/067.png", "type": ["Fighting"], "height": "1.50 m", "weight": "70.5 kg", "candy": "Machop Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.034, "avg_spawns": 3.4, "spawn_time": "10:32", "multipliers": [1.7], "weaknesses": ["Flying", "Psychic", "Fairy"], "prev_evolution": [{ "num": "066", "name": "Machop" }], "next_evolution": [{ "num": "068", "name": "Machamp" }] },
    { "id": 68, "num": "068", "name": "Machamp", "img": "https://www.serebii.net/pokemon/art/068.png", "type": ["Fighting"], "height": "1.60 m", "weight": "130.0 kg", "candy": "Machop Candy", "egg": "Not in Eggs", "spawn_chance": 0.0068, "avg_spawns": 0.68, "spawn_time": "02:55", "multipliers": null, "weaknesses": ["Flying", "Psychic", "Fairy"], "prev_evolution": [{ "num": "066", "name": "Machop" }, { "num": "067", "name": "Machoke" }] },
    { "id": 69, "num": "069", "name": "Bellsprout", "img": "https://www.serebii.net/pokemon/art/069.png", "type": ["Grass", "Poison"], "height": "0.71 m", "weight": "4.0 kg", "candy": "Bellsprout Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 1.15, "avg_spawns": 115, "spawn_time": "04:10", "multipliers": [1.57], "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "next_evolution": [{ "num": "070", "name": "Weepinbell" }, { "num": "071", "name": "Victreebel" }] },
    { "id": 70, "num": "070", "name": "Weepinbell", "img": "https://www.serebii.net/pokemon/art/070.png", "type": ["Grass", "Poison"], "height": "0.99 m", "weight": "6.4 kg", "candy": "Bellsprout Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.072, "avg_spawns": 7.2, "spawn_time": "09:45", "multipliers": [1.59], "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "prev_evolution": [{ "num": "069", "name": "Bellsprout" }], "next_evolution": [{ "num": "071", "name": "Victreebel" }] },
    { "id": 71, "num": "071", "name": "Victreebel", "img": "https://www.serebii.net/pokemon/art/071.png", "type": ["Grass", "Poison"], "height": "1.70 m", "weight": "15.5 kg", "candy": "Bellsprout Candy", "egg": "Not in Eggs", "spawn_chance": 0.0059, "avg_spawns": 0.59, "spawn_time": "12:19", "multipliers": null, "weaknesses": ["Fire", "Ice", "Flying", "Psychic"], "prev_evolution": [{ "num": "069", "name": "Bellsprout" }, { "num": "070", "name": "Weepinbell" }] },
    { "id": 72, "num": "072", "name": "Tentacool", "img": "https://www.serebii.net/pokemon/art/072.png", "type": ["Water", "Poison"], "height": "0.89 m", "weight": "45.5 kg", "candy": "Tentacool Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.81, "avg_spawns": 81, "spawn_time": "03:20", "multipliers": [2.52], "weaknesses": ["Electric", "Ground", "Psychic"], "next_evolution": [{ "num": "073", "name": "Tentacruel" }] },
    { "id": 73, "num": "073", "name": "Tentacruel", "img": "https://www.serebii.net/pokemon/art/073.png", "type": ["Water", "Poison"], "height": "1.60 m", "weight": "55.0 kg", "candy": "Tentacool Candy", "egg": "Not in Eggs", "spawn_chance": 0.082, "avg_spawns": 8.2, "spawn_time": "23:36", "multipliers": null, "weaknesses": ["Electric", "Ground", "Psychic"], "prev_evolution": [{ "num": "072", "name": "Tentacool" }] },
    { "id": 74, "num": "074", "name": "Geodude", "img": "https://www.serebii.net/pokemon/art/074.png", "type": ["Rock", "Ground"], "height": "0.41 m", "weight": "20.0 kg", "candy": "Geodude Candy", "candy_count": 25, "egg": "2 km", "spawn_chance": 1.19, "avg_spawns": 119, "spawn_time": "12:40", "multipliers": [1.75, 1.76], "weaknesses": ["Water", "Grass", "Ice", "Fighting", "Ground", "Steel"], "next_evolution": [{ "num": "075", "name": "Graveler" }, { "num": "076", "name": "Golem" }] },
    { "id": 75, "num": "075", "name": "Graveler", "img": "https://www.serebii.net/pokemon/art/075.png", "type": ["Rock", "Ground"], "height": "0.99 m", "weight": "105.0 kg", "candy": "Geodude Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.071, "avg_spawns": 7.1, "spawn_time": "04:53", "multipliers": [1.64, 1.72], "weaknesses": ["Water", "Grass", "Ice", "Fighting", "Ground", "Steel"], "prev_evolution": [{ "num": "074", "name": "Geodude" }], "next_evolution": [{ "num": "076", "name": "Golem" }] },
    { "id": 76, "num": "076", "name": "Golem", "img": "https://www.serebii.net/pokemon/art/076.png", "type": ["Rock", "Ground"], "height": "1.40 m", "weight": "300.0 kg", "candy": "Geodude Candy", "egg": "Not in Eggs", "spawn_chance": 0.0047, "avg_spawns": 0.47, "spawn_time": "12:16", "multipliers": null, "weaknesses": ["Water", "Grass", "Ice", "Fighting", "Ground", "Steel"], "prev_evolution": [{ "num": "074", "name": "Geodude" }, { "num": "075", "name": "Graveler" }] },
    { "id": 77, "num": "077", "name": "Ponyta", "img": "https://www.serebii.net/pokemon/art/077.png", "type": ["Fire"], "height": "0.99 m", "weight": "30.0 kg", "candy": "Ponyta Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.51, "avg_spawns": 51, "spawn_time": "02:50", "multipliers": [1.48, 1.5], "weaknesses": ["Water", "Ground", "Rock"], "next_evolution": [{ "num": "078", "name": "Rapidash" }] },
    { "id": 78, "num": "078", "name": "Rapidash", "img": "https://www.serebii.net/pokemon/art/078.png", "type": ["Fire"], "height": "1.70 m", "weight": "95.0 kg", "candy": "Ponyta Candy", "egg": "Not in Eggs", "spawn_chance": 0.011, "avg_spawns": 1.1, "spawn_time": "04:00", "multipliers": null, "weaknesses": ["Water", "Ground", "Rock"], "prev_evolution": [{ "num": "077", "name": "Ponyta" }] },
    { "id": 79, "num": "079", "name": "Slowpoke", "img": "https://www.serebii.net/pokemon/art/079.png", "type": ["Water", "Psychic"], "height": "1.19 m", "weight": "36.0 kg", "candy": "Slowpoke Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 1.05, "avg_spawns": 105, "spawn_time": "07:12", "multipliers": [2.21], "weaknesses": ["Electric", "Grass", "Bug", "Ghost", "Dark"], "next_evolution": [{ "num": "080", "name": "Slowbro" }] },
    { "id": 80, "num": "080", "name": "Slowbro", "img": "https://www.serebii.net/pokemon/art/080.png", "type": ["Water", "Psychic"], "height": "1.60 m", "weight": "78.5 kg", "candy": "Slowpoke Candy", "egg": "Not in Eggs", "spawn_chance": 0.036, "avg_spawns": 3.6, "spawn_time": "02:56", "multipliers": null, "weaknesses": ["Electric", "Grass", "Bug", "Ghost", "Dark"], "prev_evolution": [{ "num": "079", "name": "Slowpoke" }] },
    { "id": 81, "num": "081", "name": "Magnemite", "img": "https://www.serebii.net/pokemon/art/081.png", "type": ["Electric"], "height": "0.30 m", "weight": "6.0 kg", "candy": "Magnemite Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.71, "avg_spawns": 71, "spawn_time": "04:04", "multipliers": [2.16, 2.17], "weaknesses": ["Fire", "Water", "Ground"], "next_evolution": [{ "num": "082", "name": "Magneton" }] },
    { "id": 82, "num": "082", "name": "Magneton", "img": "https://www.serebii.net/pokemon/art/082.png", "type": ["Electric"], "height": "0.99 m", "weight": "60.0 kg", "candy": "Magnemite Candy", "egg": "Not in Eggs", "spawn_chance": 0.023, "avg_spawns": 2.3, "spawn_time": "15:25", "multipliers": null, "weaknesses": ["Fire", "Water", "Ground"], "prev_evolution": [{ "num": "081", "name": "Magnemite" }] },
    { "id": 83, "num": "083", "name": "Farfetch'd", "img": "https://www.serebii.net/pokemon/art/083.png", "type": ["Normal", "Flying"], "height": "0.79 m", "weight": "15.0 kg", "candy": "None", "egg": "5 km", "spawn_chance": 0.0212, "avg_spawns": 2.12, "spawn_time": "01:09", "multipliers": null, "weaknesses": ["Electric", "Rock"] },
    { "id": 84, "num": "084", "name": "Doduo", "img": "https://www.serebii.net/pokemon/art/084.png", "type": ["Normal", "Flying"], "height": "1.40 m", "weight": "39.2 kg", "candy": "Doduo Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.52, "avg_spawns": 52, "spawn_time": "05:10", "multipliers": [2.19, 2.24], "weaknesses": ["Electric", "Rock"], "next_evolution": [{ "num": "085", "name": "Dodrio" }] },
    { "id": 85, "num": "085", "name": "Dodrio", "img": "https://www.serebii.net/pokemon/art/085.png", "type": ["Normal", "Flying"], "height": "1.80 m", "weight": "85.2 kg", "candy": "Doduo Candy", "egg": "Not in Eggs", "spawn_chance": 0.22, "avg_spawns": 22, "spawn_time": "02:12", "multipliers": null, "weaknesses": ["Electric", "Rock"], "prev_evolution": [{ "num": "084", "name": "Doduo" }] },
    { "id": 86, "num": "086", "name": "Seel", "img": "https://www.serebii.net/pokemon/art/086.png", "type": ["Water"], "height": "1.09 m", "weight": "90.0 kg", "candy": "Seel Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.28, "avg_spawns": 28, "spawn_time": "06:46", "multipliers": [1.04, 1.96], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "087", "name": "Dewgong" }] },
    { "id": 87, "num": "087", "name": "Dewgong", "img": "https://www.serebii.net/pokemon/art/087.png", "type": ["Water", "Ice"], "height": "1.70 m", "weight": "120.0 kg", "candy": "Seel Candy", "egg": "Not in Eggs", "spawn_chance": 0.013, "avg_spawns": 1.3, "spawn_time": "06:04", "multipliers": null, "weaknesses": ["Electric", "Grass", "Fighting", "Rock"], "prev_evolution": [{ "num": "086", "name": "Seel" }] },
    { "id": 88, "num": "088", "name": "Grimer", "img": "https://www.serebii.net/pokemon/art/088.png", "type": ["Poison"], "height": "0.89 m", "weight": "30.0 kg", "candy": "Grimer Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.052, "avg_spawns": 5.2, "spawn_time": "15:11", "multipliers": [2.44], "weaknesses": ["Ground", "Psychic"], "next_evolution": [{ "num": "089", "name": "Muk" }] },
    { "id": 89, "num": "089", "name": "Muk", "img": "https://www.serebii.net/pokemon/art/089.png", "type": ["Poison"], "height": "1.19 m", "weight": "30.0 kg", "candy": "Grimer Candy", "egg": "Not in Eggs", "spawn_chance": 0.0031, "avg_spawns": 0.31, "spawn_time": "01:28", "multipliers": null, "weaknesses": ["Ground", "Psychic"], "prev_evolution": [{ "num": "088", "name": "Grimer" }] },
    { "id": 90, "num": "090", "name": "Shellder", "img": "https://www.serebii.net/pokemon/art/090.png", "type": ["Water"], "height": "0.30 m", "weight": "4.0 kg", "candy": "Shellder Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.52, "avg_spawns": 52, "spawn_time": "07:39", "multipliers": [2.65], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "091", "name": "Cloyster" }] },
    { "id": 91, "num": "091", "name": "Cloyster", "img": "https://www.serebii.net/pokemon/art/091.png", "type": ["Water", "Ice"], "height": "1.50 m", "weight": "132.5 kg", "candy": "Shellder Candy", "egg": "Not in Eggs", "spawn_chance": 0.015, "avg_spawns": 1.5, "spawn_time": "02:33", "multipliers": null, "weaknesses": ["Electric", "Grass", "Fighting", "Rock"], "prev_evolution": [{ "num": "090", "name": "Shellder" }] },
    { "id": 92, "num": "092", "name": "Gastly", "img": "https://www.serebii.net/pokemon/art/092.png", "type": ["Ghost", "Poison"], "height": "1.30 m", "weight": "0.1 kg", "candy": "Gastly Candy", "candy_count": 25, "egg": "5 km", "spawn_chance": 0.79, "avg_spawns": 79, "spawn_time": "04:21", "multipliers": [1.78], "weaknesses": ["Ground", "Psychic", "Ghost", "Dark"], "next_evolution": [{ "num": "093", "name": "Haunter" }, { "num": "094", "name": "Gengar" }] },
    { "id": 93, "num": "093", "name": "Haunter", "img": "https://www.serebii.net/pokemon/art/093.png", "type": ["Ghost", "Poison"], "height": "1.60 m", "weight": "0.1 kg", "candy": "Gastly Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.052, "avg_spawns": 5.2, "spawn_time": "00:10", "multipliers": [1.56, 1.8], "weaknesses": ["Ground", "Psychic", "Ghost", "Dark"], "prev_evolution": [{ "num": "092", "name": "Gastly" }], "next_evolution": [{ "num": "094", "name": "Gengar" }] },
    { "id": 94, "num": "094", "name": "Gengar", "img": "https://www.serebii.net/pokemon/art/094.png", "type": ["Ghost", "Poison"], "height": "1.50 m", "weight": "40.5 kg", "candy": "Gastly Candy", "egg": "Not in Eggs", "spawn_chance": 0.0067, "avg_spawns": 0.67, "spawn_time": "03:55", "multipliers": null, "weaknesses": ["Ground", "Psychic", "Ghost", "Dark"], "prev_evolution": [{ "num": "092", "name": "Gastly" }, { "num": "093", "name": "Haunter" }] },
    { "id": 95, "num": "095", "name": "Onix", "img": "https://www.serebii.net/pokemon/art/095.png", "type": ["Rock", "Ground"], "height": "8.79 m", "weight": "210.0 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.10, "avg_spawns": 10, "spawn_time": "01:18", "multipliers": null, "weaknesses": ["Water", "Grass", "Ice", "Fighting", "Ground", "Steel"] },
    { "id": 96, "num": "096", "name": "Drowzee", "img": "https://www.serebii.net/pokemon/art/096.png", "type": ["Psychic"], "height": "0.99 m", "weight": "32.4 kg", "candy": "Drowzee Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 3.21, "avg_spawns": 321, "spawn_time": "01:51", "multipliers": [2.08, 2.09], "weaknesses": ["Bug", "Ghost", "Dark"], "next_evolution": [{ "num": "097", "name": "Hypno" }] },
    { "id": 97, "num": "097", "name": "Hypno", "img": "https://www.serebii.net/pokemon/art/097.png", "type": ["Psychic"], "height": "1.60 m", "weight": "75.6 kg", "candy": "Drowzee Candy", "egg": "Not in Eggs", "spawn_chance": 0.10, "avg_spawns": 10, "spawn_time": "02:17", "multipliers": null, "weaknesses": ["Bug", "Ghost", "Dark"], "prev_evolution": [{ "num": "096", "name": "Drowzee" }] },
    { "id": 98, "num": "098", "name": "Krabby", "img": "https://www.serebii.net/pokemon/art/098.png", "type": ["Water"], "height": "0.41 m", "weight": "6.5 kg", "candy": "Krabby Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 2.12, "avg_spawns": 212, "spawn_time": "03:33", "multipliers": [2.36, 2.4], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "099", "name": "Kingler" }] },
    { "id": 99, "num": "099", "name": "Kingler", "img": "https://www.serebii.net/pokemon/art/099.png", "type": ["Water"], "height": "1.30 m", "weight": "60.0 kg", "candy": "Krabby Candy", "egg": "Not in Eggs", "spawn_chance": 0.062, "avg_spawns": 6.2, "spawn_time": "03:44", "multipliers": null, "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "098", "name": "Krabby" }] },
    { "id": 100, "num": "100", "name": "Voltorb", "img": "https://www.serebii.net/pokemon/art/100.png", "type": ["Electric"], "height": "0.51 m", "weight": "10.4 kg", "candy": "Voltorb Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.65, "avg_spawns": 65, "spawn_time": "04:36", "multipliers": [2.01, 2.02], "weaknesses": ["Ground"], "next_evolution": [{ "num": "101", "name": "Electrode" }] },
    { "id": 101, "num": "101", "name": "Electrode", "img": "https://www.serebii.net/pokemon/art/101.png", "type": ["Electric"], "height": "1.19 m", "weight": "66.6 kg", "candy": "Voltorb Candy", "egg": "Not in Eggs", "spawn_chance": 0.02, "avg_spawns": 2, "spawn_time": "04:10", "multipliers": null, "weaknesses": ["Ground"], "prev_evolution": [{ "num": "100", "name": "Voltorb" }] },
    { "id": 102, "num": "102", "name": "Exeggcute", "img": "https://www.serebii.net/pokemon/art/102.png", "type": ["Grass", "Psychic"], "height": "0.41 m", "weight": "2.5 kg", "candy": "Exeggcute Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.78, "avg_spawns": 78, "spawn_time": "09:09", "multipliers": [2.7, 3.18], "weaknesses": ["Fire", "Ice", "Poison", "Flying", "Bug", "Ghost", "Dark"], "next_evolution": [{ "num": "103", "name": "Exeggutor" }] },
    { "id": 103, "num": "103", "name": "Exeggutor", "img": "https://www.serebii.net/pokemon/art/103.png", "type": ["Grass", "Psychic"], "height": "2.01 m", "weight": "120.0 kg", "candy": "Exeggcute Candy", "egg": "Not in Eggs", "spawn_chance": 0.014, "avg_spawns": 1.4, "spawn_time": "12:34", "multipliers": null, "weaknesses": ["Fire", "Ice", "Poison", "Flying", "Bug", "Ghost", "Dark"], "prev_evolution": [{ "num": "102", "name": "Exeggcute" }] },
    { "id": 104, "num": "104", "name": "Cubone", "img": "https://www.serebii.net/pokemon/art/104.png", "type": ["Ground"], "height": "0.41 m", "weight": "6.5 kg", "candy": "Cubone Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.61, "avg_spawns": 61, "spawn_time": "01:51", "multipliers": [1.67], "weaknesses": ["Water", "Grass", "Ice"], "next_evolution": [{ "num": "105", "name": "Marowak" }] },
    { "id": 105, "num": "105", "name": "Marowak", "img": "https://www.serebii.net/pokemon/art/105.png", "type": ["Ground"], "height": "0.99 m", "weight": "45.0 kg", "candy": "Cubone Candy", "egg": "Not in Eggs", "spawn_chance": 0.02, "avg_spawns": 2, "spawn_time": "03:59", "multipliers": null, "weaknesses": ["Water", "Grass", "Ice"], "prev_evolution": [{ "num": "104", "name": "Cubone" }] },
    { "id": 106, "num": "106", "name": "Hitmonlee", "img": "https://www.serebii.net/pokemon/art/106.png", "type": ["Fighting"], "height": "1.50 m", "weight": "49.8 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.02, "avg_spawns": 2, "spawn_time": "03:59", "multipliers": null, "weaknesses": ["Flying", "Psychic", "Fairy"] },
    { "id": 107, "num": "107", "name": "Hitmonchan", "img": "https://www.serebii.net/pokemon/art/107.png", "type": ["Fighting"], "height": "1.40 m", "weight": "50.2 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.022, "avg_spawns": 2.2, "spawn_time": "05:58", "multipliers": null, "weaknesses": ["Flying", "Psychic", "Fairy"] },
    { "id": 108, "num": "108", "name": "Lickitung", "img": "https://www.serebii.net/pokemon/art/108.png", "type": ["Normal"], "height": "1.19 m", "weight": "65.5 kg", "candy": "None", "egg": "5 km", "spawn_chance": 0.011, "avg_spawns": 1.1, "spawn_time": "02:46", "multipliers": null, "weaknesses": ["Fighting"] },
    { "id": 109, "num": "109", "name": "Koffing", "img": "https://www.serebii.net/pokemon/art/109.png", "type": ["Poison"], "height": "0.61 m", "weight": "1.0 kg", "candy": "Koffing Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.20, "avg_spawns": 20, "spawn_time": "08:16", "multipliers": [1.11], "weaknesses": ["Ground", "Psychic"], "next_evolution": [{ "num": "110", "name": "Weezing" }] },
    { "id": 110, "num": "110", "name": "Weezing", "img": "https://www.serebii.net/pokemon/art/110.png", "type": ["Poison"], "height": "1.19 m", "weight": "9.5 kg", "candy": "Koffing Candy", "egg": "Not in Eggs", "spawn_chance": 0.016, "avg_spawns": 1.6, "spawn_time": "12:17", "multipliers": null, "weaknesses": ["Ground", "Psychic"], "prev_evolution": [{ "num": "109", "name": "Koffing" }] },
    { "id": 111, "num": "111", "name": "Rhyhorn", "img": "https://www.serebii.net/pokemon/art/111.png", "type": ["Ground", "Rock"], "height": "0.99 m", "weight": "115.0 kg", "candy": "Rhyhorn Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 0.63, "avg_spawns": 63, "spawn_time": "03:21", "multipliers": [1.91], "weaknesses": ["Water", "Grass", "Ice", "Fighting", "Ground", "Steel"], "next_evolution": [{ "num": "112", "name": "Rhydon" }] },
    { "id": 112, "num": "112", "name": "Rhydon", "img": "https://www.serebii.net/pokemon/art/112.png", "type": ["Ground", "Rock"], "height": "1.91 m", "weight": "120.0 kg", "candy": "Rhyhorn Candy", "egg": "Not in Eggs", "spawn_chance": 0.022, "avg_spawns": 2.2, "spawn_time": "05:50", "multipliers": null, "weaknesses": ["Water", "Grass", "Ice", "Fighting", "Ground", "Steel"], "prev_evolution": [{ "num": "111", "name": "Rhyhorn" }] },
    { "id": 113, "num": "113", "name": "Chansey", "img": "https://www.serebii.net/pokemon/art/113.png", "type": ["Normal"], "height": "1.09 m", "weight": "34.6 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.013, "avg_spawns": 1.3, "spawn_time": "04:46", "multipliers": null, "weaknesses": ["Fighting"] },
    { "id": 114, "num": "114", "name": "Tangela", "img": "https://www.serebii.net/pokemon/art/114.png", "type": ["Grass"], "height": "0.99 m", "weight": "35.0 kg", "candy": "None", "egg": "5 km", "spawn_chance": 0.228, "avg_spawns": 22.8, "spawn_time": "23:13", "multipliers": null, "weaknesses": ["Fire", "Ice", "Poison", "Flying", "Bug"] },
    { "id": 115, "num": "115", "name": "Kangaskhan", "img": "https://www.serebii.net/pokemon/art/115.png", "type": ["Normal"], "height": "2.21 m", "weight": "80.0 kg", "candy": "None", "egg": "5 km", "spawn_chance": 0.0086, "avg_spawns": 0.86, "spawn_time": "02:40", "multipliers": null, "weaknesses": ["Fighting"] },
    { "id": 116, "num": "116", "name": "Horsea", "img": "https://www.serebii.net/pokemon/art/116.png", "type": ["Water"], "height": "0.41 m", "weight": "8.0 kg", "candy": "Horsea Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 1.13, "avg_spawns": 113, "spawn_time": "02:53", "multipliers": [2.23], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "117", "name": "Seadra" }] },
    { "id": 117, "num": "117", "name": "Seadra", "img": "https://www.serebii.net/pokemon/art/117.png", "type": ["Water"], "height": "1.19 m", "weight": "25.0 kg", "candy": "Horsea Candy", "egg": "Not in Eggs", "spawn_chance": 0.034, "avg_spawns": 3.4, "spawn_time": "03:18", "multipliers": null, "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "116", "name": "Horsea" }] },
    { "id": 118, "num": "118", "name": "Goldeen", "img": "https://www.serebii.net/pokemon/art/118.png", "type": ["Water"], "height": "0.61 m", "weight": "15.0 kg", "candy": "Goldeen Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 2.18, "avg_spawns": 218, "spawn_time": "03:14", "multipliers": [2.15, 2.2], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "119", "name": "Seaking" }] },
    { "id": 119, "num": "119", "name": "Seaking", "img": "https://www.serebii.net/pokemon/art/119.png", "type": ["Water"], "height": "1.30 m", "weight": "39.0 kg", "candy": "Goldeen Candy", "egg": "Not in Eggs", "spawn_chance": 0.08, "avg_spawns": 8, "spawn_time": "05:21", "multipliers": null, "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "118", "name": "Goldeen" }] },
    { "id": 120, "num": "120", "name": "Staryu", "img": "https://www.serebii.net/pokemon/art/120.png", "type": ["Water"], "height": "0.79 m", "weight": "34.5 kg", "candy": "Staryu Candy", "candy_count": 50, "egg": "5 km", "spawn_chance": 1.95, "avg_spawns": 195, "spawn_time": "22:59", "multipliers": [2.38, 2.41], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "121", "name": "Starmie" }] },
    { "id": 121, "num": "121", "name": "Starmie", "img": "https://www.serebii.net/pokemon/art/121.png", "type": ["Water", "Psychic"], "height": "1.09 m", "weight": "80.0 kg", "candy": "Staryu Candy", "egg": "Not in Eggs", "spawn_chance": 0.034, "avg_spawns": 3.4, "spawn_time": "06:57", "multipliers": null, "weaknesses": ["Electric", "Grass", "Bug", "Ghost", "Dark"], "prev_evolution": [{ "num": "120", "name": "Staryu" }] },
    { "id": 122, "num": "122", "name": "Mr. Mime", "img": "https://www.serebii.net/pokemon/art/122.png", "type": ["Psychic, Fairy"], "height": "1.30 m", "weight": "54.5 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.0031, "avg_spawns": 0.31, "spawn_time": "01:51", "multipliers": null, "weaknesses": ["Bug", "Ghost", "Dark"] },
    { "id": 123, "num": "123", "name": "Scyther", "img": "https://www.serebii.net/pokemon/art/123.png", "type": ["Bug", "Flying"], "height": "1.50 m", "weight": "56.0 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.14, "avg_spawns": 14, "spawn_time": "05:43", "multipliers": null, "weaknesses": ["Fire", "Electric", "Ice", "Flying", "Rock"] },
    { "id": 124, "num": "124", "name": "Jynx", "img": "https://www.serebii.net/pokemon/art/124.png", "type": ["Ice", "Psychic"], "height": "1.40 m", "weight": "40.6 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.35, "avg_spawns": 35, "spawn_time": "05:41", "multipliers": null, "weaknesses": ["Fire", "Bug", "Rock", "Ghost", "Dark", "Steel"] },
    { "id": 125, "num": "125", "name": "Electabuzz", "img": "https://www.serebii.net/pokemon/art/125.png", "type": ["Electric"], "height": "1.09 m", "weight": "30.0 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.074, "avg_spawns": 7.4, "spawn_time": "04:28", "multipliers": null, "weaknesses": ["Ground"] },
    { "id": 126, "num": "126", "name": "Magmar", "img": "https://www.serebii.net/pokemon/art/126.png", "type": ["Fire"], "height": "1.30 m", "weight": "44.5 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.10, "avg_spawns": 10, "spawn_time": "20:36", "multipliers": null, "weaknesses": ["Water", "Ground", "Rock"] },
    { "id": 127, "num": "127", "name": "Pinsir", "img": "https://www.serebii.net/pokemon/art/127.png", "type": ["Bug"], "height": "1.50 m", "weight": "55.0 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.99, "avg_spawns": 99, "spawn_time": "03:25", "multipliers": null, "weaknesses": ["Fire", "Flying", "Rock"] },
    { "id": 128, "num": "128", "name": "Tauros", "img": "https://www.serebii.net/pokemon/art/128.png", "type": ["Normal"], "height": "1.40 m", "weight": "88.4 kg", "candy": "None", "egg": "5 km", "spawn_chance": 0.12, "avg_spawns": 12, "spawn_time": "00:37", "multipliers": null, "weaknesses": ["Fighting"] },
    { "id": 129, "num": "129", "name": "Magikarp", "img": "https://www.serebii.net/pokemon/art/129.png", "type": ["Water"], "height": "0.89 m", "weight": "10.0 kg", "candy": "Magikarp Candy", "candy_count": 400, "egg": "2 km", "spawn_chance": 4.78, "avg_spawns": 478, "spawn_time": "14:26", "multipliers": [10.1, 11.8], "weaknesses": ["Electric", "Grass"], "next_evolution": [{ "num": "130", "name": "Gyarados" }] },
    { "id": 130, "num": "130", "name": "Gyarados", "img": "https://www.serebii.net/pokemon/art/130.png", "type": ["Water", "Flying"], "height": "6.50 m", "weight": "235.0 kg", "candy": "Magikarp Candy", "egg": "Not in Eggs", "spawn_chance": 0.0032, "avg_spawns": 0.32, "spawn_time": "02:15", "multipliers": null, "weaknesses": ["Electric", "Rock"], "prev_evolution": [{ "num": "129", "name": "Magikarp" }] },
    { "id": 131, "num": "131", "name": "Lapras", "img": "https://www.serebii.net/pokemon/art/131.png", "type": ["Water", "Ice"], "height": "2.49 m", "weight": "220.0 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.006, "avg_spawns": 0.6, "spawn_time": "08:59", "multipliers": null, "weaknesses": ["Electric", "Grass", "Fighting", "Rock"] },
    { "id": 132, "num": "132", "name": "Ditto", "img": "https://www.serebii.net/pokemon/art/132.png", "type": ["Normal"], "height": "0.30 m", "weight": "4.0 kg", "candy": "None", "egg": "Not in Eggs", "spawn_chance": 0, "avg_spawns": 0, "spawn_time": "N/A", "multipliers": null, "weaknesses": ["Fighting"] },
    { "id": 133, "num": "133", "name": "Eevee", "img": "https://www.serebii.net/pokemon/art/133.png", "type": ["Normal"], "height": "0.30 m", "weight": "6.5 kg", "candy": "Eevee Candy", "candy_count": 25, "egg": "10 km", "spawn_chance": 2.75, "avg_spawns": 275, "spawn_time": "05:32", "multipliers": [2.02, 2.64], "weaknesses": ["Fighting"], "next_evolution": [{ "num": "134", "name": "Vaporeon" }, { "num": "135", "name": "Jolteon" }, { "num": "136", "name": "Flareon" }] },
    { "id": 134, "num": "134", "name": "Vaporeon", "img": "https://www.serebii.net/pokemon/art/134.png", "type": ["Water"], "height": "0.99 m", "weight": "29.0 kg", "candy": "Eevee Candy", "egg": "Not in Eggs", "spawn_chance": 0.014, "avg_spawns": 1.4, "spawn_time": "10:54", "multipliers": null, "weaknesses": ["Electric", "Grass"], "prev_evolution": [{ "num": "133", "name": "Eevee" }] },
    { "id": 135, "num": "135", "name": "Jolteon", "img": "https://www.serebii.net/pokemon/art/135.png", "type": ["Electric"], "height": "0.79 m", "weight": "24.5 kg", "candy": "None", "egg": "Not in Eggs", "spawn_chance": 0.012, "avg_spawns": 1.2, "spawn_time": "02:30", "multipliers": null, "weaknesses": ["Ground"], "prev_evolution": [{ "num": "133", "name": "Eevee" }] },
    { "id": 136, "num": "136", "name": "Flareon", "img": "https://www.serebii.net/pokemon/art/136.png", "type": ["Fire"], "height": "0.89 m", "weight": "25.0 kg", "candy": "Eevee Candy", "egg": "Not in Eggs", "spawn_chance": 0.017, "avg_spawns": 1.7, "spawn_time": "07:02", "multipliers": null, "weaknesses": ["Water", "Ground", "Rock"], "prev_evolution": [{ "num": "133", "name": "Eevee" }] },
    { "id": 137, "num": "137", "name": "Porygon", "img": "https://www.serebii.net/pokemon/art/137.png", "type": ["Normal"], "height": "0.79 m", "weight": "36.5 kg", "candy": "None", "egg": "5 km", "spawn_chance": 0.012, "avg_spawns": 1.2, "spawn_time": "02:49", "multipliers": null, "weaknesses": ["Fighting"] },
    { "id": 138, "num": "138", "name": "Omanyte", "img": "https://www.serebii.net/pokemon/art/138.png", "type": ["Rock", "Water"], "height": "0.41 m", "weight": "7.5 kg", "candy": "Omanyte Candy", "candy_count": 50, "egg": "10 km", "spawn_chance": 0.14, "avg_spawns": 14, "spawn_time": "10:23", "multipliers": [2.12], "weaknesses": ["Electric", "Grass", "Fighting", "Ground"], "next_evolution": [{ "num": "139", "name": "Omastar" }] },
    { "id": 139, "num": "139", "name": "Omastar", "img": "https://www.serebii.net/pokemon/art/139.png", "type": ["Rock", "Water"], "height": "0.99 m", "weight": "35.0 kg", "candy": "None", "egg": "Omanyte Candy", "spawn_chance": 0.0061, "avg_spawns": 0.61, "spawn_time": "05:04", "multipliers": null, "weaknesses": ["Electric", "Grass", "Fighting", "Ground"], "prev_evolution": [{ "num": "138", "name": "Omanyte" }] },
    { "id": 140, "num": "140", "name": "Kabuto", "img": "https://www.serebii.net/pokemon/art/140.png", "type": ["Rock", "Water"], "height": "0.51 m", "weight": "11.5 kg", "candy": "Kabuto Candy", "candy_count": 50, "egg": "10 km", "spawn_chance": 0.10, "avg_spawns": 10, "spawn_time": "00:05", "multipliers": [1.97, 2.37], "weaknesses": ["Electric", "Grass", "Fighting", "Ground"], "next_evolution": [{ "num": "141", "name": "Kabutops" }] },
    { "id": 141, "num": "141", "name": "Kabutops", "img": "https://www.serebii.net/pokemon/art/141.png", "type": ["Rock", "Water"], "height": "1.30 m", "weight": "40.5 kg", "candy": "Kabuto Candy", "egg": "Not in Eggs", "spawn_chance": 0.0032, "avg_spawns": 0.32, "spawn_time": "23:40", "multipliers": null, "weaknesses": ["Electric", "Grass", "Fighting", "Ground"], "prev_evolution": [{ "num": "140", "name": "Kabuto" }] },
    { "id": 142, "num": "142", "name": "Aerodactyl", "img": "https://www.serebii.net/pokemon/art/142.png", "type": ["Rock", "Flying"], "height": "1.80 m", "weight": "59.0 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.018, "avg_spawns": 1.8, "spawn_time": "23:40", "multipliers": null, "weaknesses": ["Water", "Electric", "Ice", "Rock", "Steel"] },
    { "id": 143, "num": "143", "name": "Snorlax", "img": "https://www.serebii.net/pokemon/art/143.png", "type": ["Normal"], "height": "2.11 m", "weight": "460.0 kg", "candy": "None", "egg": "10 km", "spawn_chance": 0.016, "avg_spawns": 1.6, "spawn_time": "23:40", "multipliers": null, "weaknesses": ["Fighting"] },
    { "id": 144, "num": "144", "name": "Articuno", "img": "https://www.serebii.net/pokemon/art/144.png", "type": ["Ice", "Flying"], "height": "1.70 m", "weight": "55.4 kg", "candy": "None", "egg": "Not in Eggs", "spawn_chance": 0, "avg_spawns": 0, "spawn_time": "N/A", "multipliers": null, "weaknesses": ["Fire", "Electric", "Rock", "Steel"] },
    { "id": 145, "num": "145", "name": "Zapdos", "img": "https://www.serebii.net/pokemon/art/145.png", "type": ["Electric", "Flying"], "height": "1.60 m", "weight": "52.6 kg", "candy": "None", "egg": "Not in Eggs", "spawn_chance": 0, "avg_spawns": 0, "spawn_time": "N/A", "multipliers": null, "weaknesses": ["Ice", "Rock"] },
    { "id": 146, "num": "146", "name": "Moltres", "img": "https://www.serebii.net/pokemon/art/146.png", "type": ["Fire", "Flying"], "height": "2.01 m", "weight": "60.0 kg", "candy": "None", "egg": "Not in Eggs", "spawn_chance": 0, "avg_spawns": 0, "spawn_time": "N/A", "multipliers": null, "weaknesses": ["Water", "Electric", "Rock"] },
    { "id": 147, "num": "147", "name": "Dratini", "img": "https://www.serebii.net/pokemon/art/147.png", "type": ["Dragon"], "height": "1.80 m", "weight": "3.3 kg", "candy": "Dratini Candy", "candy_count": 25, "egg": "10 km", "spawn_chance": 0.30, "avg_spawns": 30, "spawn_time": "06:41", "multipliers": [1.83, 1.84], "weaknesses": ["Ice", "Dragon", "Fairy"], "next_evolution": [{ "num": "148", "name": "Dragonair" }, { "num": "149", "name": "Dragonite" }] },
    { "id": 148, "num": "148", "name": "Dragonair", "img": "https://www.serebii.net/pokemon/art/148.png", "type": ["Dragon"], "height": "3.99 m", "weight": "16.5 kg", "candy": "Dratini Candy", "candy_count": 100, "egg": "Not in Eggs", "spawn_chance": 0.02, "avg_spawns": 2, "spawn_time": "11:57", "multipliers": [2.05], "weaknesses": ["Ice", "Dragon", "Fairy"], "prev_evolution": [{ "num": "147", "name": "Dratini" }], "next_evolution": [{ "num": "149", "name": "Dragonite" }] },
    { "id": 149, "num": "149", "name": "Dragonite", "img": "https://www.serebii.net/pokemon/art/149.png", "type": ["Dragon", "Flying"], "height": "2.21 m", "weight": "210.0 kg", "candy": "Dratini Candy", "egg": "Not in Eggs", "spawn_chance": 0.0011, "avg_spawns": 0.11, "spawn_time": "23:38", "multipliers": null, "weaknesses": ["Ice", "Rock", "Dragon", "Fairy"], "prev_evolution": [{ "num": "147", "name": "Dratini" }, { "num": "148", "name": "Dragonair" }] },
    { "id": 150, "num": "150", "name": "Mewtwo", "img": "https://www.serebii.net/pokemon/art/150.png", "type": ["Psychic"], "height": "2.01 m", "weight": "122.0 kg", "candy": "None", "egg": "Not in Eggs", "spawn_chance": 0, "avg_spawns": 0, "spawn_time": "N/A", "multipliers": null, "weaknesses": ["Bug", "Ghost", "Dark"] },
    { "id": 151, "num": "151", "name": "Mew", "img": "https://www.serebii.net/pokemon/art/151.png", "type": ["Psychic"], "height": "0.41 m", "weight": "4.0 kg", "candy": "None", "egg": "Not in Eggs", "spawn_chance": 0, "avg_spawns": 0, "spawn_time": "N/A", "multipliers": null, "weaknesses": ["Bug", "Ghost", "Dark"] }
  ]
};

// --- CONFIGURAÇÃO DE ÍCONES E CORES ---
const TYPE_ICONS = {
  Grass: Leaf,
  Poison: Skull,
  Fire: Flame,
  Flying: Wind,
  Water: Droplets,
  Bug: Bug,
  Normal: CircleDot,
  Electric: Zap,
  Ground: Mountain,
  Rock: Hexagon,
  Psychic: Eye,
  Fighting: Swords,
  Ice: Snowflake,
  Ghost: Ghost,
  Dragon: Crown,
  Steel: Shield,
  Fairy: Star,
};

const TYPE_COLORS = {
  Grass: 'bg-green-100 text-green-600 border-green-200',
  Poison: 'bg-purple-100 text-purple-600 border-purple-200',
  Fire: 'bg-red-100 text-red-600 border-red-200',
  Flying: 'bg-sky-100 text-sky-600 border-sky-200',
  Water: 'bg-blue-100 text-blue-600 border-blue-200',
  Bug: 'bg-lime-100 text-lime-600 border-lime-200',
  Normal: 'bg-gray-100 text-gray-500 border-gray-200',
  Electric: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  Ground: 'bg-amber-100 text-amber-600 border-amber-200',
  Rock: 'bg-stone-100 text-stone-600 border-stone-200',
  Psychic: 'bg-pink-100 text-pink-600 border-pink-200',
  Fighting: 'bg-orange-100 text-orange-600 border-orange-200',
  Ice: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  Ghost: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  Dragon: 'bg-violet-100 text-violet-600 border-violet-200',
  Steel: 'bg-slate-200 text-slate-600 border-slate-300',
  Fairy: 'bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200',
};

const TYPE_TRANSLATIONS: Record<string, string> = {
  Grass: 'Grama',
  Poison: 'Veneno',
  Fire: 'Fogo',
  Flying: 'Voador',
  Water: 'Água',
  Bug: 'Inseto',
  Normal: 'Normal',
  Electric: 'Elétrico',
  Ground: 'Terra',
  Rock: 'Pedra',
  Psychic: 'Psíquico',
  Fighting: 'Lutador',
  Ice: 'Gelo',
  Ghost: 'Fantasma',
  Dragon: 'Dragão',
  Steel: 'Metal',
  Fairy: 'Fada',
};

const getTypeStyles = (type: string): string => TYPE_COLORS[type as keyof typeof TYPE_COLORS] || 'bg-gray-100 text-gray-500 border-gray-200';
const getTypeIcon = (type: string) => TYPE_ICONS[type as keyof typeof TYPE_ICONS] || CircleDot;

// --- COMPONENTES ---

const TypeBadge = ({ type, size = "md", onClick }: { type: string; size?: string; onClick?: () => void }) => {
  const Icon = getTypeIcon(type);
  const styles = getTypeStyles(type);

  const sizeClasses = size === "lg"
    ? "w-16 h-16 p-3"
    : size === "sm"
      ? "w-6 h-6 p-1"
      : "w-8 h-8 p-1.5";

  return (
    <div
      onClick={onClick}
      className={`rounded-full flex items-center justify-center border ${styles} ${sizeClasses} shadow-sm transition-transform hover:scale-110 ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      title={type}
    >
      <Icon className="w-full h-full" strokeWidth={2.5} />
    </div>
  );
};

const PokemonCard = ({ pokemon, onClick }: { pokemon: any; onClick: (p: any) => void }) => (
  <div
    onClick={() => onClick(pokemon)}
    className="group bg-white rounded-3xl p-6 cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between h-full relative overflow-hidden"
  >
    <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent opacity-50 z-0"></div>
    <span className="text-gray-300 font-mono text-sm font-bold z-10 self-end">#{pokemon.num}</span>

    <div className="relative z-10 w-32 h-32 my-4 transition-transform duration-500 group-hover:scale-110">
      <img
        src={pokemon.img}
        alt={pokemon.name}
        className="w-full h-full object-contain drop-shadow-md"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?'; }}
      />
    </div>

    <div className="text-center z-10 w-full">
      <h3 className="text-slate-700 text-lg font-bold mb-3 tracking-tight">{pokemon.name}</h3>
      <div className="flex justify-center gap-2">
        {pokemon.type.map((t: string) => (
          <TypeBadge key={t} type={t} onClick={() => { }} />
        ))}
      </div>
    </div>
  </div>
);

const Header = ({ setView, currentView }: { setView: (v: string) => void; currentView: string }) => (
  <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
    <div className="container mx-auto px-6 h-14 flex items-center justify-between relative">
      <div className="flex items-center gap-2 cursor-pointer z-10" onClick={() => setView('home')}>
        <img src={iconPng} alt="Pokédex Pro" className="w-8 h-8 drop-shadow-lg" />
        <span className="font-bold text-xl tracking-tight text-slate-800">Pokédex<span className="text-blue-500">Pro</span></span>
      </div>

      <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-8 text-sm font-medium text-slate-500">
        <button
          onClick={() => setView('home')}
          className={`hover:text-blue-500 transition-colors ${currentView === 'home' ? 'text-blue-500 font-bold' : ''}`}
        >
          Início
        </button>
        <button
          onClick={() => setView('types')}
          className={`hover:text-blue-500 transition-colors ${currentView === 'types' ? 'text-blue-500 font-bold' : ''}`}
        >
          Tipos
        </button>
        <button
          onClick={() => setView('about')}
          className={`hover:text-blue-500 transition-colors ${currentView === 'about' ? 'text-blue-500 font-bold' : ''}`}
        >
          Sobre
        </button>
      </nav>

      <div className="w-8"></div>
    </div>
  </header>
);

const FilterDock = ({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (s: string) => void }) => {
  return (
    <div className="sticky top-20 z-40 flex justify-center w-full px-4 mb-10">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl shadow-gray-200/40 rounded-full p-1 flex items-center gap-2 max-w-md w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-700 text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:bg-white transition-all border border-transparent focus:border-blue-500/30 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

const PokemonModal = ({ pokemon, onClose, onSelect, allPokemon }: { pokemon: any; onClose: () => void; onSelect: (p: any) => void; allPokemon: any[] }) => {
  if (!pokemon) return null;

  const findEvolution = (ref: any) => allPokemon.find((p: any) => p.num === ref.num);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-white/50 hover:bg-white rounded-full text-slate-500 shadow-sm transition-all">
          <X size={20} />
        </button>

        <div className="w-full md:w-5/12 bg-slate-50 relative flex flex-col items-center justify-center p-10 border-r border-slate-100">
          <div className="absolute top-10 left-10 text-9xl font-black text-slate-200/50 select-none">
            {pokemon.num}
          </div>
          <img src={pokemon.img} alt={pokemon.name} className="relative z-10 w-56 h-56 object-contain drop-shadow-xl" />
          <div className="flex gap-4 mt-8 relative z-10">
            {pokemon.type.map((t: string) => (
              <div key={t} className="flex flex-col items-center gap-2">
                <TypeBadge type={t} size="lg" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-7/12 p-10 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-2">{pokemon.name}</h2>
            <p className="text-slate-400 font-medium">Espécie de Pokémon</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"><Ruler size={14} /> Altura</div>
              <p className="text-xl font-semibold text-slate-700">{pokemon.height}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"><Weight size={14} /> Peso</div>
              <p className="text-xl font-semibold text-slate-700">{pokemon.weight}</p>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Fraquezas</h3>
            <div className="flex flex-wrap gap-3">
              {pokemon.weaknesses.map((w: string) => (
                <div key={w} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <TypeBadge type={w} size="sm" />
                  <span className="text-sm font-medium text-slate-600">{w}</span>
                </div>
              ))}
            </div>
          </div>
          {(pokemon.prev_evolution || pokemon.next_evolution) && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Cadeia de Evolução</h3>
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {pokemon.prev_evolution?.map((prev: any) => {
                  const pData = findEvolution(prev);
                  return (
                    <div
                      key={prev.num}
                      className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => pData && onSelect(pData)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                          {pData && <img src={pData.img} className="w-10 h-10" alt={prev.name} />}
                        </div>
                        <span className="text-xs font-bold text-slate-500">{prev.name}</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-300" />
                    </div>
                  );
                })}

                {/* Current Pokemon - Smaller Circle */}
                <div className="flex flex-col items-center scale-110">
                  <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center mb-2 shadow-sm">
                    <img src={pokemon.img} className="w-10 h-10" alt={pokemon.name} />
                  </div>
                  <span className="text-xs font-bold text-blue-600">{pokemon.name}</span>
                </div>

                {pokemon.next_evolution?.map((next: any) => {
                  const pData = findEvolution(next);
                  return (
                    <div
                      key={next.num}
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => pData && onSelect(pData)}
                    >
                      <ArrowRight size={16} className="text-slate-300 mr-4" />
                      <div className="flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                          {pData ? <img src={pData.img} className="w-10 h-10" alt={next.name} /> : <span className="text-xs text-slate-400">?</span>}
                        </div>
                        <span className="text-xs font-bold text-slate-500">{next.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Home = ({ searchTerm, setSearchTerm, filteredPokemon, onPokemonClick }: { searchTerm: string; setSearchTerm: (s: string) => void; filteredPokemon: any[]; onPokemonClick: (p: any) => void }) => (
  <main className="container mx-auto px-4 relative pb-20">
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">
        Escolha seu <span className="text-blue-500">companheiro.</span>
      </h1>
      <p className="text-slate-400 max-w-lg mx-auto">
        Explore a coleção completa de Pokémon!
      </p>
    </div>

    <FilterDock searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

    <div className="text-center mb-8">
      <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-slate-400 border border-slate-100 shadow-sm">
        {filteredPokemon.length} Pokémon Encontrados
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {filteredPokemon.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={onPokemonClick} />
      ))}
    </div>

    {filteredPokemon.length === 0 && (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Search size={24} />
        </div>
        <p className="font-medium">Nenhuma correspondência encontrada</p>
      </div>
    )}
  </main>
);

const TypesPage = ({ allTypes: _, allPokemon, onPokemonClick }: { allTypes: string[]; allPokemon: any[]; onPokemonClick: (p: any) => void }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredByType = useMemo(() => {
    if (!selectedType) return [];
    return allPokemon.filter((p: any) => p.type.includes(selectedType));
  }, [selectedType, allPokemon]);

  if (selectedType) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <button
          onClick={() => setSelectedType(null)}
          className="flex items-center gap-2 mb-8 text-slate-500 hover:text-blue-500 transition-colors font-bold"
        >
          <ArrowLeft size={20} /> Voltar aos Tipos
        </button>

        <div className="flex flex-col items-center mb-12">
          <TypeBadge type={selectedType} size="lg" />
          <h2 className="text-3xl font-bold mt-4 text-slate-800">Pokémon do tipo {TYPE_TRANSLATIONS[selectedType] || selectedType}</h2>
          <p className="text-slate-400 mt-2">{filteredByType.length} Pokémon encontrados</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredByType.map((pokemon: any) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={onPokemonClick} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 pb-20 text-center">
      <h2 className="text-4xl font-bold text-slate-900 mb-4">Tipos Elementais</h2>
      <p className="text-slate-400 mb-12">Selecione um elemento para ver todos os Pokémon desse tipo.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
        {Object.keys(TYPE_COLORS).map((type: string) => (
          <div
            key={type}
            className="flex flex-col items-center gap-3 group cursor-pointer"
            onClick={() => setSelectedType(type)}
          >
            <div className="group-hover:-translate-y-2 transition-transform duration-300">
              <TypeBadge type={type} size="lg" />
            </div>
            <span className="font-bold text-slate-600 group-hover:text-blue-500 transition-colors">{TYPE_TRANSLATIONS[type] || type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="container mx-auto px-4 py-20 pb-40 flex flex-col items-center text-center">
    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
      <img src={iconPng} alt="Pokédex Pro" className="w-12 h-12 object-contain" />
    </div>
    <h2 className="text-4xl font-bold text-slate-900 mb-6">Sobre o Projeto</h2>
    <div className="max-w-2xl bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
      <p className="text-lg text-slate-600 leading-relaxed">
        PokédexPro é um projeto desenvolvido para um trabalho acadêmico da disciplina de <span className="font-bold text-blue-500">Banco de Dados</span> pela <span className="font-bold text-slate-800">UFERSA</span>.
      </p>
      <div className="w-16 h-1 bg-slate-100 mx-auto my-8"></div>
      <p className="text-sm text-slate-400">
        Desenvolvido com React, Tailwind CSS e muita dedicação.
      </p>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 mt-auto py-12">
    <div className="container mx-auto px-6 text-center">
      <div className="flex justify-center items-center gap-2 mb-4 text-slate-300">
        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
      </div>
      <p className="text-slate-500 font-medium mb-2">Este é um projeto realizado por fãs sem fins lucrativos.</p>
      <p className="text-slate-400 text-sm">© 2025 Feito com muita dedicação e carinho 💙.</p>
    </div>
  </footer>
);

const App = () => {
  const [view, setView] = useState('home');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [filteredPokemon, setFilteredPokemon] = useState(POKEMON_DATA.pokemons);

  const allTypes = useMemo(() => {
    // Filter only standard gen 1 types if desired, or keep all from data
    const standardTypes = ["Grass", "Poison", "Fire", "Flying", "Water", "Bug", "Normal", "Electric", "Ground", "Rock", "Psychic", "Fighting", "Ice", "Ghost", "Dragon"];
    // Or dynamic:
    const types = new Set<string>();
    POKEMON_DATA.pokemons.forEach(p => p.type.forEach(t => types.add(t)));
    // Intersection to ensure 15 types grid or just sort
    return Array.from(types).filter((t: string) => standardTypes.includes(t)).sort((a: string, b: string) => standardTypes.indexOf(a) - standardTypes.indexOf(b));
  }, []);

  useEffect(() => {
    let result = POKEMON_DATA.pokemons;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lower) || p.num.includes(lower));
    }
    setFilteredPokemon(result);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Header setView={setView} currentView={view} />

      {view === 'home' && (
        <Home
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredPokemon={filteredPokemon}
          onPokemonClick={setSelectedPokemon}
        />
      )}

      {view === 'types' && (
        <TypesPage
          allTypes={allTypes}
          allPokemon={POKEMON_DATA.pokemons}
          onPokemonClick={setSelectedPokemon}
        />
      )}

      {view === 'about' && <AboutPage />}

      <Footer />

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        onSelect={setSelectedPokemon}
        allPokemon={POKEMON_DATA.pokemons}
      />
    </div>
  );
};

export default App;