/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import {
  Vector3,
  Quaternion,
  Euler,
  CubeTextureLoader,
  TextureLoader,
  DoubleSide,
} from 'three'
import { Physics, usePlane, useBox, Api } from 'use-cannon'
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
const DICE_MASS = 5
const TARGET_DISTANCE = 10

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

// const range = (n: number): number[] => Array.from({ length: n }, (x, i) => i)
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

const material = {
  friction: 0.1,
  restitution: 0.3,
}

const Cube = ({
  setApi,
  readyState,
  setReadyState,
}: {
  setApi: (api: ApiType) => void
  readyState: string
  setReadyState: (state: string) => void
}): JSX.Element => {
  const readyStateDelayed = useRef(readyState)

  const { camera } = useThree()

  const {
    velocity: initVelocity,
    rotation: initRotation,
    position: initPosition,
    angularVelocity,
  } = generatePhysicsProps()

  const [ref, api] = useBox(() => ({
    mass: DICE_MASS,
    material,
    args: [DICE_SIDELENGTH, DICE_SIDELENGTH, DICE_SIDELENGTH],
    position: [initPosition.x, initPosition.y, initPosition.z],
    rotation: [initRotation.x, initRotation.y, initRotation.z],
    velocity: [initVelocity.x, initVelocity.y, initVelocity.z],
    angularVelocity: [angularVelocity.x, angularVelocity.y, angularVelocity.z],
  }))

  useEffect(() => {
    setApi(api)
  }, [setApi, api])

  const position = useRef([0, 0, 0])
  const rotation = useRef([0, 0, 0])
  const velocity = useRef([0, 0, 0])

  const startPosition = useRef(new Vector3())
  const startRotation = useRef(new Euler())
  const springPosition = useRef(new Vector3())
  const springRotation = useRef(new Euler())
  const startTime = useRef(0)

  useEffect(() => {
    api.velocity.subscribe((v) => {
      velocity.current = v
    })

    api.rotation.subscribe((r) => {
      rotation.current = r
    })

    api.position.subscribe((p) => {
      position.current = p
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    if (
      readyState === 'init' &&
      (Math.abs(velocity.current[0]) > 0.1 ||
        Math.abs(velocity.current[1]) > 0.1 ||
        Math.abs(velocity.current[2]) > 0.1)
    ) {
      setReadyState('in-motion')
    }
    if (
      readyState === 'in-motion' &&
      Math.abs(velocity.current[0]) < 0.05 &&
      Math.abs(velocity.current[1]) < 0.05 &&
      Math.abs(velocity.current[2]) < 0.05
    ) {
      setReadyState('stopped')
    }
  })

  if (readyState === 'stopped' && readyStateDelayed.current !== 'stopped') {
    const targetPosition = new Vector3(0, 0, -TARGET_DISTANCE)
    targetPosition.applyQuaternion(camera.quaternion)
    targetPosition.add(camera.position)

    const currentCubeRot = new Euler(
      rotation.current[0],
      rotation.current[1],
      rotation.current[2],
    ).toVector3()

    const currentCameraRot = camera.rotation.toVector3()
    currentCameraRot.applyAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)

    const qrot = new Quaternion()
    qrot.setFromUnitVectors(
      currentCubeRot.normalize(),
      currentCameraRot.normalize(),
    )

    const rot = new Euler()
    const targetRotation = rot.setFromQuaternion(qrot)

    startPosition.current = new Vector3(
      position.current[0],
      position.current[1],
      position.current[2],
    )
    startRotation.current = new Euler(
      rotation.current[0],
      rotation.current[1],
      rotation.current[2],
    )

    springPosition.current = targetPosition
    springRotation.current = targetRotation

    startTime.current = +new Date()
  }

  readyStateDelayed.current = readyState

  const isAnimating = readyState === 'stopped'

  const ANIMATION_LENGTH = 400

  useFrame(() => {
    const t = Math.min((+new Date() - startTime.current) / ANIMATION_LENGTH, 1)

    if (isAnimating) {
      api.mass?.set(0)
      const interpPosition = new Vector3()
      interpPosition.lerpVectors(
        startPosition.current,
        springPosition.current,
        t,
      )

      const interpRotation = new Vector3()
      interpRotation.lerpVectors(
        startRotation.current.toVector3(),
        springRotation.current.toVector3(),
        t,
      )

      api.position.set(interpPosition.x, interpPosition.y, interpPosition.z)
      api.rotation.set(interpRotation.x, interpRotation.y, interpRotation.z)
    }
  })

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

const WALL_ARGS = [BOX_LENGTH * 2, BOX_LENGTH * 2, 0.1, 100, 100, 10]
const MESH_WALL_ARGS = WALL_ARGS as [
  number | number | number | number | number | number,
]

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

const Scene = (props: {
  setApi: (api: ApiType) => void
  cubeState: string
  setCubeState: (state: string) => void
}): JSX.Element => {
  return (
    <>
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
        <Cube
          setApi={props.setApi}
          readyState={props.cubeState}
          setReadyState={props.setCubeState}
        />
        <Planes />
      </Physics>
    </>
  )
}

const App = (): JSX.Element => {
  const [api, setApi] = useState<ApiType>()
  const [cubeState, setCubeState] = useState('init')

  const rollDice = (): void => {
    const {
      velocity,
      angularVelocity,
      rotation,
      position,
    } = generatePhysicsProps()

    api?.position.set(position.x, position.y, position.z)
    api?.rotation.set(rotation.x, rotation.y, rotation.z)
    api?.velocity.set(velocity.x, velocity.y, velocity.z)
    api?.angularVelocity.set(
      angularVelocity.x,
      angularVelocity.y,
      angularVelocity.z,
    )
    api?.mass?.set(DICE_MASS)

    setCubeState('init')
  }

  return (
    <div className="App">
      <Canvas
        style={{ height: '100vh', width: '100%' }}
        camera={{ position: [0, 15, 15], rotation: [-0.15, 0, 0] }}
        shadowMap
      >
        <Scene
          setApi={setApi}
          cubeState={cubeState}
          setCubeState={setCubeState}
        />
      </Canvas>
      <button className="roll-btn" onClick={(): void => rollDice()}>
        Roll Again
      </button>
    </div>
  )
}

export default App
