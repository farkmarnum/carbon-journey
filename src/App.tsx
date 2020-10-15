import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import {
  Vector3,
  Euler,
  CubeTextureLoader,
  TextureLoader,
  DoubleSide,
} from 'three'
import { Physics, usePlane, useBox, Api } from 'use-cannon'
import { useSpring } from 'react-spring'
import {
  Canvas,
  useThree,
  useFrame,
  extend,
  ReactThreeFiber,
} from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import atmoPlant from './assets/cubeAtmosphere/atmo-plant.png'
import atmoStay from './assets/cubeAtmosphere/atmo-stay.png'
import atmoWater from './assets/cubeAtmosphere/atmo-water.png'

const GRAVITY = -50
const DICE_SIDELENGTH = 4
const BOX_LENGTH = 10

extend({ OrbitControls })

const cubeLoader = new CubeTextureLoader()
const textureLoader = new TextureLoader()

const landscapeTexture = cubeLoader.load([
  require('./assets/landscapeTexture/px.png'),
  require('./assets/landscapeTexture/nx.png'),
  require('./assets/landscapeTexture/py.png'),
  require('./assets/landscapeTexture/ny.png'),
  require('./assets/landscapeTexture/pz.png'),
  require('./assets/landscapeTexture/nz.png'),
])

const atmoPlantTexture = textureLoader.load(atmoPlant)
const atmoStayTexture = textureLoader.load(atmoStay)
const atmoWaterTexture = textureLoader.load(atmoWater)

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

interface PhysicsProps {
  angularVelocity: Vector3
  velocity: Vector3
  rotation: Vector3
  position: Vector3
}

const generatePhysicsProps = (): PhysicsProps => ({
  angularVelocity: new Vector3(
    rand(4) * Math.PI,
    rand(4) * Math.PI,
    rand(4) * Math.PI,
  ),
  velocity: new Vector3(
    randPlusMinusOne() * ((Math.random() + 1) * 10 + 10),
    (Math.random() + 1) * 3,
    randPlusMinusOne() * ((Math.random() + 1) * 10 + 10),
  ),
  rotation: new Vector3(rand(Math.PI), rand(Math.PI), rand(Math.PI)),
  position: new Vector3(rand(2) + 2, 10, rand(2) + 2),
})

type ApiType = Api[1]
type SetApiType = (id: string, api: ApiType) => void
type ApisType = Record<string, ApiType>

const material = {
  friction: 0.1,
  restitution: 0.3,
}

const WALL_ARGS = [BOX_LENGTH * 2, BOX_LENGTH * 2, 0.1, 100, 100, 10]
const MESH_WALL_ARGS = WALL_ARGS as [
  number | number | number | number | number | number,
]

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
    material,
    args: [DICE_SIDELENGTH, DICE_SIDELENGTH, DICE_SIDELENGTH],
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
      <boxBufferGeometry
        attach="geometry"
        args={[DICE_SIDELENGTH, DICE_SIDELENGTH, DICE_SIDELENGTH]}
      />
      <meshLambertMaterial attachArray="material" map={atmoPlantTexture} />
      <meshLambertMaterial attachArray="material" map={atmoStayTexture} />
      <meshLambertMaterial attachArray="material" map={atmoWaterTexture} />
      <meshLambertMaterial attachArray="material" map={atmoPlantTexture} />
      <meshLambertMaterial attachArray="material" map={atmoStayTexture} />
      <meshLambertMaterial attachArray="material" map={atmoWaterTexture} />
    </mesh>
  )
}

const Planes = (): JSX.Element => {
  const [groundRef] = usePlane(() => ({
    material,
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }))

  const [backWallRef] = useBox(() => ({
    material,
    position: [0, BOX_LENGTH, -BOX_LENGTH],
    args: WALL_ARGS,
  }))

  const [leftWallRef] = useBox(() => ({
    material,
    args: WALL_ARGS,
    position: [-BOX_LENGTH, BOX_LENGTH, 0],
    rotation: [-Math.PI / 2, -Math.PI / 2, 0],
  }))

  const [rightWallRef] = useBox(() => ({
    material,
    args: WALL_ARGS,
    position: [BOX_LENGTH, BOX_LENGTH, 0],
    rotation: [-Math.PI / 2, -Math.PI / 2, 0],
  }))

  const [frontWallRef] = useBox(() => ({
    material,
    args: WALL_ARGS,
    position: [0, BOX_LENGTH, BOX_LENGTH],
  }))

  const metalness = 0.9
  const roughness = 0.1
  const opacity = 0.1

  return (
    <>
      <mesh ref={groundRef} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[20, 20]} />
        <meshLambertMaterial attach="material" color="#444" />
      </mesh>

      <mesh ref={backWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          attach="material"
          color="#fff"
          envMap={landscapeTexture}
          transparent
          side={DoubleSide}
          opacity={opacity}
        />
      </mesh>

      <mesh ref={leftWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          attach="material"
          color="#fff"
          envMap={landscapeTexture}
          transparent
          side={DoubleSide}
          opacity={opacity}
        />
      </mesh>

      <mesh ref={rightWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          attach="material"
          color="#fff"
          envMap={landscapeTexture}
          transparent
          side={DoubleSide}
          opacity={opacity}
        />
      </mesh>

      <mesh ref={frontWallRef}>
        <boxBufferGeometry attach="geometry" args={MESH_WALL_ARGS} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          attach="material"
          color="#fff"
          envMap={landscapeTexture}
          transparent
          side={DoubleSide}
          opacity={opacity}
        />
      </mesh>
    </>
  )
}

interface SpringProps {
  position: Vector3
  rotation: Euler
}

const BoxInFrontOfCam = (): JSX.Element => {
  const targetDistance = 6

  const { camera } = useThree()
  const meshRef = useRef<meshType>()

  const positionSpringEnd = useRef<Vector3>(new Vector3())
  const rotationSpringEnd = useRef<Euler>(new Euler())

  let isAnimating = false

  useFrame(() => {
    if (!isAnimating && meshRef.current?.velocity && meshRef.current?.velocity.length() < 0.01) {
      const targetPosition = new Vector3(0, 0, -targetDistance)
      targetPosition.applyQuaternion(camera.quaternion)
      targetPosition.add(camera.position)
      const targetRotation = camera.rotation

      positionSpringEnd.current = targetPosition
      rotationSpringEnd.current = targetRotation
      isAnimating = true
    }
  })

  const props = useSpring({
    posX: positionSpringEnd.current.x,
    posY: positionSpringEnd.current.y,
    posZ: positionSpringEnd.current.z,
    rotX: rotationSpringEnd.current.x,
    rotY: rotationSpringEnd.current.y,
    rotZ: rotationSpringEnd.current.z,
  })

  useFrame(() => {
    if (isAnimating) {
      if (meshRef.current) {
        meshRef.current.position = [props.posX, props.posY, props.posZ]
        meshRef.current.rotation = [props.rotX, props.rotY, props.rotZ]
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

const Scene = (props: {
  numberOfDice: number
  setApi: SetApiType
}): JSX.Element => {
  return (
    <>
      <BoxInFrontOfCam />
      <CameraControls />
      <ambientLight />
      <pointLight
        position={[10, 30, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-radius={10}
      />
      <Physics gravity={[0, GRAVITY, 0]}>
        {range(props.numberOfDice).map((_, i) => (
          <Cube key={i} id={String(i)} setApi={props.setApi} />
        ))}
        <Planes />
      </Physics>
    </>
  )
}

const App = (): JSX.Element => {
  const [apis, setApis] = useState<ApisType>({})
  const setApi = (id: string, api: ApiType): void => {
    setApis((apisCurrent) => ({
      ...apisCurrent,
      [id]: api,
    }))
  }

  const rollDice = (): void => {
    Object.values(apis).forEach((api): void => {
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
      <Canvas
        style={{ height: '100vh', width: '100%' }}
        camera={{ position: [0, 15, 15], rotation: [-0.15, 0, 0] }}
        shadowMap
      >
        <Scene setApi={setApi} numberOfDice={1} />
      </Canvas>
      <button className="roll-btn" onClick={(): void => rollDice()}>
        Roll Again
      </button>
    </div>
  )
}

export default App
