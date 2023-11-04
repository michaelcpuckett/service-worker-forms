export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

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
