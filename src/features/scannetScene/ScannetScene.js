import { useSelector } from "react-redux"
import { coordsSelector } from './scannetSceneSlice'
import { BufferAttribute } from "three"

const ScannetScene = () => {
    const vertices = useSelector((state) => coordsSelector(state))

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach={"attributes-position"} {...new BufferAttribute(new Float32Array(vertices), 3)} />
            </bufferGeometry>
            <pointsMaterial
                size={0.01}
                threshold={0.1}
                color={0xff00ff}
                sizeAttenuation={true}
            />
        </points>
    )
}

export default ScannetScene;
