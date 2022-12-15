import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from "@react-three/drei";
import { Euler } from 'three'

interface FakeRotation {
    rotation: Euler;
}

const Scene = () => {
    const obj = useLoader(OBJLoader, "logo.obj");

    const myMesh = useRef();

    useFrame(({ clock }) => {
        const _mesh = myMesh.current as unknown as FakeRotation;
        const y = Math.sin(clock.getElapsedTime() * (Math.PI / 180) * 20);
        const x = Math.cos(clock.getElapsedTime() * (Math.PI / 180) * 30);
        const z = Math.cos(clock.getElapsedTime() * (Math.PI / 180) * 25);
        if (_mesh) {
            _mesh.rotation.y = (y * 5) * (Math.PI / 180);
            _mesh.rotation.x = 1.5707963 + (x * 20) * (Math.PI / 180);
            _mesh.rotation.z = (y * 20) * (Math.PI / 180);
        }
    })

    return <primitive
        ref={myMesh}
        object={obj}
        scale={100}
        rotation={[1.5707963, 0, 0]}
        position={[0, 0, -200]} />;
};


export const Logo = () => {

    return <div style={{ height: "100px", width: '100vw' }}>
        <Canvas orthographic
            camera={{
                position: [0, 0, 0]
            }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.1} />
                <directionalLight color="grey" position={[0, 0, 5]} />
                <OrbitControls />
                <Scene />
            </Suspense>
        </Canvas>
    </div>
}