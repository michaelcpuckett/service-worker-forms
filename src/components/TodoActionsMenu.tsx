import React from 'react';
import { Todo, Referrer } from '../types';
import { ReorderTodoUpForm } from './ReorderTodoUpForm';
import { ReorderTodoDownForm } from './ReorderTodoDownForm';
import {TriggerTodoEditForm} from './TriggerTodoEditForm';
import {DeleteTodoForm} from './DeleteTodoForm';

export function TodoActionsMenu(props: React.PropsWithChildren<{ todo: Todo; todos: Todo[]; filteredTodos: Todo[]; filteredIndex: number; index: number; referrer: Referrer; }>) {
  return (
  <details role="none">
    <summary
      id={`todos-actions-menu-trigger--${props.todo.id}`}
      aria-controls={`todos-actions-menu--${props.todo.id}`}
      role="button"
      aria-label="Actions"
      aria-haspopup="true"
      autoFocus={['REORDER_TODO_UP', 'REORDER_TODO_DOWN', 'EDIT_TODO', 'CLOSE_EDIT_TODO_DIALOG', 'CLOSE_CONFIRM_DELETE_TODO_DIALOG'].includes(props.referrer.state) && props.index === props.referrer.index}>
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    </summary>
    <div
      role="menu"
      id={`todos-actions-menu--${props.todo.id}`}
      aria-labelledby={`todos-actions-menu-trigger--${props.todo.id}`}>
      <ReorderTodoUpForm
        todo={props.todo}
        index={props.todos.findIndex((t) => t.id === props.filteredTodos[props.filteredIndex - 1]?.id)}
        isDisabled={!props.filteredTodos[props.filteredIndex - 1]}
        role="menuitem"
        tabindex={0}
      />
      <ReorderTodoDownForm
        todo={props.todo}
        index={props.todos.findIndex((t) => t.id === props.filteredTodos[props.filteredIndex + 1]?.id)}
        isDisabled={!props.filteredTodos[props.filteredIndex + 1]}
        role="menuitem"
        tabindex={-1}
      />
      <TriggerTodoEditForm
        todo={props.todo}
        index={props.index}
        role="menuitem"
        tabindex={-1}
      />
      <DeleteTodoForm
        todo={props.todo}
        index={props.index}
        role="menuitem"
        tabindex={-1}
      />
    </div>
  </details>
  );
}