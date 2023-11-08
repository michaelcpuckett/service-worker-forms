import React from 'react';
import { Todo, Referrer } from '../types';
import { FlyoutMenu } from './FlyoutMenu';
import { ReorderTodoUpForm } from '../forms/ReorderTodoUpForm';
import { ReorderTodoDownForm } from '../forms/ReorderTodoDownForm';
import {TriggerTodoEditForm} from '../forms/TriggerTodoEditForm';
import {DeleteTodoForm} from '../forms/DeleteTodoForm';

export function TodoActionsMenu(props: React.PropsWithChildren<{ todo: Todo; todos: Todo[]; filteredTodos: Todo[]; filteredIndex: number; index: number; referrer: Referrer; }>) {
  return (
    <flyout-menu>
      <template shadowrootmode="open">
        <link rel="stylesheet" href="/flyout-menu.css" />
        <FlyoutMenu
          id={`${props.todo.id}`}
          label={props.todo.title}
          autofocus={['REORDER_TODO_UP', 'REORDER_TODO_DOWN', 'EDIT_TODO', 'CLOSE_EDIT_TODO_DIALOG', 'CLOSE_CONFIRM_DELETE_TODO_DIALOG'].includes(props.referrer.state) && props.index === props.referrer.index}
        />
      </template>

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
    </flyout-menu>
  );
}