import React, { useLayoutEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Helper: Calculate Box in Local Space (relative to scene root)
const getLocalBox = (root, filterFn = () => true) => {
    const box = new THREE.Box3();
    const traverse = (node, matrixStack) => {
        const currentMatrix = matrixStack.clone().multiply(node.matrix);
        // Check for ANY geometry (Mesh, SkinnedMesh, etc.)
        if (node.geometry && filterFn(node)) {
            if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
            const gBox = node.geometry.boundingBox.clone();
            gBox.applyMatrix4(currentMatrix);
            box.union(gBox);
        }
        for (const child of node.children) {
            traverse(child, currentMatrix);
        }
    };
    traverse(root, new THREE.Matrix4()); // Start with Identity
    return box;
};

// DynamicModel with Tinting Support
export const DynamicModel = (props) => {
    const { url, scale = [1, 1, 1], id = '0', color = null } = props;

    // Unique URL for caching
    const uniqueUrl = `${url}?id=${id}`;
    const { scene: masterScene } = useGLTF(uniqueUrl);

    // Clone the scene to ensure we have a fresh instance for this component
    // This prevents mutating the cached GLTF which causes bugs across instances
    const scene = React.useMemo(() => masterScene.clone(true), [masterScene]);
    const groupRef = useRef();

    useLayoutEffect(() => {
        if (!scene || !groupRef.current) return;

        // 1. Reset Transform
        scene.position.set(0, 0, 0);
        scene.rotation.set(0, 0, 0);
        scene.scale.set(1, 1, 1);
        scene.updateMatrixWorld(true);

        // 2. Measure Full Box in Local Space
        const fullBox = getLocalBox(scene);

        let targetScale = [...scale];
        let offsetY = 0;
        let pX = 0;
        let pZ = 0;

        // Log the box for debugging
        console.log(`[DynamicModel] Box Check ${uniqueUrl}: Empty? ${fullBox.isEmpty()}`, fullBox);

        // 3. Traverse & Setup (Tinting)
        scene.traverse((child) => {
            if (child.isMesh) {
                child.frustumCulled = false;
                child.castShadow = true;
                child.receiveShadow = true;

                // Dynamic Tinting Logic
                if (color) {
                    if (!child.userData.originalMaterial) {
                        child.userData.originalMaterial = child.material.clone();
                    }
                    const tintedMat = child.userData.originalMaterial.clone();
                    tintedMat.color.set(color);
                    child.material = tintedMat;
                }
            }
        });

        if (fullBox.isEmpty()) {
            console.warn(`[DynamicModel] Box is empty for ${uniqueUrl}. Using safe default scale 0.5.`);
            // Safe Fallback: 0.5 scale is better than 1.0 (Massive)
            targetScale = [0.5, 0.5, 0.5];

            // DEBUG PROBE: Why is it empty?
            scene.traverse(c => {
                if (c.isMesh) console.log(`[DynamicModel] Found Mesh: ${c.name}, V: ${c.geometry.attributes.position.count}`);
            });

        } else {
            const { min: minY, max: maxY } = fullBox;

            // 4. Heuristic Scale & Position Logic
            if (props.targetHeight) {
                // HEURISTIC ANALYSIS
                // Case A: "Floor Origin with Junk/Reflection" (e.g. Hyde: Min -0.7, Max 1.7)
                // Case B: "Centered/Full Geometry" (e.g. Cube: Min -0.5, Max 0.5)

                const absMin = Math.abs(minY);
                // If negative part is relatively small compared to positive part (< 60%), treat as Reflection/Junk.
                // Hyde: 0.7 / 1.7 = 0.41 (< 0.6) -> Reflection Mode.
                const isReflection = (maxY > 0) && (absMin < 0.6 * maxY);

                if (isReflection) {
                    // MODE A: REFLECTION / JUNK / FLOOR-BASED
                    // Scale based on HEIGHT ABOVE ORIGIN (MaxY)
                    const heightAboveFloor = maxY;
                    // Avoid potential division by zero
                    if (heightAboveFloor > 0.01) {
                        const ratio = props.targetHeight / heightAboveFloor;
                        if (ratio > 0.1 && ratio < 3.0) {
                            targetScale = [ratio, ratio, ratio];
                        }
                    }

                    // Position: Trust Origin (0). 
                    offsetY = 0;
                    console.log(`[DynamicModel] Heuristic: REFLECTION. Scale MaxY (${heightAboveFloor.toFixed(2)}) to ${props.targetHeight}. Offset 0.`);

                } else {
                    // MODE B: STANDARD / FLOATING
                    // Scale based on TOTAL HEIGHT
                    const totalHeight = maxY - minY;

                    if (totalHeight > 0.01) {
                        const ratio = props.targetHeight / totalHeight;
                        if (ratio > 0.1 && ratio < 3.0) {
                            targetScale = [ratio, ratio, ratio];
                        }
                    }

                    // Position: Align BOTTOM to Floor
                    offsetY = -minY;
                    console.log(`[DynamicModel] Heuristic: STANDARD. Scale TotalH (${totalHeight.toFixed(2)}) to ${props.targetHeight}. Offset Bottom.`);
                }
            }

            // 5. Calculate Center Offset
            // CRITICAL FIX: Do NOT Auto-Center X/Z. 
            // If the model has "junk" at X=100m, auto-centering will shift the real chair by -50m, making it invisible.
            // We MUST trust the model origin (0,0) for lateral placement.
            // Only adjust Y (Height).

            pX = 0;
            pZ = 0;

            // console.log(`[DynamicModel] Centering: Disabled (Trust Origin). pX=${pX}, pZ=${pZ}`);
        }

        // 6. Apply Scale to Group
        if (targetScale.every(s => Number.isFinite(s))) {
            groupRef.current.scale.set(targetScale[0], targetScale[1], targetScale[2]);
        } else {
            // Fallback to 0.5
            groupRef.current.scale.set(0.5, 0.5, 0.5);
        }

        // Apply Final Position (Local Space)
        if (Number.isFinite(pX) && Number.isFinite(offsetY) && Number.isFinite(pZ)) {
            scene.position.set(pX, offsetY, pZ);
        } else {
            scene.position.set(0, 0, 0);
        }

        scene.visible = true; // Force visible
        scene.updateMatrixWorld(true);

    }, [scene, url, color, props.targetHeight, props.scale]);

    return (
        <group ref={groupRef} scale={scale}> {/* Apply calculated scale here */}
            <primitive object={scene} />
        </group>
    );
};
