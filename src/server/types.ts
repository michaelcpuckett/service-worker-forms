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

export interface Database {
  id: number;
  type: "checklist" | "table" | "list" | "calendar" | "board" | "timeline";
  name: string;
  properties: Property[];
  rows: Row[];
}

export interface Checklist extends Database {
  type: "checklist";
}

export interface Table extends Database {
  type: "table";
}

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
  completed?: boolean;
} & DynamicPropertyKeyValuePair<Property[]>;

export interface ChecklistRow extends Row {
  completed: boolean;
}

export interface TableRow extends Row {
  completed?: never;
}
