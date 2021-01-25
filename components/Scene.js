import React, { Suspense } from 'react'
import { Canvas } from "react-three-fiber";
import { Mesh } from './Mesh'
import { Box } from './Box'

export const Scene = ({ meshData }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[-1, 0, 0]} />
      <Box position={[1, 0, 0]} />

      {meshData.map((mesh, index) => (
        <Suspense key={index} fallback={<></>}>
          <Mesh meshData={mesh} />
        </Suspense>
      ))}
    </Canvas>
  )
}
