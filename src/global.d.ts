import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >
    }
  }

  type meshType = ReactThreeFiber.Object3DNode<Mesh<Geometry | BufferGeometry, Material | Material[]>, typeof Mesh>
}
