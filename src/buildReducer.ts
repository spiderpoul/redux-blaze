import { Reducer, Dispatch, Action } from 'redux';

export type ReducerCur<TState, TPayload = any> = (payload: TPayload) => (state: TState) => TState;

export type ActionCreator<TPayload> = (payload: TPayload) => { type: string } & TPayload;
type GetActionCreator<TState, T> = T extends ReducerCur<TState, infer TPayload> ? ActionCreator<TPayload> : void;
export type ActionCreatorsSet<TState, T> = { [TName in keyof T]: GetActionCreator<TState, T[TName]> };

export interface Bundle<TState, TReducersSet> {
  reducer: Reducer<TState, any>;
  actionCreators: ActionCreatorsSet<TState, TReducersSet>;
  bind(dispatch: Dispatch<Action>): ActionCreatorsSet<TState, TReducersSet>;
}

export interface BuildReducerOptions {
  prefix?: string;
}

export function buildReducer<TState, TReducersSet>(
  initialState: TState,
  reducersSet: TReducersSet,
  options?: BuildReducerOptions
): Bundle<TState, TReducersSet> {
  const effectiveOptions: BuildReducerOptions = options || {};
  const reducers: Record<string, ReducerCur<TState>> = {};
  const actionCreators: any = {};
  const actionDispatchers: any = {};

  Object.keys(reducersSet).forEach((name: string) => {
    let type = name
      .replace(/(?:^|\.?)([A-Z])/g, (_, y) => {
        return '_' + y.toLowerCase();
      })
      .replace(/^_/, '')
      .toUpperCase();
    if (effectiveOptions.prefix) {
      type = effectiveOptions.prefix + '_' + type;
    }
    reducers[type] = (reducersSet as any)[name];
    actionCreators[name] = (payload: any) => ({ type, ...payload });
    actionDispatchers[name] = (dispatch: Dispatch<Action>) => (payload: any) => dispatch({ ...payload, type });
  });

  function reducer(state: any, action: any) {
    if (typeof state === 'undefined') {
      return initialState;
    }

    const reducerCar: ReducerCur<any, any> = (reducers as any)[action.type];
    const newState = reducerCar ? reducerCar(action)(state) : state;
    return newState;
  }

  function bind(dispatch: Dispatch<Action>) {
    const actionEmitters: any = {};
    Object.keys(actionDispatchers).forEach(key => (actionEmitters[key] = actionDispatchers[key](dispatch)));
    return actionEmitters;
  }

  return { reducer, actionCreators, bind };
}
