import "./App.css"
import { Canvas } from "@react-three/fiber"
import { Vector3 } from "three"

import { Physics, Debug, CuboidCollider } from "@react-three/rapier"
import { Suspense, useCallback, useEffect, useState } from "react"
import { Mask } from "./Mask"
import { SkittleProps, Skittle } from "./Skittle"
import { Gun } from "./Gun"
import { Skybox } from "./Skybox"

let skittleId = 0

const App = () => {
  const [skittles, setSkittles] = useState<SkittleProps[]>([])
  const [timeRemaining, setTimeRemaining] = useState(90)
  const shoot = useCallback(
    (velocity: [number, number, number], position: Vector3) => {
      const newSkittle = {
        color: randomColor(),
        initialVelocity: velocity,
        initialPosition: position,
        key: skittleId++,
      }
      setSkittles((skittles) => [...skittles, newSkittle].slice(-100))
    },
    [],
  )

  const [score, setScore] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeRemaining((timeRemaining) => Math.max(timeRemaining - 1, 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const onScore = useCallback(() => setScore((score) => score + 1), [])
  return (
    <>
      <Canvas
        hidden={timeRemaining > 60}
        style={{ position: "absolute" }}
        onCreated={() => console.log("created canvas")}
      >
        <ambientLight />
        <directionalLight />
        <Suspense>
          <Skybox />
        </Suspense>

        <Gun onShoot={shoot} />
        <Suspense>
          <Physics>
            {skittles.map((skittle, index) => (
              <Skittle {...skittle} />
            ))}
            <CuboidCollider position={[0, -2, 0]} args={[20, 0.5, 20]} />
            <Mask onScore={onScore} />
            <Debug />
          </Physics>
        </Suspense>
      </Canvas>

      <div
        style={{
          position: "absolute",
          color: "white",
          width: "100%",
          height: "100%",
        }}
        hidden={timeRemaining <= 60}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            textAlign: "center",
            top: "50%",
            transform: "translate(0, -50%)",
          }}
        >
          {lines[Math.floor((1 - (timeRemaining - 60) / 30) * lines.length)]}
        </div>
      </div>

      <div
        hidden={timeRemaining > 60}
        style={{
          position: "absolute",
          color: "white",
          fontSize: "4em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <span>Score: {score}</span>
        <br />
        <span>Time remaining: {timeRemaining - 30}</span>
      </div>
    </>
  )
}

export default App

const colors = ["#E64808", "#F1BE02", "#048207", "#441349", "#C0043F"]
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

const lines = [
  "A little bit of Skittle",
  "Misschien minder Kinder",
  "My Tony only on a pony",
  "",
  "the hammock",
  "the line",
  "the spliff",
  "& some beats.",
]
