import { useLoader } from "@react-three/fiber"
import { CuboidCollider } from "@react-three/rapier"
import { memo, Suspense, useCallback, useEffect, useState } from "react"
import { Mesh, Vector3, DoubleSide } from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"

const maskPositions: [Vector3, [number, number, number]][] = [
  [new Vector3(30, 10, 0), [0, -Math.PI / 2, 0]],
  [new Vector3(0, 10, 30), [0, -Math.PI, 0]],
  [new Vector3(-30, 10, 0), [0, Math.PI / 2, 0]],
  [new Vector3(0, 10, -30), [0, 0, 0]],
]

export const Mask = memo((props: { onScore: () => void }) => {
  const mask = useLoader(OBJLoader, "./mask.obj")
  const [shownFace, setShownFace] = useState(0)

  useEffect(() => {
    function waitAndChange() {
      return window.setTimeout(() => {
        setShownFace(Math.floor(Math.random() * 4))
        waitAndChange()
      }, (Math.random() * 3 + 3) * 1000)
    }
    const timeout = waitAndChange()

    return () => clearTimeout(timeout)
  }, [])

  const addScore = useCallback(
    (face: number) => {
      if (face !== shownFace) return
      props.onScore()
    },
    [shownFace],
  )

  return (
    <>
      <mesh
        geometry={(mask.children[0] as Mesh).geometry}
        position={maskPositions[shownFace][0]}
        rotation={maskPositions[shownFace][1]}
      >
        <meshNormalMaterial side={DoubleSide} />
      </mesh>
      <CuboidCollider
        position={[30, 5, 0]}
        args={[5, 5, 5]}
        rotation={[0, -Math.PI / 2, 0]}
        onCollisionEnter={() => addScore(0)}
      />
      <CuboidCollider
        position={[0, 5, 30]}
        args={[5, 5, 5]}
        rotation={[0, -Math.PI, 0]}
        onCollisionEnter={() => addScore(1)}
      />
      <CuboidCollider
        position={[-30, 5, 0]}
        args={[5, 5, 5]}
        rotation={[0, Math.PI / 2, 0]}
        onCollisionEnter={() => addScore(2)}
      />
      <CuboidCollider
        position={[0, 5, -30]}
        args={[5, 5, 5]}
        rotation={[0, 0, 0]}
        onCollisionEnter={() => addScore(3)}
      />
    </>
  )
})
