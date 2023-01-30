const SpherePointer = ({ canvasPointerRef, canvasSphereSize }) => {

    return (
        <mesh ref={canvasPointerRef} position={[0.5, 0.5, 0.5]}>
            <sphereGeometry args={[canvasSphereSize, 32, 32]} />
            <meshBasicMaterial color={0x0000ff} />
        </mesh>
    )
}

export default SpherePointer;
