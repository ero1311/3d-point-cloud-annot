import { useSelector } from "react-redux"
import { useEffect, useMemo, useRef, useState } from "react"
import { BufferAttribute } from "three"

const SpherePointer = () => {

    return (
        <mesh position={{ x: 0.5, y: 0.5, z: 0.5 }}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color={0xff0000} />
        </mesh>
    )
}

export default SpherePointer;
