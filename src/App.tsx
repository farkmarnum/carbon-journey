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
} from 'three'
import { Physics, usePlane, useBox, Api } from 'use-cannon'
import { Canvas, useFrame, extend } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import atmoPlant from './assets/cubeAtmosphere/atmo-plant.png'
import atmoWater from './assets/cubeAtmosphere/atmo-water.png'
import atmoStay from './assets/cubeAtmosphere/atmo-stay.png'

import bioAtmo from './assets/cubeBiosphere/bio-atmo.png'
import bioLith from './assets/cubeBiosphere/bio-lith.png'
import bioStay from './assets/cubeBiosphere/bio-stay.png'

import hydroAtmo from './assets/cubeHydrosphere/hydro-atmo.png'
import hydroBio from './assets/cubeHydrosphere/hydro-bio.png'
import hydroLitho from './assets/cubeHydrosphere/hydro-litho.png'
import hydroStay from './assets/cubeHydrosphere/hydro-stay.png'

import prelithoAtmo from './assets/cubeLithospherePre/prelitho-atmo.png'
import prelithoStay from './assets/cubeLithospherePre/prelitho-stay.png'

import postlithoAtmo from './assets/cubeLithospherePost/postlitho-atmo.png'
import postlithoStay from './assets/cubeLithospherePost/postlitho-stay.png'

const rollResultTransitionMs = parseInt(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--roll-result-transition')
    .replace(/ms/, ''),
)

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

const biosphereCubeFaces = [
  bioAtmo,
  bioLith,
  bioAtmo,
  bioLith,
  bioAtmo,
  bioStay,
]

const hydrosphereCubeFaces = [
  hydroAtmo,
  hydroStay,
  hydroBio,
  hydroStay,
  hydroLitho,
  hydroStay,
]

const lithospherePreCubeFaces = [
  prelithoAtmo,
  prelithoStay,
  prelithoStay,
  prelithoStay,
  prelithoStay,
  prelithoStay,
]

const lithospherePostCubeFaces = [
  postlithoAtmo,
  postlithoAtmo,
  postlithoStay,
  postlithoAtmo,
  postlithoAtmo,
  postlithoStay,
]

const atmosphereCubeTexture = atmosphereCubeFaces.map((face) =>
  textureLoader.load(face),
)
const biosphereCubeTexture = biosphereCubeFaces.map((face) =>
  textureLoader.load(face),
)
const hydrosphereCubeTexture = hydrosphereCubeFaces.map((face) =>
  textureLoader.load(face),
)
const lithospherePreCubeTexture = lithospherePreCubeFaces.map((face) =>
  textureLoader.load(face),
)
const lithospherePostCubeTexture = lithospherePostCubeFaces.map((face) =>
  textureLoader.load(face),
)
const rand = (k: number): number => (Math.random() - 0.5) * 2 * k
const randPlusMinusOne = (): 1 | -1 => (Math.random() > 0.5 ? 1 : -1)

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
  const [ref, api] = useBox(() => ({
    mass: DICE_MASS,
    material,
    args: [DICE_SIDELENGTH, DICE_SIDELENGTH, DICE_SIDELENGTH],
    position: [0, 2, 0],
    velocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
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

  useFrame(() => {
    if (readyState === 'init' && velocity.current.length() > 0.5) {
      setReadyState('in-motion')
    }
    if (
      readyState === 'in-motion' &&
      velocity.current.length() < 0.05 &&
      ref.current?.matrix
    ) {
      const matrix = new Matrix4()
      matrix.extractRotation(ref.current?.matrix)

      const normals = [...NORMALS]
      normals.some((normal, i) => {
        const direction = new Vector3(normal[0], normal[1], normal[2])
        direction.applyMatrix4(matrix)
        if (direction.y > 0.9) {
          setReadyState('stopped')
          showRollResult(i)
          return true
        }
        return false
      })
    }
  })

  useEffect(() => {
    setApi(api)
  }, [setApi, api])

  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry
        attach="geometry"
        args={[DICE_SIDELENGTH, DICE_SIDELENGTH, DICE_SIDELENGTH]}
      />
      {textures.map(texture => {
        return (
          <meshLambertMaterial
            key={texture.uuid}
            attachArray="material"
            map={texture}
          />
        )
      })}
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
  const SPHERES = 4

  const [isPostIndustrial, setIsPostIndustrial] = useState(false)
  const [sphereIndex, setSphereIndexUnsafe] = useState(
    Math.floor(Math.random() * SPHERES),
  )

  const setSphereIndex = (i: number): void => {
    if (i <= SPHERES && i >= 0) setSphereIndexUnsafe(i)
  }

  const spheres = [
    {
      name: 'Atmosphere',
      faces: atmosphereCubeFaces,
      texture: atmosphereCubeTexture,
      color: 'lightblue',
    },
    {
      name: 'Biosphere',
      faces: biosphereCubeFaces,
      texture: biosphereCubeTexture,
      color: 'green',
    },
    {
      name: 'Hydrosphere',
      faces: hydrosphereCubeFaces,
      texture: hydrosphereCubeTexture,
      color: 'blue',
    },
    {
      name: 'Lithosphere',
      faces: isPostIndustrial
        ? lithospherePostCubeFaces
        : lithospherePreCubeFaces,
      texture: isPostIndustrial
        ? lithospherePostCubeTexture
        : lithospherePreCubeTexture,
      color: 'black',
    },
  ]

  const cubeFaces = spheres[sphereIndex].faces
  const cubeTexture = spheres[sphereIndex].texture
  const sphereName = spheres[sphereIndex].name

  const [api, setApi] = useState<ApiType>()
  const [cubeState, setCubeState] = useState('init')

  const [rollResult, setRollResult] = useState<number | undefined>()
  const [rollResultClass, setRollResultClass] = useState('hide')

  const showRollResult = (i: number): void => {
    setRollResultClass('show')
    setRollResult(i)
  }

  const hideRollResult = (): void => {
    setRollResultClass('hide')

    setTimeout(() => {
      setRollResult(undefined)
    }, rollResultTransitionMs)
  }

  const rollDice = (): void => {
    hideRollResult()

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

  const isValidRollResult =
    rollResult != null && rollResult <= 5 && rollResult >= 0

  return (
    <div className="App">
      <Canvas
        style={{ height: '100vh', width: '100%' }}
        camera={{ position: [0, 16, 9.5], rotation: [-0.15, 0, 0] }}
        shadowMap
      >
        <Scene
          setApi={setApi}
          cubeState={cubeState}
          setCubeState={setCubeState}
          cubeTexture={cubeTexture}
          showRollResult={showRollResult}
        />
      </Canvas>
      <div className={`roll-result-overlay ${rollResultClass}`}>
        {isValidRollResult && (
          <img src={cubeFaces[rollResult as number]} alt="" />
        )}
      </div>

      <div className="sphere-name">
        {sphereName}
        {sphereName === 'Lithosphere' && (
          <h6 style={{ margin: 0 }}>
            ({isPostIndustrial ? 'post-industrial' : 'pre-industrial'})
          </h6>
        )}
      </div>

      <div className="right-side">
        <button className="roll-btn" onClick={(): void => rollDice()}>
          Roll
        </button>
        <div className="label">
          {isPostIndustrial ? 'Post-industrial' : 'Pre-industrial'}
        </div>
        <label className="switch industrial-switch">
          <input
            type="checkbox"
            onChange={(evt): void => {
              setIsPostIndustrial(evt.target.checked)
            }}
          />
          <span className="slider round"></span>
        </label>
        <div className="label">Switch sphere:</div>
        {spheres.map((data, i) => (
          <button
            key={data.name}
            className="sphere-selector-button"
            style={{ color: data.color, borderColor: data.color }}
            onClick={(): void => {
              setSphereIndex(i)
              hideRollResult()
            }}
          >
            {data.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
