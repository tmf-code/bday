import { Vector3 } from "three"
import { Sphere } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import { memo } from "react"

export const Skittle = memo((props: SkittleProps) => {
  console.log("render skittle")
  return (
    <RigidBody
      colliders="ball"
      position={props.initialPosition}
      linearVelocity={props.initialVelocity}
      scale={1}
      mass={1}
    >
      <Sphere scale={[0.2, 0.1, 0.2]}>
        <meshToonMaterial color={props.color} />
      </Sphere>
    </RigidBody>
  )
})
export interface SkittleProps {
  color: string
  initialVelocity: [number, number, number]
  initialPosition: Vector3
  key: number
}
