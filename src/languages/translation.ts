export interface Translation {
  app: string;
  search: string;
  clearFilters: string;
  status: Status;
  planets: Planets;
  transactions: Transactions;
  users: Users;
  exchangeRate: string;
  opening: string;
  min: string;
  max: string;
}

export interface Status {
  completed: string;
  inProgress: string;
  blocked: string;
}

export interface Planets {
  title: string;
  nav: string;
  noResults: string;
  resultAmount: string;
  totalResidents: string;
  selectClimate: string;
  selectTerrain: string;
  table: Table;
}

export interface Table {
  name: string;
  residents: string;
  population: string;
  climate: string;
  terrain: string;
  gravity: string;
  diameter: string;
  rotationPeriod: string;
  orbitalPeriod: string;
  surfaceWater: string;
  films: string;
}

export interface Transactions {
  title: string;
  nav: string;
  blockInProgress: string;
  noResults: string;
  resultAmount: string;
  selectCurrency: string;
  selectStatus: string;
  totalTransactions: string;
  table: Table2;
}

export interface Table2 {
  id: string;
  from: string;
  amount: string;
  currency: string;
  conversion: string;
  date: string;
  status: string;
}

export interface Users {
  title: string;
  nav: string;
  noResults: string;
  resultAmount: string;
  table: Table3;
}

export interface Table3 {
  name: string;
  gender: string;
  birthYear: string;
  homeworld: string;
  height: string;
  mass: string;
  hairColor: string;
  skinColor: string;
  eyeColor: string;
}
