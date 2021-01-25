import * as ActionType from '../actions/mesh'

export const initialState = {
  isLoading: false,
  data: []
}

export default function meshReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.GET_MESH:
      return {
        ...state,
        isLoading: true
      }

    case ActionType.GET_MESH_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isLoading: false
      }

    default:
      return state
  }
}
