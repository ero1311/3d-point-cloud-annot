import React, { useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { extend, useThree, useRender } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'

const ScannetScene = () => {
    const widthDensity = data.widthDensity
    const depthDensity = data.depthDensity
    const geometrySize = data.geometrySize
    const dotColor = data.dotColor
    const dotSize = data.dotSize
    const heightMultiplier = data.heightMultiplier
    const mountainVariation = data.mountainVariation

    const vertices = useMemo(() => {
        return getNewVertices({ geometrySize, widthDensity, depthDensity, heightMultiplier, mountainVariation })
    }, [geometrySize, widthDensity, depthDensity, heightMultiplier, mountainVariation])

    return (
        <points
        // geometry={geometry}
        >
            <bufferGeometry attach="geometry">
                <a.bufferAttribute
                    attachObject={['attributes', 'position']}
                    count={vertices.length / 3}
                    // this renders the dots fine
                    array={new Float32Array(vertices)}
                    // but I can't get the interpolated values to work
                    // might be because bufferAttribute must accept a typed array?
                    // array={new Float32Array(factor)}
                    itemSize={3}
                    onUpdate={(self) => {
                        self.needsUpdate = true
                        self.verticesNeedUpdate = true
                    }}
                />
            </bufferGeometry>

            <pointsMaterial sizeAttenuation attach="material" color="#00ff00" depthWrite={false} size={3} />
        </points>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
