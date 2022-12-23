import { useSelector } from "react-redux"
import { useEffect, useMemo, useRef, useState } from "react"
import { BufferAttribute } from "three"

const SpherePointer = ({ canvasPointerRef, canvasSphereSize }) => {

    return (
        <mesh ref={canvasPointerRef} position={[0.5, 0.5, 0.5]}>
            <sphereGeometry args={[canvasSphereSize, 32, 32]} />
            <meshBasicMaterial color={0x0000ff} />
        </mesh>
    )
}

export default SpherePointer;
