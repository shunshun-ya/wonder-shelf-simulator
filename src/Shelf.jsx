import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text, Float } from '@react-three/drei'
import * as THREE from 'three'

// Wood Texture Constants (Simulated with colors for now, look premium)
const WOOD_MATERIAL = {
    main: "#c29b61", // Slightly golden wood
    dark: "#a67e45",
    light: "#e5c38b",
    side: "#b08953"
}

const METAL_MATERIAL = {
    silver: "#e2e8f0",
    dark: "#475569"
}

function Board({ width, depth, height, position, color = WOOD_MATERIAL.main }) {
    // width: X, depth: Z, thickness: Y (standard 17)
    const w = width / 10; // scale down for Three.js (100mm = 10 units? let's do 1mm = 0.01 units)
    const d = depth / 10;
    const t = 1.7; // 17mm

    return (
        <group position={[position[0] / 10, position[1] / 10 + t / 2, position[2] / 10]}>
            <mesh receiveShadow castShadow>
                <boxGeometry args={[w, t, d]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Wood grain edges simulation */}
            <mesh position={[0, 0, d / 2 + 0.01]}>
                <boxGeometry args={[w, t, 0.01]} />
                <meshStandardMaterial color={WOOD_MATERIAL.side} roughness={0.6} />
            </mesh>
        </group>
    )
}

function Pole({ length, diameter, position, color = WOOD_MATERIAL.main }) {
    const h = length / 10;
    const r = (diameter / 10) / 2;

    return (
        <mesh position={[position[0] / 10, position[1] / 10 + h / 2, position[2] / 10]} castShadow receiveShadow>
            <cylinderGeometry args={[r, r, h, 32]} />
            <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
    )
}

function Hardware({ type, position }) {
    if (type === 'adjuster') {
        return (
            <mesh position={[position[0] / 10, position[1] / 10 - 0.5, position[2] / 10]}>
                <cylinderGeometry args={[1.5, 1.5, 1, 16]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>
        )
    }
    return null;
}

export default function ShelfPreview({ config, data }) {
    const { board, layers, footer } = config;
    const { shelf_board_thickness_mm, pole_diameter_mm } = data.specifications;

    // Calculate geometry
    const w = board.width;
    const d = board.depth;
    const padding = 40; // distance from edge to pole center (estimate)

    const poleOffset = {
        x: w / 2 - padding,
        z: d / 2 - padding
    };

    const polePositions = [
        [-poleOffset.x, -poleOffset.z],
        [poleOffset.x, -poleOffset.z],
        [-poleOffset.x, poleOffset.z],
        [poleOffset.x, poleOffset.z]
    ];

    let currentHeight = 0;

    return (
        <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[120, 100, 120]} fov={40} />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} enableDamping />

            <ambientLight intensity={0.5} />
            <spotLight position={[200, 300, 200]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-100, 200, -100]} intensity={1} />
            <Environment preset="city" />

            <group position={[0, -20, 0]}> {/* Bring floor down a bit */}
                {/* Base Board or Footer level */}
                {/* Usually it's: Footer -> Pole -> Board */}

                {layers.map((layer, idx) => {
                    const poleData = data.parts.poles.find(p => p.model === layer.poleModel);
                    if (!poleData) return null;

                    const layerElements = (
                        <group key={idx}>
                            {/* Poles for this level */}
                            {polePositions.map(([px, pz], pIdx) => (
                                <Pole
                                    key={`${idx}-${pIdx}`}
                                    length={poleData.actual_length}
                                    diameter={pole_diameter_mm}
                                    position={[px, currentHeight, pz]}
                                />
                            ))}

                            {/* Board for this level */}
                            <Board
                                width={w}
                                depth={d}
                                height={shelf_board_thickness_mm}
                                position={[0, currentHeight + poleData.actual_length, 0]}
                            />
                        </group>
                    );

                    // Update height for next level: sum of actual length + board thickness
                    currentHeight += poleData.actual_length + shelf_board_thickness_mm;
                    return layerElements;
                })}

                {/* Adjusters at the bottom */}
                {polePositions.map(([px, pz], pIdx) => (
                    <Hardware key={`foot-${pIdx}`} type="adjuster" position={[px, 0, pz]} />
                ))}

                <ContactShadows resolution={1024} scale={200} blur={2} opacity={0.3} far={200} floor={0} />
            </group>

            <gridHelper args={[200, 20, "#2a2a2a", "#1a1a1a"]} position={[0, -20, 0]} />
        </Canvas>
    )
}
