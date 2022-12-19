import { useSelector } from "react-redux"
import { useEffect, useMemo, useRef, useState } from "react"
import { coordsSelector, colorsSelector } from './scannetSceneSlice'
import { BufferAttribute } from "three"

const ScannetScene = () => {
    const vertices = useSelector((state) => coordsSelector(state))
    const colors = useSelector((state) => colorsSelector(state))
    const pointsThreeObj = useRef()
    const [pointSize, setPointSize] = useState(0.01)
    const verticesCached = useMemo(() => new BufferAttribute(new Float32Array(vertices), 3), [vertices])
    const colorsCached = useMemo(() => new BufferAttribute(new Float32Array(colors), 3), [colors])

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
    }, [pointSize])
    return (
        <points ref={pointsThreeObj}>
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
