# redux-blaze

**Generate actions and reducer with one function!** 😍

`redux` is cool, it's easy to understand and use. But work with `redux` can be sometimes routine, **a lot of boilerplate**😭, you need to create a bunch of actions and then reducer with annoying `switch case` construction. It could be disappointing for developers who using `redux`. 😔

With `redux-blaze` you just need to describe **one function** 😍 *(set payload and show how it change store)* and you get `actionCreators` and `reducer`👏, strictly typed 💪 *(for TypeScript)*  and ready to use.

## Installation

```
  npm i redux-blaze
```

or

```
  yarn add redux-blaze
```

## Usage

Check out example:

```js
import { buildReducer } from "redux-blaze";
import { combineReducers } from 'redux'

export const { actionCreators, reducer: filtersReducer } = buildReducer(initialState, {
    setMySearch: ({ search }) /* <- payload */ => state => ({ ...state, search }),
    setCategory: ({ category }) => state => ({ ...state, category }),
    setSort: ({ sort }) => state => ({ ...state, sort }),
}, {
    prefix: 'MY_FILTER',
});

...

// Just add auto generated reducer to root reducer:
export const rootReducer = combineReducers({
  filters: filtersReducer
})

...

// dispatch action:
dispatch(actionCreators.setCategory({category: 'my category'})) // it will dispatch action `MY_FILTER_SET_CATEGORY` (prefix + function name)

```

**That's all!** No extra line of code! No more boilerplate! 😎

[>> Checkout more detailed TypeScript example](./typescript_example.md) 🤗

## Special thanks

Huge thanks for initial idea and inspiration to [Yakov Zhmurov](https://github.com/jakobz).
