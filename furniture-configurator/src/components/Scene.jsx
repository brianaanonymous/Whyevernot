import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { Loader } from '@react-three/drei';

export const Scene = () => {
    return (
        <Canvas
            shadows
            // Default Camera settings (will be managed by Experience/Controls mostly)
            camera={{ position: [0, 1.5, 4], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
        >
            <color attach="background" args={['#f5f5f5']} />

            <Suspense fallback={null}>
                <Experience />
            </Suspense>

            {/* <Loader /> handled by suspense/HTML overlay usually, or keep it simple */}
        </Canvas>
    );
};
