export interface Translation {
  app: string;
  search: string;
  clearFilters: string;
  planets: Planets;
  users: Users;
  exchangeRate: string;
  opening: string;
  min: string;
  max: string;
}

export interface Planets {
  title: string;
  nav: string;
  noResults: string;
  resultAmount: string;
  table: Table;
}

export interface Table {
  name: string;
  residents: string;
  population: string;
  climate: string;
  terrain: string;
}

export interface Users {
  title: string;
  nav: string;
}
