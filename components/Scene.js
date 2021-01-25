import React from 'react'
import * as THREE from 'three'
var STLLoader = require('three-stl-loader')(THREE)

export const Scene = ({ meshData }) => {
  const { useRef, useEffect, useState } = React
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(true)
  var visibleObjects = [], invisibleObjects = [];

  function loadMeshSTL(geometry, color, scene) {
    let material = new THREE.MeshStandardMaterial({
      color: color
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiplyScalar(0.2);
    mesh.rotation.x = - Math.PI / 2;
    const geo = new THREE.EdgesGeometry(mesh.geometry);
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const wireframe = new THREE.LineSegments(geo, mat);
    mesh.add(wireframe);
    scene.add(mesh);
    visibleObjects.push(mesh);
  }

  function addShadowedLight(x, y, z, color, intensity, scene) {
    const d = 1;
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.bias = - 0.001;
  }

  useEffect(async () => {
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const cube = new THREE.Mesh(geometry, material)
    const loader = new STLLoader();
    let controls, cameraTarget

    camera.position.z = 4
    scene.add(cube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    meshData.forEach(mesh => {
      loader.load(`/mesh/${mesh.Guid}.stl`, function (geometry) {
        geometry.name = `<b>Name:</b>${mesh.Name} <b>State:</b>${mesh.State} <b>Guid:</b>${mesh.Guid}`;
        loadMeshSTL(geometry, 0x505050, scene)
      })
    })

    scene.add(new THREE.AmbientLight(0x808080));
    addShadowedLight(1, 1, 1, 0xffffff, 1.35, scene);

    // let TrackballControls = await axios.get('https://cdn.jsdelivr.net/npm/three-trackballcontrols@0.9.0/index.min.js')
    // controls = new THREE.TrackballControls(camera, renderer.domElement);
    // controls.rotateSpeed = 2.0;
    // controls.zoomSpeed = 0.3;
    // controls.panSpeed = 0.2;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;
    // controls.minDistance = 0.3;
    // controls.maxDistance = 0.3 * 100;

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = mount.current.clientWidth
      height = mount.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderScene()
    }
    
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = null
    }

    mount.current.appendChild(renderer.domElement)
    window.addEventListener('resize', handleResize)
    start()

    // controls.current = { start, stop }
    
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      mount.current.removeChild(renderer.domElement)

      scene.remove(cube)
      geometry.dispose()
      material.dispose()
    }
  }, [])

  
  return <div className="vis" ref={mount} onClick={() => setAnimating(!isAnimating)} />
}
