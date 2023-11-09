export type Referrer = {
  state: string;
  url: string;
  filter?: string;
  index?: number;
  query?: string;
};

export interface Settings {
  theme: string;
}

export type Database = {
  id: number;
  type: "checklist";
  name: string;
  properties: Property[];
  rows: Row[];
};

export type Property = {
  id: number;
  databaseId: number;
  type:
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | Array<StringConstructor | NumberConstructor | BooleanConstructor>;
  name: string;
  index: number;
};

type DynamicPropertyKeyValuePair<P extends Property[]> = {
  [K in P[number]["id"]]: P[number]["type"];
};

export type Row = {
  id: number;
  databaseId: number;
  title: string;
  completed: boolean;
} & DynamicPropertyKeyValuePair<Property[]>;
