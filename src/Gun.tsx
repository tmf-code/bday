import { useFrame } from "@react-three/fiber"
import { Group, Mesh, Vector3 } from "three"
import { PointerLockControls } from "@react-three/drei"
import { memo, useCallback, useEffect, useRef } from "react"
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib"

export const Gun = memo(
  (props: {
    onShoot: (velocity: [number, number, number], position: Vector3) => void
  }) => {
    const base = useRef<Group>(null)
    const barrel = useRef<Group>(null)
    const tip = useRef<Mesh>(null)
    const keyboard = useKeyboard()
    const controls = useRef<PointerLockControlsImpl>(null)
    console.log("render gun")

    useFrame((state) => {
      if (!base.current || !barrel.current || !tip.current) return
      state.camera.position.y = 2

      base.current.rotation.copy(state.camera.rotation)

      base.current.position.x = state.camera.position.x
      base.current.position.z = state.camera.position.z

      if (keyboard.current.w) {
        controls.current?.moveForward(0.2)
      }
      if (keyboard.current.s) {
        controls.current?.moveForward(-0.2)
      }
      barrel.current.rotation.y = 0
      if (keyboard.current.a) {
        controls.current?.moveRight(-0.2)
        barrel.current.rotation.y = Math.PI / 4
      }
      if (keyboard.current.d) {
        controls.current?.moveRight(0.2)
        barrel.current.rotation.y = -Math.PI / 4
      }
      if (keyboard.current.space) {
        const velocity = barrel.current
          .getWorldDirection(new Vector3())
          .multiplyScalar(-10)
          .toArray()
        const position = tip.current.getWorldPosition(new Vector3())
        props.onShoot(velocity, position)
      }
    })
    return (
      <>
        <PointerLockControls ref={controls} makeDefault />
        <group ref={base} position={[0, 0, 0]}>
          <group ref={barrel} position={[0, 0, -3]}>
            <mesh position={[-1.1, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.8, 0.8, 0.8, 10, 1]} />
              <meshPhysicalMaterial color="brown" wireframe />
            </mesh>
            <mesh position={[1.1, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.8, 0.8, 0.8, 10, 1]} />
              <meshPhysicalMaterial color="brown" wireframe />
            </mesh>
            <group>
              <mesh
                ref={tip}
                position={[0, 0, -2.46]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.5, 0.5, 0.1, 10, 10]} />
                <meshPhysicalMaterial color="black" />
              </mesh>
              <mesh
                scale={[1, 3, 1]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0, -1]}
              >
                <cylinderGeometry args={[1, 0.7, 1, 10, 10]} />
                <meshPhysicalMaterial color="red" />
              </mesh>
            </group>
          </group>
        </group>
      </>
    )
  },
)
interface KeyState {
  w: boolean
  s: boolean
  a: boolean
  d: boolean
  space: boolean
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  shift: boolean
  caps: boolean
}
const useKeyboard = () => {
  const state = useRef<KeyState>({
    w: false,
    s: false,
    a: false,
    d: false,
    space: false,
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
    caps: false,
  })

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
        state.current.w = true
        break
      case "KeyS":
        state.current.s = true
        break
      case "KeyD":
        state.current.d = true
        break
      case "KeyA":
        state.current.a = true
        break
      case "Space":
        state.current.space = true
        break
      case "ArrowUp":
        state.current.up = true
        break
      case "ArrowDown":
        state.current.down = true
        break
      case "ArrowLeft":
        state.current.left = true
        break
      case "ArrowRight":
        state.current.right = true
        break
      case "ShiftLeft":
        state.current.shift = true
        break
      case "CapsLock":
        state.current.caps = true
        break
    }
  }, [])
  const onKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
        state.current.w = false
        break
      case "KeyS":
        state.current.s = false
        break
      case "KeyD":
        state.current.d = false
        break
      case "KeyA":
        state.current.a = false
        break
      case "Space":
        state.current.space = false
        break
      case "ArrowUp":
        state.current.up = false
        break
      case "ArrowDown":
        state.current.down = false
        break
      case "ArrowLeft":
        state.current.left = false
        break
      case "ArrowRight":
        state.current.right = false
        break
      case "ShiftLeft":
        state.current.shift = false
        break
      case "CapsLock":
        state.current.caps = false
        break
    }
  }, [])
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      console.log("removing")
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  return state
}
