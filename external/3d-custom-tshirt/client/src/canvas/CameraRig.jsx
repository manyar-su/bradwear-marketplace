import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import state from "../store";
import { useRef } from "react";

const CameraRig = ({ children }) => {
    const group = useRef();
    const snap = useSnapshot(state);

    useFrame((state, delta) => {
        const isBreakpoint = window.innerWidth <= 1260;
        const isMobile = window.innerWidth <= 600;

        // set the initial position of model
        let targetPosition = [-0.4, 0, 3.5];
        if (snap.intro) {
            if (isBreakpoint) targetPosition = [0, 0, 3.5];
            if (isMobile) targetPosition = [0, 0.2, 4];
        } else {
            if (isMobile) targetPosition = [0, 0, 4];
            else targetPosition = [0, 0, 3.5];
        }

        // set camera position
        easing.damp3(state.camera.position, targetPosition, 0.25, delta)

        // set the model rotation smoothly (horizontal: left-right drag, vertical: up-down drag)
        easing.dampE(
            group.current.rotation,
            [-state.pointer.x / 5, state.pointer.y / 10, 0],
            0.25,
            delta
        )
    })

    return (
        <group ref={group}>
            {children}
        </group>
    )
}

export default CameraRig;