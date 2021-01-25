import React from 'react'
import * as THREE from 'three'
var STLLoader = require('three-stl-loader')(THREE)

export const Scene = ({ meshData }) => {
  const { useRef, useEffect, useState } = React
  const mount = useRef(null)
  const [info, setInfo] = useState('')
  var visibleObjects = [], invisibleObjects = []

  function loadMeshSTL(geometry, color, scene) {
    let material = new THREE.MeshStandardMaterial({
      color: color
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.scale.multiplyScalar(0.2)
    mesh.rotation.x = - Math.PI / 2
    const geo = new THREE.EdgesGeometry(mesh.geometry)
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    const wireframe = new THREE.LineSegments(geo, mat)
    mesh.add(wireframe)
    scene.add(mesh)
    visibleObjects.push(mesh)
  }

  function addShadowedLight(x, y, z, color, intensity, scene) {
    const d = 1
    const directionalLight = new THREE.DirectionalLight(color, intensity)
    directionalLight.position.set(x, y, z)
    scene.add(directionalLight)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = - d
    directionalLight.shadow.camera.right = d
    directionalLight.shadow.camera.top = d
    directionalLight.shadow.camera.bottom = - d
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 4
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.bias = - 0.001
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
    const loader = new STLLoader()
    let controls
    let mouse = new THREE.Vector2(), INTERSECTED
    let raycaster = new THREE.Raycaster()

    camera.position.y = 4
    camera.position.z = 4
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    let cameraTarget = new THREE.Vector3(0, - 0.1, 0);
    camera.lookAt(cameraTarget);

    meshData.forEach(mesh => {
      loader.load(`/mesh/${mesh.Guid}.stl`, function (geometry) {
        geometry.name = `Name: ${mesh.Name} State: ${mesh.State} Guid: ${mesh.Guid}`
        let color = ''
        switch (mesh.State) {
          case 'ok': color = 0x505050; break;
          case 'out-of-tolerance': color = 0xb2b236; break;
          case 'missing': color = 0xdd3333; break;
        }
        loadMeshSTL(geometry, color, scene)
        // loadMeshSTL(geometry, 0x505050, scene)
      })
    })

    scene.add(new THREE.AmbientLight(0x808080))

    addShadowedLight(1, 1, 1, 0xffffff, 1.35, scene)

    let dynamicallyImportPackage = async () => {
      let TrackballControls
      await import('three/examples/jsm/controls/TrackballControls')
        .then(module => {
          TrackballControls = module.TrackballControls
        })
        .catch(e => console.log(e))
      return TrackballControls
    }
    let TrackballControls = await dynamicallyImportPackage()

    controls = new TrackballControls(camera, renderer.domElement)
    controls.rotateSpeed = 2.0
    controls.zoomSpeed = 0.3
    controls.panSpeed = 0.2
    controls.noZoom = false
    controls.noPan = false
    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3
    controls.minDistance = 0.3
    controls.maxDistance = 0.3 * 100

    const onDocumentMouseMove = (event) => {
      event.preventDefault()
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    }

    const keyboard = (ev) => {
      switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {
        case 'h':
          if (INTERSECTED) {
            INTERSECTED.material.visible = false
            INTERSECTED.material.needsUpdate = true

            // remove from visible objects
            var idx = visibleObjects.indexOf(INTERSECTED)
            if (idx >= 0) {
              visibleObjects.splice(idx, 1)

              // add to invisible objects
              invisibleObjects.push(INTERSECTED)
            }
          }
          break

        case 'r':
          invisibleObjects.forEach(function (item, idx) {
            item.material.visible = true
            item.material.needsUpdate = true
          })
          visibleObjects = visibleObjects.concat(invisibleObjects)
          invisibleObjects = []
          break
      }
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      controls.handleResize();
    }

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()

      // update the picking ray with the camera and mouse position
      // mouse.y -= 140
      raycaster.setFromCamera(mouse, camera)

      // calculate objects intersecting the picking ray

      var intersects = raycaster.intersectObjects(visibleObjects)

      if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
          if (INTERSECTED) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
          }
          INTERSECTED = intersects[0].object
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
          INTERSECTED.material.emissive.setHex(0x808080)
          setInfo(INTERSECTED.geometry.name)
        }
      } else {
        if (INTERSECTED) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
          INTERSECTED = null
          setInfo('')
        }
      }

      renderer.render(scene, camera)
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
    window.addEventListener('mousemove', onDocumentMouseMove, false)
    window.addEventListener('keypress', keyboard)

    handleResize()

    start()

    // controls.current = { start, stop }

    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onDocumentMouseMove)
      window.removeEventListener('keypress', keyboard)
      mount.current.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
    }
  }, [])


  return <div>
    <div className="mesh-info">{info}</div>
    <div className="vis" ref={mount} />
  </div>
}
