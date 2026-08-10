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
  category: "Prensa" | "Vestuario" | "Patrocinio" | "Afición" | "Mercado" | "Entrevista";
  question: string;
  reporter?: string;
  options: PressOption[];
}

