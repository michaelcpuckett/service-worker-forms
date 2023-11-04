export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export type Referrer = {
  state: string;
  filter?: string;
  index?: number;
};

export interface Settings {
  theme: string;
}
