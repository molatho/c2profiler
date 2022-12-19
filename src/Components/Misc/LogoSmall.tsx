import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Suspense, useMemo, useRef } from "react"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OrbitControls } from "@react-three/drei";
import { Euler } from 'three'

interface FakeRotation {
    rotation: Euler;
}

const DEG2RAD = Math.PI / 180.0;

const Scene = () => {
    const materials = useLoader(MTLLoader, process.env.PUBLIC_URL + "/logo.mtl");
    const obj = useLoader(OBJLoader, process.env.PUBLIC_URL + "/logo.obj", (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });
    const copiedScene = useMemo(() => obj.clone(), [obj])

    const mesh = useRef();

    useFrame(({ clock }) => {
        const _mesh = mesh.current as unknown as FakeRotation;
        const f1 = Math.sin(clock.getElapsedTime() * 0.50);
        const f2 = Math.sin(clock.getElapsedTime() * 0.70);
        const f3 = Math.sin(clock.getElapsedTime() * 0.90);

        if (_mesh) {
            _mesh.rotation.y = f2 * 2 * DEG2RAD;
            _mesh.rotation.x = (90 + f1 * 30) * DEG2RAD;
            _mesh.rotation.z = f3 * 10 * DEG2RAD;
        }
    })

    return <primitive
        ref={mesh}
        object={copiedScene}
        scale={100}
        rotation={[1.5707963, 0, 0]}
        position={[0, 0, -200]} />;
};


export const LogoSmall = () => {
    return <div style={{ height: "100px", width: '100%' }}>
        <Canvas orthographic
            camera={{
                position: [0, 0, 0]
            }}
        >
            <Suspense fallback={null}>
                <directionalLight color="white" position={[0, 0, 5]} />
                <OrbitControls />
                <Scene />
            </Suspense>
        </Canvas>
    </div>
}