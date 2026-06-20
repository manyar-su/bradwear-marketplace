import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import Shirt from "./Shirt";
import BackDrop from "./Backdrop";
import CameraRig from "./CameraRig";

const CanvasModel = () => {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 0], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
            className="w-full h-full max-w-full transition-none ease-in"
        >
            <color attach="background" args={["#ffffff"]} />
            <ambientLight intensity={1} />
            <Environment preset="city" />
            <CameraRig>
                <BackDrop />
                <Center>
                    <Shirt />
                </Center>
            </CameraRig>
        </Canvas>
    )
}

export default CanvasModel;
