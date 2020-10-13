import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { Physics, usePlane, useBox, Api } from 'use-cannon'
import { Vector3 } from 'three'
import { Canvas, extend, useThree, useFrame, ReactThreeFiber } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'orbitControls': ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

const CameraControls = (): JSX.Element => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree()

  // Ref to the controls, so that we can update them on every frame with useFrame
  const controls = useRef<any>()
  useFrame(() => {
    if (controls.current) {
      controls.current.update()
    }
  })
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate={false}
      enableZoom={true}
    />
  )
}

const rand = (k: number): number => (Math.random() - 0.5) * 2 * k

type ApiType = Api[1]
type SetApiType = (id: string, api: ApiType) => void
type ApisType = Record<string, ApiType> // TODO

const Plane = (): JSX.Element => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[10, 10, 1]} />
      <shadowMaterial attach="material" color="#171717" />
    </mesh>
  )
}

function Cube(props: { id: string; position: Vector3; setApi: SetApiType }) {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [props.position.x, props.position.y, props.position.z],
    rotation: [0.4, 0.2, 0.5],
  }))

  useEffect(() => {
    props.setApi(props.id, api)
  }, [api, props])

  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  )
}

interface CubeData {
  id: string
  position: Vector3
}

const Scene = (props: {
  cubeData: CubeData[]
  setApi: SetApiType
}): JSX.Element => (
  <Canvas style={{ height: '80vh', width: '100%' }}>
    <CameraControls />
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Physics>
      <Plane />
      {props.cubeData.map(({ id, position }) => (
        <Cube id={id} position={position} setApi={props.setApi} />
      ))}
    </Physics>
  </Canvas>
)

const App = (): JSX.Element => {
  const [apis, setApis] = useState<ApisType>({})
  const setApi = (id: string, api: ApiType) => {
    setApis((apisCurrent) => ({
      ...apisCurrent,
      [id]: api,
    }))
  }

  const initialCubeData = Array.from({ length: 10 }, (x, i) => i).map((i) => ({
    id: String(i),
    position: new Vector3(i - 5, 5, -3),
  })) as CubeData[]

  const rollDice = (): void => {
    Object.entries(apis).forEach(([id, api]): void => {
      const { position } = initialCubeData.find((data) => data.id === id) || {}
      if (position) {
        api.position.set(position.x, position.y, position.z)
        api.velocity.set(rand(4), rand(4), rand(4))
      }
    })
  }

  return (
    <div className="App">
      <Scene cubeData={initialCubeData} setApi={setApi} />
      <button onClick={() => rollDice()}>roll all</button>
    </div>
  )
}

export default App
