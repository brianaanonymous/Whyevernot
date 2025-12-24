import { useTexture, Billboard, Text, RoundedBox, Line } from '@react-three/drei';

// Helper Components
const Label3D = ({ text, position }) => {
    return (
        <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
            <group renderOrder={1}>
                {/* Background Pill */}
                <RoundedBox args={[0.08, 0.035, 0.002]} radius={0.015}>
                    <meshBasicMaterial color="#404040" />
                </RoundedBox>

                {/* Text */}
                <Text
                    position={[0, 0, 0.002]}
                    fontSize={0.02}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                    characters="0123456789cm"
                >
                    {text}
                </Text>
            </group>
        </Billboard>
    );
};

const DimensionLine = ({ start, end, label }) => {
    // Vector
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];

    // Midpoint
    const mid = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        (start[2] + end[2]) / 2
    ];

    // Orientation
    const isVertical = Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > Math.abs(dz);
    const s = 0.04;

    return (
        <group>
            <Line points={[start, end]} color="#777" lineWidth={1} />

            {isVertical ? (
                <>
                    <Line points={[[start[0] - s, start[1], start[2]], [start[0] + s, start[1], start[2]]]} color="#777" lineWidth={1} />
                    <Line points={[[end[0] - s, end[1], end[2]], [end[0] + s, end[1], end[2]]]} color="#777" lineWidth={1} />
                </>
            ) : (
                <>
                    <Line points={[[start[0], start[1] - s, start[2]], [start[0], start[1] + s, start[2]]]} color="#777" lineWidth={1} />
                    <Line points={[[end[0], end[1] - s, end[2]], [end[0], end[1] + s, end[2]]]} color="#777" lineWidth={1} />
                </>
            )}

            {label && <Label3D text={label} position={mid} />}
        </group>
    );
};

export const ChairSchematic = ({ brand }) => {
    // Measurements (in meters)
    // Default (Tromso): H=84, W=46, D=52 (Seat ~46)
    // Hyde: H=87, W=44, D=55 (Seat ~48 estimated)

    const isHyde = brand === 'Hyde';

    const H = isHyde ? 0.87 : 0.84;
    const W = isHyde ? 0.44 : 0.46; // Total Width
    const D = isHyde ? 0.55 : 0.52; // Total Depth
    const SeatH = isHyde ? 0.48 : 0.46;

    const floorY = 0;
    const topY = H;
    const seatY = SeatH;

    const halfW = W / 2;
    const halfD = D / 2;

    const xOff = 0.05;
    const zOff = 0.05;

    // Format labels (cm)
    const labelH = (H * 100).toFixed(0);
    const labelSeat = (SeatH * 100).toFixed(0);
    const labelW = (W * 100).toFixed(0);
    const labelD = (D * 100).toFixed(0);

    return (
        <group>
            {/* Height Line */}
            <DimensionLine start={[halfW + xOff, floorY, 0]} end={[halfW + xOff, topY, 0]} label={labelH} />

            {/* Seat Height Line */}
            <DimensionLine start={[-halfW - xOff, floorY, 0]} end={[-halfW - xOff, seatY, 0]} label={labelSeat} />

            {/* Width Line (Front/Back) - Rendered at Depth edge */}
            <DimensionLine start={[-halfW, floorY + 0.02, halfD + zOff]} end={[halfW, floorY + 0.02, halfD + zOff]} label={labelW} />

            {/* Depth Line - Rendered at side */}
            <DimensionLine start={[halfW + xOff + 0.1, floorY + 0.02, -halfD]} end={[halfW + xOff + 0.1, floorY + 0.02, halfD]} label={labelD} />
        </group>
    );
};

export const TableDimensions = () => {
    const tableH = 0.75;
    const tFloor = 0;
    const tTop = tableH;

    return (
        <group>
            <DimensionLine start={[-0.6, tFloor, 0]} end={[-0.6, tTop, 0]} label="75" />
            <DimensionLine start={[-0.55, tTop + 0.05, 0]} end={[0.55, tTop + 0.05, 0]} label="110" />
            <DimensionLine start={[0.6, tTop, -0.35]} end={[0.6, tTop, 0.35]} label="70" />
        </group>
    );
};
