import * as THREE from 'three'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useMemo, useState } from "react"
import { coordsSelector, colorsSelector } from './scannetSceneSlice'
import { saveNewInstance } from '../annotBar/annotBarSlice'
import { BufferAttribute } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { classIndexSelector, annotInstanceSelector, annotLoadSelector, loadAnnotations, setAnnotStatus } from '../annotBar/annotBarSlice'
import { timeSelector, setTime } from '../timer/timerSlice'
import { colorList } from '../../config'
import { sceneSelector } from '../sceneSelector/sceneSelectorSlice'

const ScannetScene = ({
    canvasSceneRef,
    canvasPointerRef,
    canvasSphereSize,
    canvasSetSphereSize,
    canvasInstPositiveClicks,
    canvasInstNegativeClicks,
    canvasSetPositiveClicks,
    canvasSetNegativeClicks
}) => {
    const camera = useThree((state) => state.camera)
    const pointer = useThree((state) => state.pointer)
    const raycaster = useThree((state) => state.raycaster)
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
        if (annotLoadStatus === 'idle') {
            dispatch(loadAnnotations(selectedSceneName))
        }
        const handleKeyDown = (e) => {
            let intersection, classColor, selected_x, selected_y, selected_z, selectedPoint, clickSphere
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
                case 'p':
                    clickSphere = []
                    raycaster.setFromCamera(pointer, camera)
                    intersection = raycaster.intersectObject(canvasSceneRef.current, true)
                    if (intersection.length > 0) {
                        intersection = intersection[0]
                        classColor = [0., 1., 0.]
                        selected_x = canvasSceneRef.current.geometry.attributes.position.getX(intersection.index)
                        selected_y = canvasSceneRef.current.geometry.attributes.position.getY(intersection.index)
                        selected_z = canvasSceneRef.current.geometry.attributes.position.getZ(intersection.index)
                        selectedPoint = new THREE.Vector3(selected_x, selected_y, selected_z)
                        for (let i = 0; i < canvasSceneRef.current.geometry.attributes.position.count; i++) {
                            const x = canvasSceneRef.current.geometry.attributes.position.getX(i)
                            const y = canvasSceneRef.current.geometry.attributes.position.getY(i)
                            const z = canvasSceneRef.current.geometry.attributes.position.getZ(i)
                            const point3 = new THREE.Vector3(x, y, z)
                            if (point3.distanceTo(selectedPoint) <= canvasSphereSize) {
                                clickSphere.push(i)
                                canvasSceneRef.current.geometry.attributes.color.setXYZ(i, classColor[0], classColor[1], classColor[2])
                            }
                        }
                        clickSphere.push(intersection.index)
                        canvasSetPositiveClicks((clicks) => ({
                            ...clicks,
                            [String(intersection.index)]: clickSphere
                        }))
                        setColorNeedsUpdate(true)
                    }
                    break
                case 'n':
                    clickSphere = []
                    raycaster.setFromCamera(pointer, camera)
                    intersection = raycaster.intersectObject(canvasSceneRef.current, true)
                    if (intersection.length > 0) {
                        intersection = intersection[0]
                        classColor = [1., 0., 0.]
                        selected_x = canvasSceneRef.current.geometry.attributes.position.getX(intersection.index)
                        selected_y = canvasSceneRef.current.geometry.attributes.position.getY(intersection.index)
                        selected_z = canvasSceneRef.current.geometry.attributes.position.getZ(intersection.index)
                        selectedPoint = new THREE.Vector3(selected_x, selected_y, selected_z)
                        for (let i = 0; i < canvasSceneRef.current.geometry.attributes.position.count; i++) {
                            const x = canvasSceneRef.current.geometry.attributes.position.getX(i)
                            const y = canvasSceneRef.current.geometry.attributes.position.getY(i)
                            const z = canvasSceneRef.current.geometry.attributes.position.getZ(i)
                            const point3 = new THREE.Vector3(x, y, z)
                            if (point3.distanceTo(selectedPoint) <= canvasSphereSize) {
                                clickSphere.push(i)
                                canvasSceneRef.current.geometry.attributes.color.setXYZ(i, classColor[0], classColor[1], classColor[2])
                            }
                        }
                        clickSphere.push(intersection.index)
                        canvasSetNegativeClicks((clicks) => ({
                            ...clicks,
                            [String(intersection.index)]: clickSphere
                        }))
                        setColorNeedsUpdate(true)
                    }
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
        if (annotLoadStatus === 'loaded' || annotLoadStatus === 'updated') {
            canvasSceneRef.current.geometry.attributes.color.copyArray(new Uint8Array(colors))
            let annotTime = 0
            Object.keys(annotInstances).forEach((key) => {
                let currInst = annotInstances[key]
                let currColor = colorList[currInst.classIndex]
                currInst.points.forEach((item) => {
                    canvasSceneRef.current.geometry.attributes.color.setXYZ(item, currColor[0], currColor[1], currColor[2])
                })
                annotTime = annotInstances[key].time
            })
            if (annotLoadStatus === 'updated'){
                Object.keys(canvasInstPositiveClicks).forEach((key) => {
                    let currClickSphere = canvasInstPositiveClicks[key]
                    let currColor = [0., 1., 0.]
                    currClickSphere.forEach((index) => {
                        canvasSceneRef.current.geometry.attributes.color.setXYZ(index, currColor[0], currColor[1], currColor[2])
                    })
                })
                Object.keys(canvasInstNegativeClicks).forEach((key) => {
                    let currClickSphere = canvasInstNegativeClicks[key]
                    let currColor = [1., 0., 0.]
                    currClickSphere.forEach((index) => {
                        canvasSceneRef.current.geometry.attributes.color.setXYZ(index, currColor[0], currColor[1], currColor[2])
                    })
                })
            }
            dispatch(setTime(annotTime))
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
