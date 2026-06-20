import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import state from "../store";

const LogoPositioner = ({ onClose }) => {
    const snap = useSnapshot(state);
    const [position, setPosition] = useState({ x: 0, y: 0.04, z: 0.15 });
    const [scale, setScale] = useState(0.15);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (snap.logoPosition) {
            setPosition(snap.logoPosition);
        }
        if (snap.logoScale) {
            setScale(snap.logoScale);
        }
    }, [snap.logoPosition, snap.logoScale]);

    const handleDrag = (axis, delta) => {
        const newPosition = { ...position };
        if (axis === 'x') {
            newPosition.x = Math.max(-0.5, Math.min(0.5, position.x + delta * 0.01));
        } else if (axis === 'y') {
            newPosition.y = Math.max(-0.3, Math.min(0.4, position.y + delta * 0.01));
        } else if (axis === 'z') {
            newPosition.z = Math.max(0.05, Math.min(0.3, position.z + delta * 0.005));
        }
        setPosition(newPosition);
        state.logoPosition = newPosition;
    };

    const handleScaleChange = (newScale) => {
        setScale(newScale);
        state.logoScale = newScale;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 max-w-[90vw] shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Position Logo</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Position Controls */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Horizontal (X)
                        </label>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            value={position.x * 100}
                            onChange={(e) => handleDrag('x', parseInt(e.target.value) - position.x * 100)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vertical (Y)
                        </label>
                        <input
                            type="range"
                            min="-30"
                            max="40"
                            value={position.y * 100}
                            onChange={(e) => handleDrag('y', parseInt(e.target.value) - position.y * 100)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Depth (Z) - Forward/Backward
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            value={position.z * 100}
                            onChange={(e) => handleDrag('z', parseInt(e.target.value) - position.z * 100)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Size: {(scale * 100).toFixed(0)}%
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={scale * 100}
                            onChange={(e) => handleScaleChange(parseInt(e.target.value) / 100)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="text-xs text-gray-500 text-center mt-2">
                        X: {position.x.toFixed(2)} | Y: {position.y.toFixed(2)} | Z: {position.z.toFixed(2)}
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => {
                            const reset = { x: 0, y: 0.04, z: 0.15 };
                            setPosition(reset);
                            state.logoPosition = reset;
                            setScale(0.15);
                            state.logoScale = 0.15;
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoPositioner;