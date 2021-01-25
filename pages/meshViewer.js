import { React, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMeshData } from '../redux/actions/mesh'
import { Scene } from '../components/Scene'

export const MeshViewer = () => {
  const [meshPaths, setMeshPaths] = useState([])

  const meshData = useSelector((state) => {
    return state.data
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMeshData())
  }, [dispatch]);

  return <div>
    {meshData.length && <Scene meshData={meshData} />}
  </div>
}
