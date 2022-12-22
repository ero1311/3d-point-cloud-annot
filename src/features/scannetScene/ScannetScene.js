import * as THREE from 'three'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useMemo, useState } from "react"
import { coordsSelector, colorsSelector } from './scannetSceneSlice'
import { saveNewInstance } from '../annotBar/annotBarSlice'
import { BufferAttribute } from "three"
import { useFrame } from "@react-three/fiber"
import { classIndexSelector, annotInstanceSelector, annotLoadSelector, loadAnnotations, setAnnotStatus } from '../annotBar/annotBarSlice'
import { timeSelector } from '../timer/timerSlice'
import { colorList } from '../../config'
import { sceneSelector } from '../sceneSelector/sceneSelectorSlice'

const ScannetScene = ({ canvasSceneRef, canvasPointerRef, canvasSphereSize, canvasSetSphereSize }) => {
    const annotInstances = useSelector((state) => annotInstanceSelector(state))
    const selectedClassIndex = useSelector((state) => classIndexSelector(state))
    const annotLoadStatus = useSelector((state) => annotLoadSelector(state))
    const selectedSceneName = useSelector((state) => sceneSelector(state))
    const currentTime = useSelector((state) => timeSelector(state))
    const vertices = useSelector((state) => coordsSelector(state))
    const colors = useSelector((state) => colorsSelector(state))
    const [pointSize, setPointSize] = useState(0.01)
    const verticesCached = useMemo(() => new BufferAttribute(new Float32Array(vertices), 3), [vertices])
    const colorsCached = useMemo(() => new BufferAttribute(new Uint8Array(colors), 3, true), [colors])
    const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0))
    const [annotNeedsUpdate, setAnnotNeedsUpdate] = useState(false)
    const [colorNeedsUpdate, setColorNeedsUpdate] = useState(false)
    const [annotInstance, setAnnotInstance] = useState([])
    const dispatch = useDispatch()

    const handleMove = (e) => {
        const selectedPoint = e.intersections[0].point
        setPosition(selectedPoint)
        if (annotNeedsUpdate) {
            let currentInst = [...annotInstance]
            const classColor = colorList[selectedClassIndex]
            for (let i = 0; i < canvasSceneRef.current.geometry.attributes.position.count; i++) {
                const x = canvasSceneRef.current.geometry.attributes.position.getX(i)
                const y = canvasSceneRef.current.geometry.attributes.position.getY(i)
                const z = canvasSceneRef.current.geometry.attributes.position.getZ(i)
                const point3 = new THREE.Vector3(x, y, z)
                if (point3.distanceTo(selectedPoint) <= canvasSphereSize) {
                    currentInst.push(i)
                    canvasSceneRef.current.geometry.attributes.color.setXYZ(i, classColor[0], classColor[1], classColor[2])
                }
            }
            setColorNeedsUpdate(true)
            setAnnotInstance([...currentInst])
        }
    }

    useEffect(() => {
        if (annotLoadStatus === 'idle'){
            dispatch(loadAnnotations(selectedSceneName))
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
                case 'Alt':
                    if (selectedClassIndex !== null)
                        setAnnotNeedsUpdate(true)
                    console.log(annotNeedsUpdate, annotInstance)
                    break
                default:
                    break
            }
            console.log("down", e.key)
        }
        const handleKeyUp = (e) => {
            switch (e.key) {
                case 'Alt':
                    if (annotNeedsUpdate) {
                        setAnnotNeedsUpdate(false)
                        dispatch(saveNewInstance({
                            classIndex: selectedClassIndex,
                            points: [...annotInstance],
                            time: currentTime,
                            sceneName: selectedSceneName
                        }))
                        setAnnotInstance(prevInst => [])
                    }
                    break
                default:
                    break
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [
        pointSize, 
        canvasSphereSize, 
        canvasSetSphereSize, 
        annotInstance, 
        currentTime, 
        dispatch, 
        annotNeedsUpdate, 
        selectedClassIndex, 
        selectedSceneName, 
        annotLoadStatus
    ])

    useFrame((state) => {
        canvasPointerRef.current.position.copy(position)
        if (colorNeedsUpdate) {
            canvasSceneRef.current.geometry.attributes.color.needsUpdate = true
            setColorNeedsUpdate(false)
        }
        if (annotLoadStatus === 'loaded') {
            Object.keys(annotInstances).forEach((key) => {
                let currInst = annotInstances[key]
                let currColor = colorList[currInst.classIndex]
                currInst.points.forEach((item) => {
                    canvasSceneRef.current.geometry.attributes.color.setXYZ(item, currColor[0], currColor[1], currColor[2])
                })
            })
            canvasSceneRef.current.geometry.attributes.color.needsUpdate = true
            dispatch(setAnnotStatus('finished'))
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
