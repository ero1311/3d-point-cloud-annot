import { useSelector } from "react-redux"
import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import ScannetScene from "../scannetScene/ScannetScene"
import SpherePointer from "../spherePointer/SpherePointer"
import { useBVH } from "@react-three/drei"

const SCREEN_WIDTH = 0.84 * window.innerWidth
const SCREEN_HEIGHT = 0.83 * window.innerHeight
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT

const AnnotCanvas = () => {
    const canvasRef = useRef()
    const sceneRef = useRef()
    const pointerRef = useRef()
    const [sphereSize, setSphereSize] = useState(0.025)

    useBVH(sceneRef)

    useEffect(() => {
        console.log(sceneRef, pointerRef)
    }, [])
    return (
        <Canvas camera={{
            fov: 75,
            aspect: ASPECT,
            near: 0.1,
            far: 50,
            position: [2, 2, 2],
            up: [0, 0, 1]
        }}
            raycaster={{
                params: {
                    Points: {
                        threshold: 0.01
                    }
                },
                filter: items => items.slice(0, 1)
            }}
            ref={canvasRef}
            dpr={window.devicePixelRatio}
            gl={{ antialias: true, dofAutofocus: true }}
            onCreated={state => state.gl.setClearColor("#ffffff")}>
            <color attach="background" args={['#202020']} />
            <ambientLight color={0x888888} />
            <pointLight color={0x888888} position={[0, 0, 3]} castShadow={true} />
            <ScannetScene canvasSceneRef={sceneRef} canvasPointerRef={pointerRef} canvasSetSphereSize={setSphereSize} canvasSphereSize={sphereSize} />
            <SpherePointer canvasPointerRef={pointerRef} canvasSphereSize={sphereSize} />
            <OrbitControls
                enableDamping={false}
                dampingFactor={0.05}
                screenSpacePanning={false}
                minDistance={1}
                maxDistance={10}
                maxPolarAngle={Math.PI / 2}
            />
        </Canvas>
    )
}

export default AnnotCanvas;