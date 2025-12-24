import React from 'react';
import { Environment, ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { DynamicModel } from './DynamicModel';
import { ChairSchematic, TableDimensions } from './Dimensions';
import { getTableSKU, getChairSKU } from '../utils/skuMap';
import { useThree } from '@react-three/fiber';

// Helper to get hex from the store color string (Mock, ideally usually in utils)
// We will access the hex map from Sidebar logic or shared constant. 
// For now we will pass the color ID and let DynamicModel apply it if it's a valid hex, 
// OR we map it here. Let's map it here for safety.
const COLOR_MAP = {
    'Black': '#333333',
    'Grey': '#888888',
    'White': '#f0f0f0',
    'Beige': '#D8C8B8',
    'Navy': '#203050',
    'Green': '#305030',
    'Red': '#803030'
};

const ZoomController = () => {
    const { zoomLevel } = useConfiguratorStore();
    const { camera } = useThree();

    React.useEffect(() => {
        camera.zoom = zoomLevel;
        camera.updateProjectionMatrix();
    }, [zoomLevel, camera]);

    return null;
};

export const Experience = () => {
    const { table, chair, showTable, showChairs, showDimensions } = useConfiguratorStore();

    // Resolve SKUs
    const tableID = getTableSKU(table.brand, table.color);
    const chairID = getChairSKU(chair.brand, 1, chair.color);

    const tableUrl = `/models/${tableID}.glb`;
    const chairUrl = `/models/${chairID}.glb`;

    // RESOLVE TINT
    // If we are using a "Fallback" SKU (like White for colors), we need to pass the tint.
    // If it's a native file (Black/Grey), we don't need tint (or we can tint anyway).
    // Simple logic: Always pass tint if it's not one of the base files?
    // Or just Pass Tint for everyone to ensure exact match?
    // Let's pass Tint for everyone.
    // const tableTint = COLOR_MAP[table.color];
    // const chairTint = COLOR_MAP[chair.color];

    const isDeep = table.size === '200x100';
    const tableScale = isDeep ? [1.3, 1, 1.3] : [1, 1, 1];

    // Universal Chair Sizing
    // Universal Chair Sizing
    // We want ALL chairs to be ~87cm tall.
    // The DynamicModel will auto-scale "Hyde" (huge) and "Tromso" (normal) to this height.
    const targetHeight = 0.87;
    const chairScale = [1, 1, 1]; // Default, overridden by targetHeight

    const X_DIST = 1.6;
    const Z_DIST = 1.3;
    const SIDE_OFFSET = 0.55;
    const CHAIR_Y_OFFSET = 0;
    const TABLE_Y_OFFSET = 0;

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1.8, 4.5]} fov={45} />
            <ZoomController />

            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            <Environment preset="city" />

            <OrbitControls
                makeDefault
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1}
                target={[0, 0, 0]}
                minDistance={1}
                maxDistance={10}
                zoomSpeed={0.2}
                enableDamping={true}
            />

            <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2.5} far={1} />

            <group>
                {showTable && (
                    <group position={[0, TABLE_Y_OFFSET, 0]}>
                        <DynamicModel
                            key={tableUrl}
                            id="table"
                            url={tableUrl}
                            scale={tableScale}
                        // We rely on native textures for table for now unless user wants tint
                        />
                        {showDimensions && <TableDimensions />}
                    </group>
                )}

                <group key={`chairs-${chair.count}-${chair.color}-${showDimensions}-${table.color}`}>
                    {showChairs && parseInt(chair.count) === 2 && (
                        <>
                            <group position={[-X_DIST, CHAIR_Y_OFFSET, 0]} rotation={[0, -Math.PI / 2, 0]}>
                                <DynamicModel key="c2_1" id="c2_1" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                            <group position={[X_DIST, CHAIR_Y_OFFSET, 0]} rotation={[0, Math.PI / 2, 0]}>
                                <DynamicModel key="c2_2" id="c2_2" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                        </>
                    )}
                    {/* 4 Chairs */}
                    {showChairs && parseInt(chair.count) >= 4 && (
                        <>
                            <group position={[-X_DIST, CHAIR_Y_OFFSET, SIDE_OFFSET]} rotation={[0, -Math.PI / 2, 0]}>
                                <DynamicModel key="c4_1" id="c4_1" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                            </group>
                            <group position={[-X_DIST, CHAIR_Y_OFFSET, -SIDE_OFFSET]} rotation={[0, -Math.PI / 2, 0]}>
                                <DynamicModel key="c4_2" id="c4_2" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                            </group>
                            <group position={[X_DIST, CHAIR_Y_OFFSET, SIDE_OFFSET]} rotation={[0, Math.PI / 2, 0]}>
                                <DynamicModel key="c4_3" id="c4_3" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                            </group>
                            <group position={[X_DIST, CHAIR_Y_OFFSET, -SIDE_OFFSET]} rotation={[0, Math.PI / 2, 0]}>
                                <DynamicModel key="c4_4" id="c4_4" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                            </group>
                        </>
                    )}
                    {/* 6 Chairs */}
                    {showChairs && parseInt(chair.count) === 6 && (
                        <>
                            <group position={[-X_DIST, CHAIR_Y_OFFSET, 0]} rotation={[0, -Math.PI / 2, 0]}>
                                <DynamicModel key="c6_1" id="c6_1" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                            <group position={[X_DIST, CHAIR_Y_OFFSET, 0]} rotation={[0, Math.PI / 2, 0]}>
                                <DynamicModel key="c6_2" id="c6_2" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                            <group position={[-SIDE_OFFSET, CHAIR_Y_OFFSET, -Z_DIST]} rotation={[0, 0, 0]}>
                                <DynamicModel key="c6_3" id="c6_3" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                            <group position={[SIDE_OFFSET, CHAIR_Y_OFFSET, -Z_DIST]} rotation={[0, 0, 0]}>
                                <DynamicModel key="c6_4" id="c6_4" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                            <group position={[-SIDE_OFFSET, CHAIR_Y_OFFSET, Z_DIST]} rotation={[0, Math.PI, 0]}>
                                <DynamicModel key="c6_5" id="c6_5" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                            <group position={[SIDE_OFFSET, CHAIR_Y_OFFSET, Z_DIST]} rotation={[0, Math.PI, 0]}>
                                <DynamicModel key="c6_6" id="c6_6" url={chairUrl} scale={chairScale} targetHeight={targetHeight} />
                                {showDimensions && <ChairSchematic brand={chair.brand} />}
                            </group>
                        </>
                    )}
                </group>
            </group>
        </>
    );
};
