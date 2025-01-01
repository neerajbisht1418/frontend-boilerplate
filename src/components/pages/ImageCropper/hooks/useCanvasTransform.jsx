import { useState } from 'react';

export const useCanvasTransform = ({ canvasRef }) => {
    const [fabricPosition, setFabricPosition] = useState({ x: 0, y: 0 });
    const [fabricScale, setFabricScale] = useState(1);
    const [fabricRotation, setFabricRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsDragging(true);
        setDragStart({ x: x - fabricPosition.x, y: y - fabricPosition.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newX = x - dragStart.x;
        const newY = y - dragStart.y;
        const maxOffset = canvasRef.current.width / 2;

        setFabricPosition({
            x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
            y: Math.max(-maxOffset, Math.min(maxOffset, newY))
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return {
        fabricPosition,
        fabricScale,
        fabricRotation,
        isDragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        setFabricScale,
        setFabricRotation
    };
};