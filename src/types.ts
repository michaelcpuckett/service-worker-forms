export interface Todo {
  id: number;
  title: string;
}

export type ReferrerState = "GET_TODOS" | "ADD_TODO" | "DELETE_TODO";
