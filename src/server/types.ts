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

export type Property = {
  id: number;
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

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
} & DynamicPropertyKeyValuePair<Property[]>;
