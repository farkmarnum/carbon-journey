import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { Physics, usePlane, useBox, Api } from 'use-cannon'
import { Vector3 } from 'three'
import {
  Canvas,
  useThree,
  useFrame,
  extend,
  // eslint-disable-next-line
  ReactThreeFiber,
} from 'react-three-fiber'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

type orbitControlsType = ReactThreeFiber.Object3DNode<
  OrbitControls,
  typeof OrbitControls
>

const CameraControls = (): JSX.Element => {
  const {
    camera,
    gl: { domElement },
  } = useThree()

  const controls = useRef<orbitControlsType>()
  useFrame(() => {
    if (controls.current?.update) {
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

const range = (n: number): number[] => Array.from({ length: n }, (x, i) => i)
const rand = (k: number): number => (Math.random() - 0.5) * 2 * k
const randPlusMinusOne = (): 1 | -1 => (Math.random() > 0.5 ? 1 : -1)

const generatePhysicsProps = () => ({
  angularVelocity: new Vector3(
    rand(4) * Math.PI,
    rand(4) * Math.PI,
    rand(4) * Math.PI,
  ),
  velocity: new Vector3(randPlusMinusOne() * (rand(5) + 5), -10, 10),
  rotation: new Vector3(rand(Math.PI), rand(Math.PI), rand(Math.PI)),
  position: new Vector3(rand(2) + 2, 10, rand(2) + 2),
})

type ApiType = Api[1]
type SetApiType = (id: string, api: ApiType) => void
type ApisType = Record<string, ApiType>

const Cube = ({
  id,
  setApi,
}: {
  id: string
  setApi: SetApiType
}): JSX.Element => {
  const {
    velocity,
    angularVelocity,
    rotation,
    position,
  } = generatePhysicsProps()

  const [ref, api] = useBox(() => ({
    mass: 5,
    args: [2.5, 2.5, 2.5],
    position: [position.x, position.y, position.z],
    rotation: [rotation.x, rotation.y, rotation.z],
    velocity: [velocity.x, velocity.y, velocity.z],
    angularVelocity: [angularVelocity.x, angularVelocity.y, angularVelocity.z],
  }))

  useEffect(() => {
    setApi(id, api)
  }, [id, setApi, api])

  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" args={[2.5, 2.5, 2.5]} />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  )
}

const LENGTH = 10
const WALL_ARGS = [100, 100, 0.1]
const MESH_WALL_ARGS = WALL_ARGS as [
  number | 
  number | 
  number | 
  number | 
  number | 
  number
]

const Planes = () => {
  const [groundRef] = usePlane(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }))

  const [backWallRef] = useBox(() => ({
    position: [0, 0, -LENGTH],
    args: WALL_ARGS,
  }))

  const [leftWallRef] = useBox(() => ({
    args: WALL_ARGS,
    position: [-LENGTH, 0, 0],
    rotation: [-Math.PI / 2, -Math.PI / 2, 0],
  }))

  const [rightWallRef] = useBox(() => ({
    args: WALL_ARGS,
    position: [LENGTH, 0, 0],
    rotation: [-Math.PI / 2, -Math.PI / 2, 0],
  }))

  const [frontWallRef] = useBox(() => ({
    args: WALL_ARGS,
    position: [0, 0, LENGTH],
  }))

  return (
    <>
      <mesh ref={groundRef} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[100, 100]} />
        <meshLambertMaterial attach="material" color="grey" />
      </mesh>

      <mesh ref={backWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshLambertMaterial attach="material" color="blue" />
      </mesh>

      <mesh ref={leftWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshLambertMaterial attach="material" color="blue" />
      </mesh>

      <mesh ref={rightWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshLambertMaterial attach="material" color="blue" />
      </mesh>

      <mesh ref={frontWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshLambertMaterial attach="material" color="blue" />
      </mesh>
    </>
  )
}

const Scene = (props: {
  numberOfDice: number
  setApi: SetApiType
}): JSX.Element => (
  <Canvas
    style={{ height: '80vh', width: '100%' }}
    camera={{ position: [0, 20, 20], rotation: [-0.27, 0, 0] }}
    shadowMap
  >
    <axesHelper />
    <CameraControls />
    <ambientLight />
    <pointLight position={[10, 10, 10]} intensity={0.75} castShadow />
    <Physics>
      {range(props.numberOfDice).map((_, i) => (
        <Cube key={i} id={String(i)} setApi={props.setApi} />
      ))}
      <Planes />
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

  const rollDice = (): void => {
    Object.entries(apis).forEach(([id, api]): void => {
      const {
        velocity,
        angularVelocity,
        rotation,
        position,
      } = generatePhysicsProps()

      api.position.set(position.x, position.y, position.z)
      api.rotation.set(rotation.x, rotation.y, rotation.z)
      api.velocity.set(velocity.x, velocity.y, velocity.z)
      api.angularVelocity.set(
        angularVelocity.x,
        angularVelocity.y,
        angularVelocity.z,
      )
    })
  }

  return (
    <div className="App">
      <Scene setApi={setApi} numberOfDice={3} />
      <button onClick={() => rollDice()}>roll all</button>
    </div>
  )
}

export default App
