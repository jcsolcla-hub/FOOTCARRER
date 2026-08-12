export type PositionKey = "POR" | "DEF" | "MED" | "EXT" | "DEL";

export interface TrophyCount {
  [name: string]: number;
}

export interface PlayerFlags {
  firstTitleLogged: boolean;
  firstBallonLogged: boolean;
  declineLogged: boolean;
  maxValueLogged: boolean;
}

export interface TimelineEvent {
  age: number;
  text: string;
}

export interface CareerLogEntry {
  title: string;
  text: string;
}

export interface BestSeason {
  label: string;
  club: string;
  matches: number;
  goals: number;
  assists: number;
  titles: string[];
  awards: string[];
  score: number;
  peakLevelInSeason?: number;
  avgRating?: number;
}

export interface Player {
  name: string;
  nationality: string;
  age: number;
  position: PositionKey;
  club: string;
  level: number;
  maxLevel?: number;
  potential: number;
  marketValue: number;
  salary: number;
  money: number;
  goals: number;
  assists: number;
  matches: number;
  titles: number;
  ballonsDor: number;
  goldenBoots: number;
  individualAwards: number;
  trophiesList: TrophyCount;
  season: number;
  seasonYearStart: number;
  debutAge: number;
  clubsHistory: string[];
  maxMarketValue: number;
  maxSalary: number;
  totalMoneyEarned: number;
  injuredMatchesLost: number;
  caps: number;
  bestSeason: BestSeason | null;
  retired: boolean;
  sponsor: string | null;
  log: CareerLogEntry[];
  timeline: TimelineEvent[];
  score: number;
  flags: PlayerFlags;
}

export interface CareerState {
  player: Player;
  meta: {
    clubTier: number;
  };
  activeSeason?: ActiveSeasonState | null;
}

export interface Club {
  name: string;
  tier: number;
  league: string;
  country: string;
}

export interface League {
  title: string;
  cup: string;
  country: string;
  continental: boolean;
}

export interface MoneyEvent {
  label: string;
  amount: number;
}

export interface TopTeam {
  rank: number;
  name: string;
  reason: string;
  isUser: boolean;
}

export interface TopPlayer {
  rank: number;
  name: string;
  club: string;
  stats: string;
  award?: string;
  isUser: boolean;
}

export interface AwardWinner {
  name: string;
  club: string;
  stats: string;
  isUser: boolean;
}

export interface GalaAwards {
  ballonDor: AwardWinner;
  goldenBoot: AwardWinner;
  bestGoalkeeper: AwardWinner;
}

export interface ChampionsOverview {
  championsLeague: string;
  leagueTitle: string;
  leagueName: string;
  clubWorldCup: string;
  top3Teams?: TopTeam[];
  top3Players?: TopPlayer[];
  galaAwards?: GalaAwards;
}

export interface SeasonSummary {
  year: string;
  age: number;
  club: string;
  matches: number;
  goals: number;
  assists: number;
  avgRating: number;
  wonTitles: string[];
  awards: string[];
  valueFrom: number;
  valueTo: number;
  salaryFrom: number;
  salaryTo: number;
  levelFrom: number;
  levelTo: number;
  moneyEvents: MoneyEvent[];
  injuryText: string | null;
  nationalText: string | null;
  narration: string;
  perfTier: string;
  ballonWon: boolean;
  botaWon: boolean;
  championsOverview?: ChampionsOverview;
}

export interface GroupStanding {
  team: string;
  pts: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  isPlayer: boolean;
}

export interface PlayerMatch {
  opp: string;
  gf: number;
  ga: number;
  role: "titular" | "suplente" | "no participa";
}

export interface GroupResult {
  standings: GroupStanding[];
  playerMatches: PlayerMatch[];
  position: number;
  advanced: boolean;
}

export interface Tournament {
  name: string;
  scope: string;
  stages: string[];
}

export interface Offer {
  club: Club;
  salary: number;
  years: number;
  contractValue: number;
  isScoutInterest?: boolean;
  scoutText?: string;
}

export interface PressOption {
  text: string;
  effectText: string;
  statBonus?: {
    levelDelta?: number;
    moneyDelta?: number;
    scoreDelta?: number;
  };
}

export interface PressQuestion {
  id: string;
  category: "Prensa" | "Vestuario" | "Patrocinio" | "Afición" | "Mercado" | "Entrevista" | "Gestión" | "Finanzas" | "Equipación" | "Staff" | "Agente" | "Inversiones";
  question: string;
  reporter?: string;
  options: PressOption[];
}

export type TrainingDrillType = 
  | "velocidad" 
  | "tiro" 
  | "regate" 
  | "pase" 
  | "defensa" 
  | "fisico" 
  | "resistencia" 
  | "tecnica" 
  | "equilibrado";

export type SquadRole = "Suplente" | "Rotación" | "Titular" | "Jugador Importante" | "Estrella";

export interface PlayerAttributes {
  velocidad: number;
  tiro: number;
  regate: number;
  pase: number;
  defensa: number;
  fisico: number;
  resistencia: number;
  tecnica: number;
}

export interface SeasonMatchResult {
  homeGoals: number;
  awayGoals: number;
  playerGoals: number;
  playerAssists: number;
  playerRating: number;
  playerMinutes: number;
  wasSimulated: boolean;
  matchHighlights?: string[];
}

export interface SeasonMatchFixture {
  id: number;
  week: number;
  dateLabel: string;
  competition: "Liga" | "Copa" | "Champions" | "Amistoso";
  jornadaName: string;
  opponent: string;
  isHome: boolean;
  importance: "Baja" | "Media" | "Alta" | "Crucial";
  played: boolean;
  result?: SeasonMatchResult;
}

export interface SeasonObjective {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardText: string;
  completed: boolean;
  rewardClaimed?: boolean;
}

export interface LeagueTableTeam {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
  isUser: boolean;
}

export interface ScorerEntry {
  name: string;
  club: string;
  goals: number;
  assists: number;
  isUser: boolean;
}

export interface MatchEventChoice {
  text: string;
  statReq: keyof PlayerAttributes | "energy";
  minStatVal?: number;
  outcomeSuccess: { text: string; goalDelta: number; assistDelta: number; ratingDelta: number };
  outcomeFail: { text: string; goalDelta: number; assistDelta: number; ratingDelta: number };
}

export interface MatchKeyMoment {
  id: string;
  minute: number;
  title: string;
  description: string;
  choices: MatchEventChoice[];
}

export interface CareerEventOption {
  id: string;
  badgeText: string;
  text: string;
  detail: string;
  effectText: string;
  type: "starter" | "bench" | "extra_training" | "rest" | "tactics" | "captain" | "vestuario" | "press" | "renewal" | "custom";
}

export interface CareerDecisionEvent {
  id: string;
  category: "Míster" | "Vestuario" | "Entrenamiento" | "Carrera" | "Prensa" | "Especial";
  speakerTitle: string;
  speakerIcon: string;
  title: string;
  quote: string;
  contextInfo?: string;
  options: CareerEventOption[];
}

export interface ActiveSeasonState {
  yearLabel: string;
  currentFixtureIndex: number;
  energy: number; // 0 - 100
  fatigue: number; // 0 - 100
  morale: number; // 0 - 100
  coachTrust: number; // 0 - 100
  confidence: number; // 0 - 100
  form: number; // 0 - 100
  lockerRoomRel: number; // 0 - 100
  reputation: number; // 0 - 100
  squadRole: SquadRole;
  attributes: PlayerAttributes;
  attributeXP: Record<keyof PlayerAttributes, number>;
  yellowCards: number;
  redCards: number;
  suspendedMatches: number;
  injury: { matchesLeft: number; title: string } | null;
  seasonGoals: number;
  seasonAssists: number;
  seasonMatches: number;
  seasonMinutes: number;
  seasonRatings: number[];
  fixtures: SeasonMatchFixture[];
  standings: LeagueTableTeam[];
  topScorers: ScorerEntry[];
  objectives: SeasonObjective[];
  recentEventsLog: string[];
  recentNews?: string[];
  pendingEvent?: CareerDecisionEvent | null;
}


