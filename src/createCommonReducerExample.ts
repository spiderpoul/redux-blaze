import { ReducerCur, buildReducer } from "src";
import { Dispatch, combineReducers } from "redux";

export function createCommonReducer<TState, TModel>(arg: { initialState: TState; prefix: string }) {
  const { initialState, prefix } = arg;
  type Reducer<TPayload> = ReducerCur<TState, TPayload>;

  const loadRequest: Reducer<{}> = () => s => ({ ...s, isLoading: true });

  const loadSuccess: Reducer<{ data: TModel }> = ({ data }) => s => ({
    ...s,
    model: data,
    isLoading: false,
    error: false
  });

  const loadError: Reducer<{ error: any }> = ({ error }) => s => ({
    ...s,
    error,
    isLoading: false
  });

  const bundle = buildReducer(
    initialState,
    {
      loadRequest,
      loadSuccess,
      loadError
    },
    { prefix }
  );

  return {
    bindActions: bundle.bind,
    reducer: bundle.reducer
  };
}

interface ItemModel {
  name: string;
  id: string;
}

interface AppState {
  error: null,
  isLoading: false,
  model: ItemModel | null;
}

const initialState: AppState = {
  error: null,
  isLoading: false,
  model: null
};

export const appReduxBlaze = createCommonReducer<AppState, ItemModel>({
  initialState,
  prefix: 'APP'
});

// mock dispatch
const dispatch: Dispatch<any> = (action) => action;

const bindActions = appReduxBlaze.bindActions(dispatch);

try {
  bindActions.loadRequest({});
  const res = await fetch('/api/data');

  bindActions.loadSuccess({data: res.json()});
} catch (e) {
  bindActions.loadError({error: e});
}






export const rootReducer = combineReducers({
  app: appReduxBlaze.reducer
});
