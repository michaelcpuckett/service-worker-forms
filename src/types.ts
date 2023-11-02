export interface Todo {
  id: number;
  title: string;
}

export type ReferrerState =
  | "GET_TODOS"
  | "ADD_TODO"
  | "DELETE_TODO"
  | "EDIT_TODO";

export type Referrer = {
  state: ReferrerState;
  index?: number;
};
