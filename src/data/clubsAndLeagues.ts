import { Club, League, PositionKey } from "../types";

export const LEAGUES: Record<string, League> = {
  PL:  {title:"Premier League", cup:"FA Cup", country:"Inglaterra", continental:true},
  LL:  {title:"La Liga", cup:"Copa del Rey", country:"España", continental:true},
  SA:  {title:"Serie A", cup:"Coppa Italia", country:"Italia", continental:true},
  BL:  {title:"Bundesliga", cup:"DFB-Pokal", country:"Alemania", continental:true},
  L1:  {title:"Ligue 1", cup:"Coupe de France", country:"Francia", continental:true},
  ERE: {title:"Eredivisie", cup:"KNVB Beker", country:"Países Bajos", continental:true},
  PRI: {title:"Primeira Liga", cup:"Taça de Portugal", country:"Portugal", continental:true},
  BRA: {title:"Brasileirão", cup:"Copa do Brasil", country:"Brasil", continental:false},
  MLS: {title:"MLS Cup", cup:"US Open Cup", country:"Estados Unidos", continental:false},
  SPL: {title:"Saudi Pro League", cup:"Copa del Rey Saudí", country:"Arabia Saudí", continental:false},
  ARG: {title:"Liga Profesional Argentina", cup:"Copa Argentina", country:"Argentina", continental:false},
  MEX: {title:"Liga MX", cup:"Copa MX", country:"México", continental:false},
  ESP2: {title:"Segunda División", cup:"Copa del Rey", country:"España", continental:false},
  ENG2: {title:"EFL Championship", cup:"FA Cup", country:"Inglaterra", continental:false},
  ITA2: {title:"Serie B", cup:"Coppa Italia", country:"Italia", continental:false},
  GER2: {title:"2. Bundesliga", cup:"DFB-Pokal", country:"Alemania", continental:false},
  FRA2: {title:"Ligue 2", cup:"Coupe de France", country:"Francia", continental:false},
  BEL: {title:"Jupiler Pro League", cup:"Beker van België", country:"Bélgica", continental:true},
  SCO: {title:"Scottish Premiership", cup:"Copa de Escocia", country:"Escocia", continental:true},
  TUR: {title:"Süper Lig", cup:"Copa de Turquía", country:"Turquía", continental:true},
  GRE: {title:"Super League Grecia", cup:"Copa de Grecia", country:"Grecia", continental:true},
  UKR: {title:"Liga Premier de Ucrania", cup:"Copa de Ucrania", country:"Ucrania", continental:true},
  SUI: {title:"Super League Suiza", cup:"Copa de Suiza", country:"Suiza", continental:true},
  AUT: {title:"Bundesliga Austriaca", cup:"Copa de Austria", country:"Austria", continental:true},
  DEN: {title:"Superliga Danesa", cup:"Copa de Dinamarca", country:"Dinamarca", continental:true},
  SWE: {title:"Allsvenskan", cup:"Copa de Suecia", country:"Suecia", continental:true},
  NOR: {title:"Eliteserien", cup:"Copa de Noruega", country:"Noruega", continental:true},
  POL: {title:"Ekstraklasa", cup:"Copa de Polonia", country:"Polonia", continental:true},
  CZE: {title:"Liga Checa", cup:"Copa de Chequia", country:"Chequia", continental:true},
  CRO: {title:"Liga Croata (HNL)", cup:"Copa de Croacia", country:"Croacia", continental:true},
  SRB: {title:"SuperLiga de Serbia", cup:"Copa de Serbia", country:"Serbia", continental:true},
  ROU: {title:"Liga I de Rumanía", cup:"Copa de Rumanía", country:"Rumanía", continental:true},
  RUS: {title:"Liga Premier de Rusia", cup:"Copa de Rusia", country:"Rusia", continental:false},
  URU: {title:"Primera División de Uruguay", cup:"Copa Uruguay", country:"Uruguay", continental:true},
  CHI: {title:"Primera División de Chile", cup:"Copa Chile", country:"Chile", continental:true},
  COL: {title:"Categoría Primera A", cup:"Copa Colombia", country:"Colombia", continental:true},
  ECU: {title:"LigaPro Ecuador", cup:"Copa Ecuador", country:"Ecuador", continental:true},
  PAR: {title:"División Profesional de Paraguay", cup:"Copa Paraguay", country:"Paraguay", continental:true},
  BOL: {title:"División Profesional de Bolivia", cup:"Copa Bolivia", country:"Bolivia", continental:true},
  PER: {title:"Liga 1 de Perú", cup:"Copa Perú", country:"Perú", continental:true},
  VEN: {title:"Liga FUTVE", cup:"Copa Venezuela", country:"Venezuela", continental:true},
  CRC: {title:"Liga Promerica", cup:"Copa Costa Rica", country:"Costa Rica", continental:false},
  JPN: {title:"J1 League", cup:"Copa del Emperador", country:"Japón", continental:false},
  KOR: {title:"K League 1", cup:"Copa de Corea", country:"Corea del Sur", continental:false},
  CHN: {title:"Chinese Super League", cup:"Copa de China", country:"China", continental:false},
  AUS: {title:"A-League", cup:"Copa de Australia", country:"Australia", continental:false},
  EGY: {title:"Liga Premier de Egipto", cup:"Copa de Egipto", country:"Egipto", continental:false},
  MAR: {title:"Botola Pro", cup:"Copa del Trono", country:"Marruecos", continental:false},
  RSA: {title:"Premier Soccer League", cup:"Nedbank Cup", country:"Sudáfrica", continental:false},
};

function buildClubs(): Club[] {
  const raw: Record<string, Array<[string, number]>> = {
    PL: [["Manchester City",5],["Arsenal",5],["Liverpool",5],["Manchester United",4],["Chelsea",4],
         ["Tottenham Hotspur",4],["Newcastle United",4],["Aston Villa",3],["West Ham United",3],
         ["Everton",2],["Brighton",3],["Crystal Palace",2],["Nottingham Forest",2],["Wolverhampton",2],
         ["Fulham",2],["Brentford",2],["Bournemouth",2],["Burnley",1],
         ["Ipswich Town",1],["Sheffield United",1],["Luton Town",1],["Southampton",2],["Watford",1],["Cardiff City",1],["Stoke City",1],["Hull City",1]],
    LL: [["Real Madrid",5],["FC Barcelona",5],["Atlético de Madrid",5],["Athletic Club",4],
         ["Real Sociedad",4],["Sevilla FC",3],["Valencia CF",3],["Villarreal CF",4],["Real Betis",3],
         ["Celta de Vigo",2],["Girona FC",3],["CA Osasuna",2],["Getafe CF",1],["Deportivo Alavés",1],
         ["RCD Mallorca",2],["UD Las Palmas",1],["Rayo Vallecano",2],["Cádiz CF",1],
         ["RCD Espanyol",2],["Real Valladolid",1],["Málaga CF",2],["Deportivo de La Coruña",2],["Racing de Santander",2]],
    SA: [["Inter de Milán",5],["AC Milan",5],["Juventus",5],["Nápoles",5],["AS Roma",4],["Lazio",4],
         ["Atalanta",4],["Fiorentina",3],["Torino",2],["Bologna",3],["Monza",1],["Udinese",2],
         ["Sassuolo",1],["Genoa",1],
         ["Sampdoria",1],["Parma",2],["Palermo",1],["Cagliari",2],["Empoli",1],["Lecce",1],["Verona",1]],
    BL: [["Bayern Múnich",5],["Borussia Dortmund",5],["Bayer Leverkusen",5],["RB Leipzig",4],
         ["Eintracht Frankfurt",3],["VfB Stuttgart",3],["VfL Wolfsburg",2],["SC Friburgo",2],
         ["Union Berlín",2],["Borussia Mönchengladbach",2],["Hoffenheim",2],["Mainz 05",1],["FC Colonia",1],
         ["Schalke 04",1],["Werder Bremen",2],["Hertha BSC",1],["Hamburger SV",1],["1. FC Nürnberg",1]],
    L1: [["Paris Saint-Germain",5],["Olympique de Marsella",4],["Olympique de Lyon",4],["AS Mónaco",4],
         ["LOSC Lille",3],["Stade Rennais",3],["OGC Niza",3],["RC Lens",3],["Estrasburgo",2],
         ["FC Nantes",2],["Montpellier",1],["Toulouse FC",1],
         ["Bordeaux",1],["Saint-Étienne",1],["Auxerre",1],["Le Havre",1],["Angers",1]],
    ERE: [["Ajax",4],["PSV Eindhoven",4],["Feyenoord",4],["AZ Alkmaar",3],["FC Twente",2],["FC Utrecht",2],
          ["Groningen",1],["Heerenveen",1],["NEC Nijmegen",1],["Sparta Rotterdam",1],["Go Ahead Eagles",1]],
    PRI: [["Benfica",4],["FC Porto",4],["Sporting CP",4],["Sporting Braga",3],["Vitória de Guimarães",2],
          ["Boavista",1],["Estoril Praia",1],["Famalicão",1],["Casa Pia",1]],
    BRA: [["Flamengo",4],["Palmeiras",4],["São Paulo FC",3],["Corinthians",3],["Grêmio",3],
          ["Internacional",3],["Fluminense",3],["Santos FC",2],["Atlético Mineiro",3],["Botafogo",3],
          ["Cruzeiro",3],["Bahia",2],["Fortaleza",2],["Vasco da Gama",3],["Athletico Paranaense",2],
          ["Goiás",1],["Ceará",1],["Sport Recife",1],["Coritiba",1],["Vitória",1]],
    MLS: [["Inter Miami CF",3],["LA Galaxy",2],["Los Angeles FC",3],["Seattle Sounders",2],["NYCFC",2],
          ["Atlanta United FC",3],["Columbus Crew",2],["Orlando City",2],["Portland Timbers",2],
          ["New York City FC",2],["New York Red Bulls",2],["Philadelphia Union",2],["FC Cincinnati",2]],
    SPL: [["Al-Hilal",4],["Al-Nassr",4],["Al-Ittihad",4],["Al-Ahli",3]],
    ARG: [["River Plate",4],["Boca Juniors",4],["Racing Club",3],["Independiente",2],["San Lorenzo",2],
          ["Estudiantes de La Plata",3],["Vélez Sarsfield",3],["Rosario Central",2],["Newell's Old Boys",2],
          ["Talleres",2],["Lanús",2],["Argentinos Juniors",2],["Huracán",1],["Banfield",1],
          ["Gimnasia La Plata",1],["Godoy Cruz",1],["Unión de Santa Fe",1],["Defensa y Justicia",2],["Platense",1]],
    MEX: [["Club América",3],["Chivas Guadalajara",3],["Cruz Azul",2],["Monterrey",3],["Tigres UANL",3],
          ["Pumas UNAM",2],["Toluca",2],["Santos Laguna",2],["Pachuca",2],["León",2],["Necaxa",1],
          ["Puebla",1],["Atlas",2],["Querétaro",1],["Mazatlán FC",1]],
    ESP2: [["Deportivo de La Coruña",2],["Málaga CF",2],["Real Zaragoza",2],["Sporting de Gijón",2],
           ["Real Oviedo",2],["Racing de Santander",2],["CD Tenerife",1],["Levante UD",2],["Granada CF",2],
           ["CD Leganés",1],["Elche CF",2],["Córdoba CF",1],["Albacete Balompié",1],["SD Eibar",2],
           ["Real Sociedad B",1],["Burgos CF",1],["CD Mirandés",1],["SD Huesca",1],["FC Andorra",1],
           ["CD Castellón",1],["AD Ceuta",1]],
    ENG2: [["Leeds United",3],["Sunderland",2],["Leicester City",3],["Middlesbrough",2],["Norwich City",2],
           ["Blackburn Rovers",2],["West Bromwich Albion",2],["Coventry City",2],["Millwall",1],
           ["Preston North End",1],["Bristol City",1],["Swansea City",2],["Queens Park Rangers",1],
           ["Plymouth Argyle",1],["Derby County",1],["Oxford United",1]],
    ITA2: [["Bari",1],["Brescia",1],["Cremonese",2],["Catanzaro",1],["Modena",1],["Spezia",1],
           ["Sampdoria B",1],["Cosenza",1],["Cittadella",1]],
    GER2: [["Fortuna Düsseldorf",1],["Hannover 96",2],["Karlsruher SC",1],["FC St. Pauli",2],
           ["Greuther Fürth",1],["SC Paderborn",1],["Darmstadt 98",1],["1. FC Kaiserslautern",1],["Elversberg",1]],
    FRA2: [["Ajaccio",1],["Grenoble Foot",1],["Guingamp",1],["Amiens SC",1],["Pau FC",1],["Rodez AF",1]],
    BEL: [["Club Brugge",4],["Anderlecht",4],["Genk",3],["Standard de Lieja",2],["Gante",3],
          ["Union Saint-Gilloise",3],["Charleroi",1],["Mechelen",1],["Kortrijk",1],["Cercle Brugge",1]],
    SCO: [["Celtic",4],["Rangers",4],["Aberdeen",2],["Hearts of Midlothian",2],["Hibernian",2],
          ["Dundee United",1],["Motherwell",1],["St Mirren",1],["Kilmarnock",1],["Ross County",1]],
    TUR: [["Galatasaray",4],["Fenerbahçe",4],["Beşiktaş",3],["Trabzonspor",3],["Başakşehir",2],
          ["Adana Demirspor",1],["Sivasspor",1],["Konyaspor",1],["Antalyaspor",1],["Kasımpaşa",1]],
    GRE: [["Olympiacos",4],["Panathinaikos",3],["AEK Atenas",3],["PAOK",3],["Aris Salónica",1],
          ["Asteras Tripolis",1],["OFI Creta",1]],
    UKR: [["Shakhtar Donetsk",4],["Dinamo de Kiev",3],["Dnipro-1",1],["Vorskla Poltava",1],["Zorya Luhansk",1]],
    SUI: [["Young Boys",3],["Basilea",3],["Servette",2],["Lugano",1],["Zúrich",1],["San Galo",1]],
    AUT: [["Red Bull Salzburgo",4],["Sturm Graz",2],["Rapid de Viena",2],["Austria de Viena",2],["LASK",1]],
    DEN: [["FC Copenhague",3],["Midtjylland",3],["Brøndby",2],["Nordsjælland",1],["Aarhus GF",1]],
    SWE: [["Malmö FF",3],["AIK",1],["Djurgårdens IF",1],["Hammarby",1],["IFK Göteborg",1]],
    NOR: [["Rosenborg",2],["Bodø/Glimt",3],["Molde",2],["Vålerenga",1],["Brann",1]],
    POL: [["Legia Varsovia",2],["Lech Poznan",2],["Raków Częstochowa",2],["Wisła Cracovia",1]],
    CZE: [["Sparta Praga",2],["Slavia Praga",3],["Viktoria Plzeň",2],["Baník Ostrava",1]],
    CRO: [["Dinamo Zagreb",3],["Hajduk Split",2],["Rijeka",1],["Osijek",1]],
    SRB: [["Estrella Roja",3],["Partizán de Belgrado",2],["Vojvodina",1]],
    ROU: [["FCSB",2],["CFR Cluj",2],["Universitatea Craiova",1],["Rapid Bucarest",1]],
    RUS: [["Zenit San Petersburgo",3],["Spartak Moscú",3],["CSKA Moscú",2],["Dinamo Moscú",2],["Krasnodar",2],["Lokomotiv Moscú",2]],
    URU: [["Peñarol",3],["Nacional",3],["Defensor Sporting",1],["Danubio",1],["Liverpool FC Uruguay",1]],
    CHI: [["Colo-Colo",3],["Universidad de Chile",3],["Universidad Católica",3],["Palestino",1],["Cobresal",1],["Huachipato",1]],
    COL: [["Atlético Nacional",3],["Millonarios",3],["América de Cali",3],["Independiente Santa Fe",2],
          ["Junior de Barranquilla",2],["Deportivo Cali",2],["Once Caldas",1],["Deportes Tolima",1]],
    ECU: [["Independiente del Valle",3],["LDU Quito",3],["Barcelona SC",3],["Emelec",2],["Aucas",1]],
    PAR: [["Olimpia",3],["Cerro Porteño",3],["Libertad",2],["Guaraní",1]],
    BOL: [["Bolívar",3],["The Strongest",3],["Always Ready",1],["Blooming",1]],
    PER: [["Sporting Cristal",3],["Alianza Lima",3],["Universitario de Deportes",3],["Melgar",1],["Cienciano",1]],
    VEN: [["Deportivo Táchira",1],["Caracas FC",1],["Monagas SC",1]],
    CRC: [["Saprissa",2],["LD Alajuelense",2],["Herediano",1],["Cartaginés",1]],
    JPN: [["Kashima Antlers",2],["Urawa Red Diamonds",2],["Yokohama F. Marinos",2],["Vissel Kobe",2],
          ["Kawasaki Frontale",2],["Gamba Osaka",1],["Cerezo Osaka",1],["FC Tokyo",1]],
    KOR: [["Ulsan HD",2],["Jeonbuk Hyundai Motors",2],["Pohang Steelers",1],["FC Seoul",1],["Daegu FC",1]],
    CHN: [["Shanghai Port",2],["Shanghai Shenhua",1],["Beijing Guoan",1],["Shandong Taishan",2]],
    AUS: [["Melbourne Victory",1],["Sydney FC",1],["Melbourne City",1],["Western Sydney Wanderers",1],["Central Coast Mariners",1]],
    EGY: [["Al Ahly",3],["Zamalek",3],["Pyramids FC",1],["Al Masry",1]],
    MAR: [["Wydad de Casablanca",2],["Raja de Casablanca",2],["FAR Rabat",1]],
    RSA: [["Mamelodi Sundowns",2],["Kaizer Chiefs",2],["Orlando Pirates",2]],
  };
  const clubs: Club[] = [];
  Object.entries(raw).forEach(([leagueKey, list]) => {
    list.forEach(([name, tier]) => {
      clubs.push({ name, tier, league: leagueKey, country: LEAGUES[leagueKey]?.country || "Desconocido" });
    });
  });
  return clubs;
}

export const CLUBS = buildClubs();

export const NATIONALITIES = [
  "España","Argentina","Brasil","Francia","Inglaterra","Portugal",
  "Alemania","Italia","Países Bajos","Croacia","Uruguay","Bélgica",
  "Colombia","México","Marruecos","Japón","Noruega","Senegal"
];

export const POSITIONS: PositionKey[] = ["POR","DEF","MED","EXT","DEL"];

export const POS_NAMES: Record<PositionKey, string> = {
  POR: "Portero",
  DEF: "Defensa",
  MED: "Centrocampista",
  EXT: "Extremo",
  DEL: "Delantero"
};

export const RATING_TIERS = [
  {min:9000, label:"LEYENDA ETERNA"},
  {min:6000, label:"LEYENDA"},
  {min:4000, label:"ESTRELLA MUNDIAL"},
  {min:2200, label:"GRAN JUGADOR"},
  {min:1000, label:"BUENA CARRERA"},
  {min:300,  label:"CARRERA NORMAL"},
  {min:-999999, label:"CARRERA FRUSTRADA"},
];

export const HUGE_TROPHIES = [
  "Champions League","Europa League","Conference League","Mundial de Clubes",
  "Copa Libertadores","Mundial","Eurocopa","Copa América","Copa Africana de Naciones",
  "Copa Asiática","Copa Oro","Eurocopa Sub-21"
];

export const MASTER_TROPHIES = [
  {name:"Balón de Oro", icon:"🏆"},
  {name:"Bota de Oro", icon:"👟"},
  {name:"Champions League", icon:"⭐"},
  {name:"Europa League", icon:"🟠"},
  {name:"Conference League", icon:"🟢"},
  {name:"Mundial de Clubes", icon:"🌍"},
  {name:"Premier League", icon:"🦁"},
  {name:"FA Cup", icon:"🏴"},
  {name:"La Liga", icon:"🐂"},
  {name:"Copa del Rey", icon:"👑"},
  {name:"Serie A", icon:"🇮🇹"},
  {name:"Coppa Italia", icon:"🍀"},
  {name:"Bundesliga", icon:"🦅"},
  {name:"DFB-Pokal", icon:"⚫"},
  {name:"Ligue 1", icon:"🐓"},
  {name:"Coupe de France", icon:"🔵"},
  {name:"Supercopa", icon:"⚡"},
  {name:"Mundial", icon:"🌐"},
  {name:"Eurocopa", icon:"🏅"},
  {name:"Copa América", icon:"🥇"},
  {name:"Copa Africana de Naciones", icon:"🌍"},
  {name:"Copa Asiática", icon:"🌏"},
  {name:"Copa Oro", icon:"🥉"},
  {name:"Eurocopa Sub-21", icon:"🎖️"},
];

export const NATION_INFO: Record<string, {conf: string, flag: string}> = {
  "España":{conf:"UEFA", flag:"🇪🇸"}, "Argentina":{conf:"CONMEBOL", flag:"🇦🇷"},
  "Brasil":{conf:"CONMEBOL", flag:"🇧🇷"}, "Francia":{conf:"UEFA", flag:"🇫🇷"},
  "Inglaterra":{conf:"UEFA", flag:"🏴"}, "Portugal":{conf:"UEFA", flag:"🇵🇹"},
  "Alemania":{conf:"UEFA", flag:"🇩🇪"}, "Italia":{conf:"UEFA", flag:"🇮🇹"},
  "Países Bajos":{conf:"UEFA", flag:"🇳🇱"}, "Croacia":{conf:"UEFA", flag:"🇭🇷"},
  "Uruguay":{conf:"CONMEBOL", flag:"🇺🇾"}, "Bélgica":{conf:"UEFA", flag:"🇧🇪"},
  "Colombia":{conf:"CONMEBOL", flag:"🇨🇴"}, "México":{conf:"CONCACAF", flag:"🇲🇽"},
  "Marruecos":{conf:"CAF", flag:"🇲🇦"}, "Japón":{conf:"AFC", flag:"🇯🇵"},
  "Noruega":{conf:"UEFA", flag:"🇳🇴"}, "Senegal":{conf:"CAF", flag:"🇸🇳"},
};

export const OPPONENTS_POOL = [
  "Alemania","Francia","Italia","Inglaterra","Brasil","Argentina",
  "Portugal","Países Bajos","Bélgica","Croacia","Marruecos","Japón",
  "México","Uruguay","Colombia","Senegal","Estados Unidos","Corea del Sur",
  "Nigeria","Ghana"
];

export const FLAGS: Record<string, string> = {
  "España":"🇪🇸","Argentina":"🇦🇷","Brasil":"🇧🇷","Francia":"🇫🇷","Inglaterra":"🏴",
  "Portugal":"🇵🇹","Alemania":"🇩🇪","Italia":"🇮🇹","Países Bajos":"🇳🇱","Bélgica":"🇧🇪",
  "Croacia":"🇭🇷","Uruguay":"🇺🇾","Colombia":"🇨🇴","México":"🇲🇽","Marruecos":"🇲🇦",
  "Japón":"🇯🇵","Noruega":"🇳🇴","Senegal":"🇸🇳","Estados Unidos":"🇺🇸","Corea del Sur":"🇰🇷",
  "Nigeria":"🇳🇬","Ghana":"🇬🇭",
};

export function flagOf(nation: string): string {
  return FLAGS[nation] || "🏳️";
}

export function fmtMoney(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1000) return sign + (abs / 1000).toFixed(2) + " Mrd€";
  return sign + abs.toFixed(abs % 1 === 0 ? 0 : 1) + " M€";
}

export function fmtSalary(n: number): string {
  return n.toFixed(n % 1 === 0 ? 0 : 1) + " M€/año";
}

export function calculateRealisticMarketValue(level: number, age: number, potential: number = 85): number {
  let baseValue = 0;
  if (level <= 60) {
    baseValue = 0.2 + (level - 50) * 0.12;
  } else if (level <= 70) {
    baseValue = 1.5 + (level - 60) * 0.65;
  } else if (level <= 75) {
    baseValue = 8.0 + (level - 70) * 2.8;
  } else if (level <= 80) {
    baseValue = 22.0 + (level - 75) * 4.6;
  } else if (level <= 85) {
    baseValue = 45.0 + (level - 80) * 7.0;
  } else if (level <= 88) {
    baseValue = 80.0 + (level - 85) * 8.33;
  } else if (level === 89) {
    baseValue = 115.0; // Garantizado > 100M€ para media 89
  } else if (level <= 92) {
    baseValue = 115.0 + (level - 89) * 20.0;
  } else {
    baseValue = 175.0 + (level - 92) * 25.0;
  }

  let ageMult = 1.0;
  if (age <= 21) ageMult = 1.25;
  else if (age <= 25) ageMult = 1.15;
  else if (age <= 28) ageMult = 1.05;
  else if (age <= 30) ageMult = 0.9;
  else if (age <= 32) ageMult = 0.7;
  else if (age <= 34) ageMult = 0.45;
  else ageMult = 0.25;

  if (age <= 23 && potential > level) {
    ageMult += (potential - level) * 0.015;
  }

  const finalValue = Math.max(0.1, baseValue * ageMult);
  return Math.round(finalValue * 10) / 10;
}

export function calculateRealisticSalary(marketValue: number, level: number): number {
  let baseSalary = 0;
  if (level >= 88) {
    baseSalary = 12.0 + (marketValue - 100) * 0.08;
  } else if (level >= 82) {
    baseSalary = 5.0 + (level - 82) * 1.1;
  } else if (level >= 75) {
    baseSalary = 1.8 + (level - 75) * 0.45;
  } else if (level >= 68) {
    baseSalary = 0.5 + (level - 68) * 0.18;
  } else {
    baseSalary = 0.1 + (level - 50) * 0.02;
  }
  return Math.max(0.05, Math.round(baseSalary * 10) / 10);
}

export function randomChance(probability: number): boolean {
  return Math.random() < probability;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
