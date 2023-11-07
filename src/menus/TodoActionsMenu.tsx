import React from 'react';
import { Todo, Referrer } from '../types';
import { ReorderTodoUpForm } from '../forms/ReorderTodoUpForm';
import { ReorderTodoDownForm } from '../forms/ReorderTodoDownForm';
import {TriggerTodoEditForm} from '../forms/TriggerTodoEditForm';
import {DeleteTodoForm} from '../forms/DeleteTodoForm';

export function TodoActionsMenu(props: React.PropsWithChildren<{ todo: Todo; todos: Todo[]; filteredTodos: Todo[]; filteredIndex: number; index: number; referrer: Referrer; }>) {
  return (
  <details role="none">
    <summary
      id={`todos-actions-menu-trigger--${props.todo.id}`}
      aria-controls={`todos-actions-menu--${props.todo.id}`}
      role="button"
      aria-label={`Actions for ${props.todo.title}`}
      aria-haspopup="true"
      autoFocus={['REORDER_TODO_UP', 'REORDER_TODO_DOWN', 'EDIT_TODO', 'CLOSE_EDIT_TODO_DIALOG', 'CLOSE_CONFIRM_DELETE_TODO_DIALOG'].includes(props.referrer.state) && props.index === props.referrer.index}>
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="0 0 16 16">
        <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#dots-vertical'></use>
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