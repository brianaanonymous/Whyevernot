
import React from 'react';
import { IconMinus, IconPlus, IconRuler } from './Icons';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

export const CanvasControls = () => {
    const { showDimensions, setShowDimensions, zoomLevel, setZoomLevel } = useConfiguratorStore();

    const handleZoom = (delta) => {
        const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));
        setZoomLevel(newZoom);
    };

    return (
        <div className="toolbar-float">
            <button className="tool-btn" title="Zoom Out" onClick={() => handleZoom(-0.2)}>
                <IconMinus />
            </button>
            <button className="tool-btn" title="Zoom In" onClick={() => handleZoom(0.2)}>
                <IconPlus />
            </button>
            <div className="divider" />
            <button
                className={`tool-btn ${showDimensions ? 'active' : ''}`}
                title="Show Dimensions"
                onClick={() => setShowDimensions(!showDimensions)}
            >
                <IconRuler />
            </button>
        </div>
    );
};
