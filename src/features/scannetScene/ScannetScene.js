import * as THREE from 'three'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useMemo, useState } from "react"
import { coordsSelector, colorsSelector } from './scannetSceneSlice'
import { addInstance, removeInstance } from '../annotBar/annotBarSlice'
import { BufferAttribute } from "three"
import { useFrame } from "@react-three/fiber"
import { classIndexSelector, annotationsSelector } from '../annotBar/annotBarSlice'
import { timeSelector } from '../timer/timerSlice'
import { colorList, config } from '../../config'

const ScannetScene = ({ canvasSceneRef, canvasPointerRef, canvasSphereSize, canvasSetSphereSize }) => {
    const selectedClassIndex = useSelector((state) => classIndexSelector(state))
    const currentTime = useSelector((state) => timeSelector(state))
    const vertices = useSelector((state) => coordsSelector(state))
    const colors = useSelector((state) => colorsSelector(state))
    const [pointSize, setPointSize] = useState(0.01)
    const verticesCached = useMemo(() => new BufferAttribute(new Float32Array(vertices), 3), [vertices])
    const colorsCached = useMemo(() => new BufferAttribute(new Uint8Array(colors), 3, true), [colors])
    const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0))
    const [annotPoint, setAnnotPoint] = useState(new THREE.Vector3(0, 0, 0))
    const [annotNeedsUpdate, setAnnotNeedsUpdate] = useState(false)
    const [colorNeedsUpdate, setColorNeedsUpdate] = useState(false)
    const dispatch = useDispatch()

    const handleMove = (e) => {
        const selectedPoint = e.intersections[0].point
        if (e.altKey) {
            if (selectedPoint.distanceTo(annotPoint) > 0.01) {
                setAnnotPoint(position)
                setAnnotNeedsUpdate(true)
            }
        }
        setPosition(selectedPoint)
    }

    useEffect(() => {
        let annotInstance = {
            class_name: null,
            points: [],
            time: currentTime
        }
        if (annotNeedsUpdate) {
            if (selectedClassIndex !== null) {
                const classColor = colorList[selectedClassIndex]
                console.log(classColor)
                for (let i = 0; i < canvasSceneRef.current.geometry.attributes.position.count; i++) {
                    const x = canvasSceneRef.current.geometry.attributes.position.getX(i)
                    const y = canvasSceneRef.current.geometry.attributes.position.getY(i)
                    const z = canvasSceneRef.current.geometry.attributes.position.getZ(i)
                    const point3 = new THREE.Vector3(x, y, z)
                    if (point3.distanceTo(annotPoint) <= canvasSphereSize) {
                        annotInstance.points.push(i)
                        canvasSceneRef.current.geometry.attributes.color.setXYZ(i, classColor[0], classColor[1], classColor[2])
                    }
                }
                setColorNeedsUpdate(!colorNeedsUpdate)
                annotInstance.class_name = config.labels[selectedClassIndex].label
                dispatch(addInstance(annotInstance))
            }
            setAnnotNeedsUpdate(!annotNeedsUpdate)
        }
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
            console.log("down", e.key)
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
    }, [pointSize, canvasSphereSize, annotNeedsUpdate])

    useFrame((state) => {
        canvasPointerRef.current.position.copy(position)
        if (colorNeedsUpdate) {
            canvasSceneRef.current.geometry.attributes.color.needsUpdate = true
            setColorNeedsUpdate(!colorNeedsUpdate)
        }
    })

    return (
        <points
            onPointerMove={(e) => handleMove(e)}
            ref={canvasSceneRef}>
            <bufferGeometry>
                <bufferAttribute attach={"attributes-position"} {...verticesCached} />
                <bufferAttribute attach={"attributes-color"} {...colorsCached} />
            </bufferGeometry>
            <pointsMaterial
                size={pointSize}
                vertexColors={true}
                toneMapped={false}
            />
        </points>
    )
}

export default ScannetScene;
