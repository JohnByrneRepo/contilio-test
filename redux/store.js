import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'

import meshReducer from './reducers/mesh'

const makeStore = context => createStore(meshReducer, applyMiddleware(thunk))

export const wrapper = createWrapper(makeStore, { debug: true })
