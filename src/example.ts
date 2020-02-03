import { buildReducer } from "src";
import { combineReducers } from "redux";

  interface ToDoState {
    todos: string[];
  }

  type ReducerFunc<TPayload> = (payload: TPayload) => (state: ToDoState) => ToDoState;;

  const initialState: ToDoState = {
    todos: []
  }

  const addTodo: ReducerFunc<{ todo: string }> = ({ todo }) => s => ({
    ...s,
    todos: [...s.todos, todo]
  });

  const removeTodo: ReducerFunc<{ todo: string }> = ({ todo }) => s => ({
    ...s,
    todos: s.todos.filter(x => x !== todo)
  });

const reduxBlaze = buildReducer(
    initialState,
    {
      addTodo,
      removeTodo,
    },
    { prefix: 'TODO' }
  );

export const rootReducer = combineReducers({
  todos: reduxBlaze.reducer
});

reduxBlaze.actionCreators.addTodo({todo: 'Install redux-blaze'})