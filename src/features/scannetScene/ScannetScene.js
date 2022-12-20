import * as THREE from 'three'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useMemo, useRef, useState } from "react"
import { coordsSelector, colorsSelector, currentPosSelector, setCurrentPos } from './scannetSceneSlice'
import { BufferAttribute } from "three"
import { useFrame } from "@react-three/fiber"

const ScannetScene = ({ canvasSceneRef, canvasPointerRef, canvasSphereSize, canvasSetSphereSize }) => {
    const vertices = useSelector((state) => coordsSelector(state))
    const colors = useSelector((state) => colorsSelector(state))
    const [pointSize, setPointSize] = useState(0.01)
    const verticesCached = useMemo(() => new BufferAttribute(new Float32Array(vertices), 3), [vertices])
    const colorsCached = useMemo(() => new BufferAttribute(new Float32Array(colors), 3), [colors])
    const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0))

    const handlePointerMove = (e) => {
        console.log(e)
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'i':
                    if (pointSize * 1.2 <= 0.5)
                        setPointSize(pointSize * 1.2)
                    break
                case 'd':
                    if (pointSize / 1.2 >= 0.01)
                        setPointSize(pointSize / 1.2)
                    break
                case '+':
                    canvasSetSphereSize(canvasSphereSize * 1.02)
                    break
                case '-':
                    canvasSetSphereSize(canvasSphereSize * 0.98)
                    break
                default:
                    break
            }
        }
        const handleKeyUp = (e) => {
            console.log("up", e)
        }
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [pointSize, canvasSphereSize])

    useFrame((state) => {
        canvasPointerRef.current.position.copy(position)
    })

    return (
        <points
            onPointerMove={(e) => (setPosition(e.point))}
            ref={canvasSceneRef}>
            <bufferGeometry>
                <bufferAttribute attach={"attributes-position"} {...verticesCached} />
                <bufferAttribute attach={"attributes-color"} {...colorsCached} />
            </bufferGeometry>
            <pointsMaterial
                size={pointSize}
                threshold={0.1}
                sizeAttenuation={true}
                vertexColors={true}
            />
        </points>
    )
}

export default ScannetScene;
