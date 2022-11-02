import { useCubeTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"

export const Skybox = () => {
  const box = useCubeTexture(
    [
      "box-1.jpg",
      "box-2.jpg",
      "box-3.jpg",
      "box-4.jpg",
      "box-4.jpg",
      "box-4.jpg",
    ],
    { path: "./" },
  )
  const { scene } = useThree()
  scene.background = box

  return null
}
