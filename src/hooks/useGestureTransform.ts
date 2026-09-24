import { useState, useRef, useCallback, useEffect } from 'react';
import { ImageTransform } from '../types/tracer';

export interface UseGestureTransformProps {
  isLocked: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useGestureTransform({ isLocked, containerRef }: UseGestureTransformProps) {
  const [transform, setTransform] = useState<ImageTransform>({
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
  });

  // Track active touches
  const touchStateRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    initialTransformX: number;
    initialTransformY: number;
    initialDistance: number;
    initialScale: number;
    initialAngle: number;
    initialRotation: number;
    isPinching: boolean;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialTransformX: 0,
    initialTransformY: 0,
    initialDistance: 0,
    initialScale: 1,
    initialAngle: 0,
    initialRotation: 0,
    isPinching: false,
  });

  // Mouse drag state for desktop
  const isMouseDownRef = useRef(false);
  const mouseStartRef = useRef<{ x: number; y: number; transformX: number; transformY: number }>({
    x: 0,
    y: 0,
    transformX: 0,
    transformY: 0,
  });

  const getDistance = (t1: Touch, t2: Touch): number => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (t1: Touch, t2: Touch): number => {
    return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);
  };

  // Reset to initial centered state
  const resetTransform = useCallback(() => {
    setTransform({
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
    });
  }, []);

  // Discrete helpers
  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(10, Math.round((prev.scale + 0.25) * 100) / 100),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.2, Math.round((prev.scale - 0.25) * 100) / 100),
    }));
  }, []);

  const setScaleDirect = useCallback((newScale: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.2, Math.min(10, newScale)),
    }));
  }, []);

  const rotate90 = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  }, []);

  const toggleFlipH = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      flipH: !prev.flipH,
    }));
  }, []);

  const toggleFlipV = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      flipV: !prev.flipV,
    }));
  }, []);

  // Attach non-passive touch listeners to container to prevent iOS Safari bounce
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isLocked) return;

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStateRef.current = {
          ...touchStateRef.current,
          isDragging: true,
          isPinching: false,
          startX: touch.clientX,
          startY: touch.clientY,
          initialTransformX: transform.x,
          initialTransformY: transform.y,
        };
      } else if (e.touches.length >= 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        touchStateRef.current = {
          ...touchStateRef.current,
          isDragging: false,
          isPinching: true,
          initialDistance: getDistance(t1, t2),
          initialScale: transform.scale,
          initialAngle: getAngle(t1, t2),
          initialRotation: transform.rotation,
          startX: (t1.clientX + t2.clientX) / 2,
          startY: (t1.clientY + t2.clientY) / 2,
          initialTransformX: transform.x,
          initialTransformY: transform.y,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isLocked) return;
      // Prevent browser scroll or elastic bounce
      e.preventDefault();

      if (e.touches.length === 1 && touchStateRef.current.isDragging) {
        const touch = e.touches[0];
        const dx = touch.clientX - touchStateRef.current.startX;
        const dy = touch.clientY - touchStateRef.current.startY;

        setTransform((prev) => ({
          ...prev,
          x: touchStateRef.current.initialTransformX + dx,
          y: touchStateRef.current.initialTransformY + dy,
        }));
      } else if (e.touches.length >= 2 && touchStateRef.current.isPinching) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = getDistance(t1, t2);
        const currentMidX = (t1.clientX + t2.clientX) / 2;
        const currentMidY = (t1.clientY + t2.clientY) / 2;

        if (touchStateRef.current.initialDistance > 0) {
          const scaleMultiplier = currentDist / touchStateRef.current.initialDistance;
          const newScale = Math.max(0.2, Math.min(10, touchStateRef.current.initialScale * scaleMultiplier));

          // Also translate according to midpoint movement
          const dx = currentMidX - touchStateRef.current.startX;
          const dy = currentMidY - touchStateRef.current.startY;

          setTransform((prev) => ({
            ...prev,
            scale: newScale,
            x: touchStateRef.current.initialTransformX + dx,
            y: touchStateRef.current.initialTransformY + dy,
          }));
        }
      }
    };

    const handleTouchEnd = () => {
      touchStateRef.current.isDragging = false;
      touchStateRef.current.isPinching = false;
    };

    // Wheel zoom for mouse / desktop
    const handleWheel = (e: WheelEvent) => {
      if (isLocked) return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.2, Math.min(10, prev.scale * zoomFactor)),
      }));
    };

    // Mouse drag for desktop
    const handleMouseDown = (e: MouseEvent) => {
      if (isLocked || e.button !== 0) return;
      isMouseDownRef.current = true;
      mouseStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        transformX: transform.x,
        transformY: transform.y,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isLocked || !isMouseDownRef.current) return;
      const dx = e.clientX - mouseStartRef.current.x;
      const dy = e.clientY - mouseStartRef.current.y;
      setTransform((prev) => ({
        ...prev,
        x: mouseStartRef.current.transformX + dx,
        y: mouseStartRef.current.transformY + dy,
      }));
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isLocked, transform.x, transform.y, transform.scale, transform.rotation, containerRef]);

  return {
    transform,
    setTransform,
    resetTransform,
    zoomIn,
    zoomOut,
    setScaleDirect,
    rotate90,
    toggleFlipH,
    toggleFlipV,
  };
}
