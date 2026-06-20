import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import state from "../store";

const MODEL_URL = `${import.meta.env.BASE_URL}model.glb`;

const Shirt = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF(MODEL_URL);

    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);

    // Find mesh node with geometry
    const meshNode = Object.values(nodes).find(node => node.geometry);
    const materialKey = Object.keys(materials)[0];
    const material = materials[materialKey];

    // Clone material dan remove texture map agar warna bisa di-change
    const customMaterial = material.clone();
    customMaterial.map = null;
    customMaterial.color.set(snap.color);

    useFrame((state, delta) => {
        // Update warna smooth
        if (customMaterial.color) {
            easing.dampC(customMaterial.color, snap.color, 0.25, delta);
        }
    });

    const stateString = JSON.stringify(snap);

    if (!meshNode) {
        console.log("Nodes available:", Object.keys(nodes));
        console.log("Materials available:", Object.keys(materials));
        return null;
    }

    return (
        <group key={stateString}>
            <mesh
                castShadow={false}
                receiveShadow={false}
                geometry={meshNode.geometry}
                material={customMaterial}
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={1}
                dispose={null}
            >
                {snap.isFullTexture && (
                    <Decal
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={1}
                        map={fullTexture}
                    />
                )}
                {snap.isLogoTexture && (
                    <Decal
                        position={[snap.logoPosition.x, snap.logoPosition.y, snap.logoPosition.z]}
                        rotation={[0, 0, 0]}
                        scale={snap.logoScale}
                        map={logoTexture}
                        anisotropy={16}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}
            </mesh>
        </group>
    )
}

export default Shirt;
