/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Lock,
  Unlock,
  Sliders,
  HelpCircle,
  Camera,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import {
  GridConfig,
  ImageAdjustments,
  ReferenceImage,
} from './types/tracer';
import { SAMPLE_IMAGES } from './data/sampleImages';
import { useCamera } from './hooks/useCamera';
import { useGestureTransform } from './hooks/useGestureTransform';
import { GridOverlay } from './components/GridOverlay';
import { QuickToolbar } from './components/QuickToolbar';
import { ControlPanel } from './components/ControlPanel';
import { SamplePickerModal } from './components/SamplePickerModal';
import { SetupGuideModal } from './components/SetupGuideModal';
import { SimulatedDesk } from './components/SimulatedDesk';
import { processEdgeOutline } from './components/EdgeFilterProcessor';

export default function App() {
  // 1. Reference Image State
  const [currentImage, setCurrentImage] = useState<ReferenceImage>(SAMPLE_IMAGES[0]);
  const [edgeProcessedUrl, setEdgeProcessedUrl] = useState<string | null>(null);
  const [isProcessingFilter, setIsProcessingFilter] = useState(false);
  const [isReferenceHidden, setIsReferenceHidden] = useState(false);

  // Hidden file input for Photo Library / Files upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. Adjustments State
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    opacity: 0.55,
    brightness: 1.0,
    contrast: 1.1,
    invert: false,
    filterMode: 'normal',
    blendMode: 'normal',
  });

  // 3. Grid Configuration
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    type: 'thirds',
    denseDivisions: 6,
    color: 'cyan',
    opacity: 0.65,
    thickness: 1,
    showCoordinates: true,
    showCenterCross: false,
  });

  // 4. Lock & UI Visibility
  const [isLocked, setIsLocked] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSamplePickerOpen, setIsSamplePickerOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Container ref for gestures
  const gestureContainerRef = useRef<HTMLDivElement | null>(null);

  // 5. Gestures & Transformations
  const {
    transform,
    setTransform,
    resetTransform,
    zoomIn,
    zoomOut,
    setScaleDirect,
    rotate90,
    toggleFlipH,
    toggleFlipV,
  } = useGestureTransform({
    isLocked,
    containerRef: gestureContainerRef,
  });

  // 6. Camera Hook
  const {
    videoRef,
    isStreaming,
    facingMode,
    hasTorch,
    isTorchOn,
    isFrozen,
    frozenFrameUrl,
    error: cameraError,
    simulatedDesk,
    toggleFacingMode,
    toggleTorch,
    toggleFreeze,
    toggleSimulatedDesk,
    startCamera,
  } = useCamera();

  // Show quick notification toast
  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 2400);
  }, []);

  // Handle Edge Outline generation when toggled
  useEffect(() => {
    if (adjustments.filterMode === 'edge-outline') {
      setIsProcessingFilter(true);
      processEdgeOutline(currentImage.url)
        .then((outlineUrl) => {
          setEdgeProcessedUrl(outlineUrl);
        })
        .catch(() => {
          setEdgeProcessedUrl(null);
        })
        .finally(() => {
          setIsProcessingFilter(false);
        });
    } else {
      setEdgeProcessedUrl(null);
    }
  }, [adjustments.filterMode, currentImage.url]);

  // Handle file upload from user's device / photo library
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCurrentImage({
          id: `upload-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: result,
          source: 'upload',
        });
        resetTransform();
        showToast('Image loaded! Pinch & drag to align');
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so re-selecting same file fires change
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Toggle Lock
  const handleToggleLock = () => {
    setIsLocked((prev) => {
      const next = !prev;
      showToast(next ? 'Position Locked (Drawing Mode)' : 'Unlocked for Repositioning');
      return next;
    });
  };

  // Cycle through grid guides quickly
  const handleCycleGrid = () => {
    const sequence: GridConfig['type'][] = ['none', 'thirds', 'dense', 'diagonal'];
    const nextIdx = (sequence.indexOf(gridConfig.type) + 1) % sequence.length;
    const nextType = sequence[nextIdx];
    setGridConfig((prev) => ({ ...prev, type: nextType }));
    showToast(
      nextType === 'none'
        ? 'Grid Hidden'
        : nextType === 'thirds'
        ? 'Rule of Thirds Grid'
        : nextType === 'dense'
        ? 'Multi-Box Grid'
        : 'Diagonal Crosshairs',
    );
  };

  // Active image URL considering filters
  const displayedImageUrl =
    adjustments.filterMode === 'edge-outline' && edgeProcessedUrl
      ? edgeProcessedUrl
      : currentImage.url;

  return (
    <div
      className="relative w-full h-full h-[100dvh] w-[100vw] overflow-hidden bg-black text-slate-100 select-none touch-none"
      ref={gestureContainerRef}
    >
      {/* Hidden File Input for Native iOS Photo Library / Camera Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-hidden="true"
      />

      {/* =========================================================================
          LAYER 0: CAMERA STREAM OR SIMULATED PAPER DESK
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Real Live Camera Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isStreaming && !isFrozen && !simulatedDesk ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Frozen Frame Snapshot */}
        {isFrozen && frozenFrameUrl && (
          <img
            src={frozenFrameUrl}
            alt="Frozen camera frame"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Simulated Paper Desk Mode (when camera inactive, frozen without frame, or toggled) */}
        {(!isStreaming || simulatedDesk) && !frozenFrameUrl && (
          <div className="pointer-events-auto w-full h-full">
            <SimulatedDesk onRetryCamera={startCamera} cameraError={cameraError} />
          </div>
        )}
      </div>

      {/* =========================================================================
          LAYER 1: OVERLAID REFERENCE IMAGE WITH GESTURE TRANSFORMATIONS
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10 flex items-center justify-center">
        <div
          className="relative max-w-full max-h-full transition-transform ease-out duration-75 will-change-transform"
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale}) rotate(${transform.rotation}deg) scaleX(${transform.flipH ? -1 : 1}) scaleY(${transform.flipV ? -1 : 1})`,
            opacity: isReferenceHidden ? 0 : adjustments.opacity,
            mixBlendMode: adjustments.blendMode,
            filter: `brightness(${adjustments.brightness}) contrast(${adjustments.contrast}) ${
              adjustments.invert ? 'invert(1)' : ''
            } ${adjustments.filterMode === 'grayscale' ? 'grayscale(1)' : ''}`,
          }}
        >
          <img
            src={displayedImageUrl}
            alt={currentImage.name}
            referrerPolicy="no-referrer"
            className="max-w-[90vw] max-h-[85vh] object-contain pointer-events-none select-none drop-shadow-md"
            draggable={false}
          />
        </div>
      </div>

      {/* =========================================================================
          LAYER 2: PRECISION GRID & GUIDES
          ========================================================================= */}
      <GridOverlay config={gridConfig} />

      {/* =========================================================================
          LAYER 3: TOP BAR CONTRACT (Single line, 3 zones, uncluttered)
          ========================================================================= */}
      {!isDistractionFree && (
        <header className="absolute top-0 left-0 right-0 z-30 pt-safe px-3 sm:px-5 pb-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
          {/* Zone 1: Single text element wordmark */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setIsSetupGuideOpen(true)}
              className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>LucidTrace</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </button>
          </div>

          {/* Zone 2: Tracing Mode Status Text (Zero-pill metadata) */}
          <div className="pointer-events-auto hidden md:flex items-center gap-2 text-xs text-slate-300">
            <span>{isStreaming ? 'Live Desk Cam' : 'Paper Simulation'}</span>
            <span aria-hidden="true">·</span>
            <span>{isLocked ? 'Position Locked' : 'Gesture Ready'}</span>
            <span aria-hidden="true">·</span>
            <span>Scale {Math.round(transform.scale * 100)}%</span>
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={triggerUpload}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl shadow-md shadow-cyan-500/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Upload Reference Image</span>
              <span className="sm:hidden">Upload</span>
            </button>

            <button
              onClick={() => setIsSamplePickerOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-2.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium rounded-xl transition-colors whitespace-nowrap"
              title="Open starter line drawings"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sketches</span>
            </button>

            <button
              onClick={() => setIsDistractionFree(true)}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl transition-colors"
              title="Fullscreen / Hide UI"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>
      )}

      {/* Floating Restore Button when in Distraction-Free Mode */}
      {isDistractionFree && (
        <button
          onClick={() => setIsDistractionFree(false)}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-slate-900 transition-transform active:scale-95"
          title="Restore Controls"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      )}

      {/* Toast Notification Alert */}
      {notification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-200 text-xs font-medium backdrop-blur-md shadow-xl animate-fade-in pointer-events-none">
          {notification}
        </div>
      )}

      {/* =========================================================================
          LAYER 4: BOTTOM QUICK-ACCESS TOOLBAR (Ergonomic thumb zone)
          ========================================================================= */}
      {!isDistractionFree && (
        <QuickToolbar
          opacity={adjustments.opacity}
          onOpacityChange={(val) => setAdjustments((prev) => ({ ...prev, opacity: val }))}
          isLocked={isLocked}
          onToggleLock={handleToggleLock}
          isPanelOpen={isPanelOpen}
          onTogglePanel={() => setIsPanelOpen((prev) => !prev)}
          gridType={gridConfig.type}
          onCycleGrid={handleCycleGrid}
          isReferenceHidden={isReferenceHidden}
          onToggleReferenceHidden={() => setIsReferenceHidden((prev) => !prev)}
          isFrozen={isFrozen}
          onToggleFreeze={toggleFreeze}
          onResetTransform={resetTransform}
        />
      )}

      {/* =========================================================================
          LAYER 5: FLOATING DETAILED CONTROL PANEL (Collapsible with single tap)
          ========================================================================= */}
      <ControlPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        adjustments={adjustments}
        onUpdateAdjustments={(p) => setAdjustments((prev) => ({ ...prev, ...p }))}
        gridConfig={gridConfig}
        onUpdateGridConfig={(p) => setGridConfig((prev) => ({ ...prev, ...p }))}
        transform={transform}
        onUpdateTransform={(p) => setTransform((prev) => ({ ...prev, ...p }))}
        onResetTransform={resetTransform}
        isLocked={isLocked}
        onToggleLock={handleToggleLock}
        onTriggerUpload={triggerUpload}
        onOpenSamplePicker={() => setIsSamplePickerOpen(true)}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
        facingMode={facingMode}
        onToggleFacingMode={toggleFacingMode}
        hasTorch={hasTorch}
        isTorchOn={isTorchOn}
        onToggleTorch={toggleTorch}
        isFrozen={isFrozen}
        onToggleFreeze={toggleFreeze}
        simulatedDesk={simulatedDesk}
        onToggleSimulatedDesk={toggleSimulatedDesk}
        activeImageName={currentImage.name}
      />

      {/* Starter Sketches Modal */}
      <SamplePickerModal
        isOpen={isSamplePickerOpen}
        onClose={() => setIsSamplePickerOpen(false)}
        currentImageId={currentImage.id}
        onSelectSample={(sample) => {
          setCurrentImage(sample);
          resetTransform();
          showToast(`Loaded ${sample.name}`);
        }}
        onTriggerUpload={triggerUpload}
      />

      {/* How to Trace Optical Rig Setup Guide */}
      <SetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />
    </div>
  );
}
