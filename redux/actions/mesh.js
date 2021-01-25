import axios from 'axios'

export const GET_MESH = Symbol('GET_MESH')
export const GET_MESH_SUCCESS = Symbol('GET_MESH_SUCCESS')

export function getMeshData () {
  return async dispatch => {
    dispatch({
      type: GET_MESH
    })

    const mesh = await axios.get('api/mesh')
    dispatch(onGetMesh(mesh))
  }
}

function onGetMesh (mesh) {
  return {
    type: GET_MESH_SUCCESS,
    payload: mesh
  }
}
