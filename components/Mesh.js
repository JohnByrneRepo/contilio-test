import React, { Suspense, useEffect, useRef, useState } from "react";
import { useFrame, useLoader, useUpdate, useThree, extend } from "react-three-fiber";
import * as THREE from 'three';
var STLLoader = require('three-stl-loader')(THREE)


export const Mesh = ({ meshData }) => {
  const {
    camera,
    gl: { domElement }
  } = useThree()

  const [mesh, setMesh] = useState({})

  function loadMeshSTL(geometry, color) {
    let material = new THREE.MeshStandardMaterial({
      color: color
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiplyScalar(0.2);
    mesh.rotation.x = - Math.PI / 2;
    const geo = new THREE.EdgesGeometry(mesh.geometry);
    const mat = new THREE.LineBasicMaterial({ color: 0x222, linewidth: 2 });
    const wireframe = new THREE.LineSegments(geo, mat);
    mesh.add(wireframe);
    setMesh(wireframe)
  }

  useEffect(() => {
    var loader = new STLLoader();
    loader.load(`/mesh/${meshData.Guid}.stl`, function (geometry) {
      geometry.name = `<b>Name:</b>${meshData.Name} <b>State:</b>${meshData.State} <b>Guid:</b>${meshData.Guid}`;
      loadMeshSTL(geometry, 0x505050)
    })
  }, [])

  return (
    <>
    <mesh {...mesh} />
    </>
  )
};
