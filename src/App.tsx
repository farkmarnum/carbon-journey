/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import {
  Vector3,
  Matrix4,
  Euler,
  CubeTextureLoader,
  TextureLoader,
  DoubleSide,
  Texture,
  Geometry,
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

const NORMALS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
]

const GRAVITY = -50
const DICE_SIDELENGTH = 4
const BOX_LENGTH = 10
const DICE_MASS = 5

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

const atmosphereCubeFaces = [
  atmoPlant,
  atmoStay,
  atmoWater,
  atmoPlant,
  atmoStay,
  atmoWater,
]

const atmosphereCubeTexture = atmosphereCubeFaces.map((face) =>
  textureLoader.load(face),
)

// console.log(atmosphereCubeFaces, atmosphereCubeTexture)

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

const rand = (k: number): number => (Math.random() - 0.5) * 2 * k
const randPlusMinusOne = (): 1 | -1 => (Math.random() > 0.5 ? 1 : -1)
const areNear = (a: number, b: number): boolean => Math.abs(a - b) < Math.PI / 4

interface PhysicsProps {
  angularVelocity: Vector3
  velocity: Vector3
  position: Vector3
}

const generatePhysicsProps = (): PhysicsProps => ({
  angularVelocity: new Vector3(
    rand(8) * Math.PI,
    rand(8) * Math.PI,
    rand(8) * Math.PI,
  ),
  velocity: new Vector3(
    randPlusMinusOne() * ((Math.random() + 1) * 10 + 10),
    (Math.random() + 1) * 3,
    randPlusMinusOne() * ((Math.random() + 1) * 10 + 10),
  ),
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
  textures,
  showRollResult,
}: {
  setApi: (api: ApiType) => void
  readyState: string
  setReadyState: (state: string) => void
  textures: Texture[]
  showRollResult: (i: number) => void
}): JSX.Element => {
  const {
    velocity: initVelocity,
    position: initPosition,
    angularVelocity,
  } = generatePhysicsProps()

  const [ref, api] = useBox(() => ({
    mass: DICE_MASS,
    material,
    args: [DICE_SIDELENGTH, DICE_SIDELENGTH, DICE_SIDELENGTH],
    position: [initPosition.x, initPosition.y, initPosition.z],
    velocity: [initVelocity.x, initVelocity.y, initVelocity.z],
    angularVelocity: [angularVelocity.x, angularVelocity.y, angularVelocity.z],
  }))

  const rotation = useRef(new Euler())
  const velocity = useRef(new Vector3())

  useEffect(() => {
    api.rotation.subscribe((v) => {
      rotation.current.x = v[0]
      rotation.current.y = v[1]
      rotation.current.z = v[2]
    })
    api.velocity.subscribe((v) => {
      velocity.current.x = v[0]
      velocity.current.y = v[1]
      velocity.current.z = v[2]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [dir, setDir] = useState(new Vector3())

  useFrame(() => {
    if (readyState === 'init' && velocity.current.length() > 0.1) {
      setReadyState('in-motion')
    }
    if (readyState === 'in-motion' && velocity.current.length() < 0.05 && ref.current?.matrix) {
      const matrix = new Matrix4()
      matrix.extractRotation(ref.current?.matrix)

      const normals = [...NORMALS]
      normals.forEach((normal, i) => {
        const direction = new Vector3(normal[0], normal[1], normal[2])
        direction.applyMatrix4(matrix)
        if (direction.y > 0.9) {
          console.log([
            'grey',
'black',
'yellow',
'green',
'white',
'purple',
][i])
        }
      })

    //   // const isUpright = ({ y }: { y: number }): boolean =>
    //   //   Math.abs(1 - y) < 0.05

    //   // if (normals.some(isUpright)) {
    //   //   setReadyState('stopped')
    //   //   const i = normals.findIndex(isUpright)
    //   //   console.log(i)
    //   //   console.log(normals.map(({ y }) => Math.round(y * 10) / 10))
    //   // }

    //   console.log(normals.map(n => Math.round(10 * n.dot(direction)) / 10))
    //   setReadyState('stopped')
    }
  })

  // ;(window as Record<string, any>).w = () => setReadyState('in-motion')

  // if (readyState === 'stopped' && ref.current?.matrix) {
    

  //   console.log(rotation.current)

  //   NORMALS.forEach((normal) => {
  //     normal.applyEuler(rotation.current)
  //   })

  //   console.log(normals.map(({ y }) => Math.round(y * 10) / 10))
  //   // const dots = normals.map((normal) => normal.dot(direction))
  //   // console.log(dots.map(d => Math.round(d * 10) / 10))
  // }

  useEffect(() => {
    setApi(api)
  }, [setApi, api])

  return (
    <>
    <mesh>
      <arrowHelper args={[dir, new Vector3(0, 0, 0), 10]} />
    </mesh>
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry
        attach="geometry"
        args={[DICE_SIDELENGTH, DICE_SIDELENGTH, DICE_SIDELENGTH]}
      />
      <meshLambertMaterial attachArray="material" color="grey" />{' '}
      {/*map={atmoPlantTexture} /> */}
      <meshLambertMaterial attachArray="material" color="black" />{' '}
      {/*map={atmoStayTexture} /> */}
      <meshLambertMaterial attachArray="material" color="yellow" />{' '}
      {/*map={atmoWaterTexture} /> */}
      <meshLambertMaterial attachArray="material" color="green" />{' '}
      {/*map={atmoPlantTexture} /> */}
      <meshLambertMaterial attachArray="material" color="white" />{' '}
      {/*map={atmoStayTexture} /> */}
      <meshLambertMaterial attachArray="material" color="purple" />{' '}
      {/*map={atmoWaterTexture} /> */}
      {/*  */}
      {/*       {textures.map((texture, i) => { */}
      {/*         return ( */}
      {/*           <meshLambertMaterial */}
      {/*             key={texture.uuid} */}
      {/*             attachArray="material" */}
      {/*             map={texture} */}
      {/*           /> */}
      {/*         ) */}
      {/*       })} */}
    </mesh>
    </>
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
      <mesh ref={groundRef} receiveShadow name="ground">
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
  cubeTexture: Texture[]
  showRollResult: (i: number) => void
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
          textures={props.cubeTexture}
          showRollResult={props.showRollResult}
        />
        <Planes />
      </Physics>
    </>
  )
}

const App = (): JSX.Element => {
  const [api, setApi] = useState<ApiType>()
  const [cubeState, setCubeState] = useState('init')
  const showRollResult = (i: number): void => {
    const colors = ['grey', 'black', 'yellow', 'green', 'white', 'purple']
    console.log(colors[i])
    // console.log(atmosphereCubeFaces[i])
  }

  const rollDice = (): void => {
    const { velocity, angularVelocity, position } = generatePhysicsProps()

    api?.position.set(position.x, position.y, position.z)
    api?.rotation.set(0, 0, 0)
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
          cubeTexture={atmosphereCubeTexture}
          showRollResult={showRollResult}
        />
      </Canvas>
      <button className="roll-btn" onClick={(): void => rollDice()}>
        Roll Again
      </button>
    </div>
  )
}

export default App
