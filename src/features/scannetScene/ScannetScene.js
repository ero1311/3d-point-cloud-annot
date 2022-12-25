import * as THREE from 'three'
import { useSelector, useDispatch } from "react-redux"
import { useCallback, useEffect, useMemo, useState } from "react"
import { coordsSelector, colorsSelector } from './scannetSceneSlice'
import { saveNewInstance } from '../annotBar/annotBarSlice'
import { BufferAttribute } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { classIndexSelector, annotInstanceSelector, annotLoadSelector, annotCurrIdSelector, loadAnnotations, setAnnotStatus } from '../annotBar/annotBarSlice'
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
    canvasSetNegativeClicks,
    canvasAnnotInstance,
    canvasSetAnnotInstance
}) => {
    const raycaster = useThree((state) => state.raycaster)
    const currId = useSelector((state) => annotCurrIdSelector(state))
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
    const dispatch = useDispatch()

    const colorSphereSelect = useCallback((point, toColor) => {
        let coloredPoints = []
        for (let i = 0; i < canvasSceneRef.current.geometry.attributes.position.count; i++) {
            const x = canvasSceneRef.current.geometry.attributes.position.getX(i)
            const y = canvasSceneRef.current.geometry.attributes.position.getY(i)
            const z = canvasSceneRef.current.geometry.attributes.position.getZ(i)
            const point3 = new THREE.Vector3(x, y, z)
            if (point3.distanceTo(point) <= canvasSphereSize) {
                coloredPoints.push(i)
                canvasSceneRef.current.geometry.attributes.color.setXYZ(i, toColor[0], toColor[1], toColor[2])
            }
        }

        return coloredPoints
    }, [canvasSceneRef, canvasSphereSize])

    const colorPosNegClicks = (clicksPlaced, toColor) => {
        Object.keys(clicksPlaced).forEach((key) => {
            let currClickSphere = clicksPlaced[key]
            currClickSphere.forEach((index) => {
                canvasSceneRef.current.geometry.attributes.color.setXYZ(index, toColor[0], toColor[1], toColor[2])
            })
        })
    }

    const handleMove = useCallback((e) => {
        const selectedPoint = e.intersections[0].point
        setPosition(selectedPoint)
        if (annotNeedsUpdate) {
            let currentInst = [...canvasAnnotInstance]
            const classColor = colorList[selectedClassIndex]
            let selectedPoints = colorSphereSelect(selectedPoint, classColor)
            currentInst.push(...selectedPoints)
            setColorNeedsUpdate(true)
            canvasSetAnnotInstance([...currentInst])
        }
    }, [annotNeedsUpdate,
        canvasAnnotInstance,
        canvasSetAnnotInstance,
        selectedClassIndex,
        colorSphereSelect
    ])

    useEffect(() => {
        if (annotLoadStatus === 'idle') {
            dispatch(loadAnnotations(selectedSceneName))
        }
        const handleKeyDown = (e) => {
            let intersection, classColor, clickSphere
            switch (e.key) {
                case 'i': //increase point size
                    if (pointSize * 1.2 <= 0.5)
                        setPointSize(pointSize * 1.2)
                    break
                case 'd': //decrease point size
                    if (pointSize / 1.2 >= 0.01)
                        setPointSize(pointSize / 1.2)
                    break
                case '+': //increase pointer size
                    canvasSetSphereSize(canvasSphereSize * 1.02)
                    break
                case '-': //decrease pointer size
                    canvasSetSphereSize(canvasSphereSize * 0.98)
                    break
                case 'Alt': //start brush annotation
                    if (selectedClassIndex !== null)
                        setAnnotNeedsUpdate(true)
                    break
                case 'p': //put positive click
                    intersection = raycaster.intersectObject(canvasSceneRef.current, true)
                    if (intersection.length > 0) {
                        intersection = intersection[0]
                        classColor = [0., 1., 0.]
                        clickSphere = colorSphereSelect(intersection.point, classColor)
                        clickSphere.push(intersection.index)
                        canvasSetPositiveClicks((clicks) => ({
                            ...clicks,
                            [String(intersection.index)]: clickSphere
                        }))
                        setColorNeedsUpdate(true)
                    }
                    break
                case 'n': //put negative click
                    intersection = raycaster.intersectObject(canvasSceneRef.current, true)
                    if (intersection.length > 0) {
                        intersection = intersection[0]
                        classColor = [1., 0., 0.]
                        clickSphere = colorSphereSelect(intersection.point, classColor)
                        clickSphere.push(intersection.index)
                        canvasSetNegativeClicks((clicks) => ({
                            ...clicks,
                            [String(intersection.index)]: clickSphere
                        }))
                        setColorNeedsUpdate(true)
                    }
                    break
                case ' ': //finish instance
                    dispatch(saveNewInstance({
                        currId: currId,
                        classIndex: selectedClassIndex,
                        points: [...canvasAnnotInstance],
                        posClicks: [...Object.keys(canvasInstPositiveClicks)],
                        negClicks: [...Object.keys(canvasInstNegativeClicks)],
                        time: currentTime,
                        sceneName: selectedSceneName
                    }))
                    canvasSetAnnotInstance(prevInst => [])
                    break
                default:
                    break
            }
        }
        const handleKeyUp = (e) => {
            switch (e.key) {
                case 'Alt':
                    if (annotNeedsUpdate) {
                        setAnnotNeedsUpdate(false)
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
        canvasAnnotInstance,
        canvasSetAnnotInstance,
        currentTime,
        currId,
        dispatch,
        annotNeedsUpdate,
        selectedClassIndex,
        selectedSceneName,
        annotLoadStatus,
        canvasSceneRef,
        canvasInstPositiveClicks,
        canvasInstNegativeClicks,
        canvasSetNegativeClicks,
        canvasSetPositiveClicks,
        colorSphereSelect,
        raycaster
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
            if (annotLoadStatus === 'updated') {
                let instColor = colorList[selectedClassIndex]
                canvasAnnotInstance.forEach((item) => {
                    canvasSceneRef.current.geometry.attributes.color.setXYZ(item, instColor[0], instColor[1], instColor[2])
                })
                colorPosNegClicks(canvasInstPositiveClicks, [0., 1., 0.])
                colorPosNegClicks(canvasInstNegativeClicks, [1., 0., 0.])
            } else {
                canvasSetPositiveClicks({})
                canvasSetNegativeClicks({})
            }
            dispatch(setTime(annotTime))
            canvasSceneRef.current.geometry.attributes.color.needsUpdate = true
            dispatch(setAnnotStatus('finished'))
        }
    })

    return (
        <points
            onPointerMove={handleMove}
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
