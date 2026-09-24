import React, { useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sliders,
  Grid as GridIcon,
  Move,
  Camera,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast as ContrastIcon,
  HelpCircle,
  Eye,
  Zap,
  Sparkles,
} from 'lucide-react';
import {
  GridConfig,
  GridType,
  GridColor,
  ImageAdjustments,
  ImageTransform,
  BlendMode,
} from '../types/tracer';

interface ControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adjustments: ImageAdjustments;
  onUpdateAdjustments: (partial: Partial<ImageAdjustments>) => void;
  gridConfig: GridConfig;
  onUpdateGridConfig: (partial: Partial<GridConfig>) => void;
  transform: ImageTransform;
  onUpdateTransform: (partial: Partial<ImageTransform>) => void;
  onResetTransform: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
  onTriggerUpload: () => void;
  onOpenSamplePicker: () => void;
  onOpenSetupGuide: () => void;
  // Camera props
  facingMode: 'environment' | 'user';
  onToggleFacingMode: () => void;
  hasTorch: boolean;
  isTorchOn: boolean;
  onToggleTorch: () => void;
  isFrozen: boolean;
  onToggleFreeze: () => void;
  simulatedDesk: boolean;
  onToggleSimulatedDesk: () => void;
  activeImageName: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isOpen,
  onClose,
  adjustments,
  onUpdateAdjustments,
  gridConfig,
  onUpdateGridConfig,
  transform,
  onUpdateTransform,
  onResetTransform,
  isLocked,
  onToggleLock,
  onTriggerUpload,
  onOpenSamplePicker,
  onOpenSetupGuide,
  facingMode,
  onToggleFacingMode,
  hasTorch,
  isTorchOn,
  onToggleTorch,
  isFrozen,
  onToggleFreeze,
  simulatedDesk,
  onToggleSimulatedDesk,
  activeImageName,
}) => {
  const [activeTab, setActiveTab] = React.useState<'adjust' | 'grid' | 'transform' | 'camera'>('adjust');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Click outside backdrop to collapse with single tap */}
      <div className="absolute inset-0" onClick={onClose} aria-label="Dismiss panel" />

      {/* Control Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col mb-16 sm:mb-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold text-white truncate">
              {activeImageName || 'Reference Controls'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSetupGuide}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="How to trace"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-4 gap-1 p-1 mt-3 bg-white/5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('adjust')}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'adjust'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Image</span>
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'grid'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GridIcon className="w-3.5 h-3.5" />
            <span>Grids</span>
          </button>
          <button
            onClick={() => setActiveTab('transform')}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'transform'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>Transform</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'camera'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 text-xs">
          {/* TAB 1: IMAGE & ADJUSTMENTS */}
          {activeTab === 'adjust' && (
            <div className="space-y-4">
              {/* Quick Image Upload & Sample Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onTriggerUpload}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-cyan-300 rounded-xl font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>
                <button
                  onClick={onOpenSamplePicker}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-xl font-medium transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Sample Sketches</span>
                </button>
              </div>

              {/* Opacity slider */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-medium flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Overlay Opacity
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    {Math.round(adjustments.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={adjustments.opacity}
                  onChange={(e) => onUpdateAdjustments({ opacity: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 h-2 bg-white/20 rounded-lg"
                />
                <p className="text-[10px] text-slate-400">
                  Slide down to see your real pencil strokes more clearly over the paper.
                </p>
              </div>

              {/* Brightness slider */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-medium flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Brightness
                  </span>
                  <span className="font-mono text-slate-300 font-semibold">
                    {Math.round(adjustments.brightness * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.0"
                  step="0.05"
                  value={adjustments.brightness}
                  onChange={(e) => onUpdateAdjustments({ brightness: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-2 bg-white/20 rounded-lg"
                />
              </div>

              {/* Contrast slider */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-medium flex items-center gap-1.5">
                    <ContrastIcon className="w-3.5 h-3.5 text-purple-400" />
                    Contrast
                  </span>
                  <span className="font-mono text-slate-300 font-semibold">
                    {Math.round(adjustments.contrast * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={adjustments.contrast}
                  onChange={(e) => onUpdateAdjustments({ contrast: parseFloat(e.target.value) })}
                  className="w-full accent-purple-400 h-2 bg-white/20 rounded-lg"
                />
              </div>

              {/* Filters & Blend Modes */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <span className="font-medium text-slate-300 block">Color & Blend Modes</span>

                {/* Invert & Edge detection toggles */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateAdjustments({ invert: !adjustments.invert })}
                    className={`py-2 px-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                      adjustments.invert
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    <span>Invert Colors</span>
                    <span className="text-[10px] uppercase font-mono">{adjustments.invert ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() =>
                      onUpdateAdjustments({
                        filterMode:
                          adjustments.filterMode === 'edge-outline' ? 'normal' : 'edge-outline',
                      })
                    }
                    className={`py-2 px-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                      adjustments.filterMode === 'edge-outline'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    <span>Line Art Outline</span>
                    <span className="text-[10px] uppercase font-mono">
                      {adjustments.filterMode === 'edge-outline' ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>

                {/* Blend mode segmented selector */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                    Layer Blending
                  </span>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded-xl">
                    {(['normal', 'multiply', 'screen', 'difference'] as BlendMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => onUpdateAdjustments({ blendMode: mode })}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-medium capitalize transition-colors ${
                          adjustments.blendMode === mode
                            ? 'bg-white text-slate-950 font-semibold shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRIDS & GUIDES */}
          {activeTab === 'grid' && (
            <div className="space-y-4">
              {/* Grid Type Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Grid Guide Type
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'none', label: 'No Grid' },
                    { id: 'thirds', label: 'Rule of Thirds' },
                    { id: 'dense', label: 'Multi-Box Grid' },
                    { id: 'diagonal', label: 'Diagonal Crosshairs' },
                    { id: 'golden', label: 'Golden Ratio' },
                  ].map((item) => {
                    const isSelected = gridConfig.type === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onUpdateGridConfig({ type: item.id as GridType })}
                        className={`py-2 px-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dense Grid Options */}
              {gridConfig.type === 'dense' && (
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Box Divisions</span>
                    <div className="flex gap-1.5">
                      {[4, 6, 8, 12].map((div) => (
                        <button
                          key={div}
                          onClick={() => onUpdateGridConfig({ denseDivisions: div })}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors ${
                            gridConfig.denseDivisions === div
                              ? 'bg-cyan-400 text-slate-950 font-bold'
                              : 'bg-white/10 text-slate-300 hover:bg-white/15'
                          }`}
                        >
                          {div}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Coordinate letters toggle */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-300">Show Coordinates (A-H, 1-8)</span>
                    <button
                      onClick={() =>
                        onUpdateGridConfig({ showCoordinates: !gridConfig.showCoordinates })
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium ${
                        gridConfig.showCoordinates
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {gridConfig.showCoordinates ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Colors */}
              {gridConfig.type !== 'none' && (
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2.5">
                  <span className="text-slate-300 font-medium block">High-Contrast Line Color</span>
                  <div className="flex items-center gap-2.5">
                    {[
                      { id: 'white', label: 'White', bg: 'bg-white' },
                      { id: 'black', label: 'Black', bg: 'bg-black border border-white/30' },
                      { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-400' },
                      { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-400' },
                      { id: 'red', label: 'Red', bg: 'bg-red-500' },
                    ].map((col) => (
                      <button
                        key={col.id}
                        onClick={() => onUpdateGridConfig({ color: col.id as GridColor })}
                        className={`flex-1 py-1.5 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                          gridConfig.color === col.id
                            ? 'border-cyan-400 bg-white/15 ring-2 ring-cyan-400/30'
                            : 'border-transparent bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${col.bg}`} />
                        <span className="text-[9px] text-slate-300">{col.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Grid Opacity & Thickness */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Line Opacity</span>
                      <span className="font-mono text-cyan-300">
                        {Math.round(gridConfig.opacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={gridConfig.opacity}
                      onChange={(e) => onUpdateGridConfig({ opacity: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-400 h-2 bg-white/20 rounded-lg"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-300">Line Thickness</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((th) => (
                          <button
                            key={th}
                            onClick={() => onUpdateGridConfig({ thickness: th })}
                            className={`w-7 h-7 rounded-lg text-xs font-mono font-medium ${
                              gridConfig.thickness === th
                                ? 'bg-cyan-400 text-slate-950 font-bold'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {th}px
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRANSFORM & ALIGNMENT */}
          {activeTab === 'transform' && (
            <div className="space-y-4">
              {/* Lock Switch */}
              <div
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isLocked
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div>
                  <span className="font-semibold block text-sm">
                    {isLocked ? 'Position Locked' : 'Unlocked (Gesture Active)'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isLocked
                      ? 'Gestures disabled. Ready to trace on paper!'
                      : 'Pinch and drag to reposition image.'}
                  </span>
                </div>
                <button
                  onClick={onToggleLock}
                  className={`py-1.5 px-3 rounded-xl font-semibold text-xs transition-colors ${
                    isLocked
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isLocked ? 'Unlock' : 'Lock Image'}
                </button>
              </div>

              {/* Direct Zoom Slider */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-medium">Scale / Zoom</span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    {Math.round(transform.scale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="5.0"
                  step="0.05"
                  value={transform.scale}
                  onChange={(e) => onUpdateTransform({ scale: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 h-2 bg-white/20 rounded-lg"
                />
              </div>

              {/* Rotation & Flip Controls */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdateTransform({ rotation: (transform.rotation + 90) % 360 })}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 transition-colors"
                >
                  <RotateCw className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-medium">Rotate 90°</span>
                </button>

                <button
                  onClick={() => onUpdateTransform({ flipH: !transform.flipH })}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl border transition-colors ${
                    transform.flipH
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Mirror (Flip H)</span>
                </button>

                <button
                  onClick={() => onUpdateTransform({ flipV: !transform.flipV })}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl border transition-colors ${
                    transform.flipV
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Flip V</span>
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={onResetTransform}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-center font-medium transition-colors"
              >
                Center & Reset Transformations
              </button>
            </div>
          )}

          {/* TAB 4: CAMERA & PAPER SETUP */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {/* Camera Facing mode & torch */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onToggleFacingMode}
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-medium transition-colors"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>
                    Camera: {facingMode === 'environment' ? 'Rear (Desk)' : 'Front (Selfie)'}
                  </span>
                </button>

                <button
                  onClick={onToggleTorch}
                  disabled={!hasTorch}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border transition-colors ${
                    isTorchOn
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-semibold'
                      : hasTorch
                      ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                      : 'bg-white/5 border-white/5 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Flashlight {isTorchOn ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Freeze frame */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-slate-200">Freeze Camera Frame</span>
                    <span className="text-[10px] text-slate-400">
                      Pauses live feed to inspect alignment or take a rest.
                    </span>
                  </div>
                  <button
                    onClick={onToggleFreeze}
                    className={`py-1.5 px-3 rounded-xl font-semibold text-xs transition-colors ${
                      isFrozen
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    {isFrozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                </div>
              </div>

              {/* Simulated Paper Desk Mode Toggle (great for desktop testing or paper preview) */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-slate-200">
                      Simulated Desk Paper
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Renders interactive paper & pencil guide behind image
                    </span>
                  </div>
                  <button
                    onClick={onToggleSimulatedDesk}
                    className={`py-1.5 px-3 rounded-xl font-semibold text-xs transition-colors ${
                      simulatedDesk
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {simulatedDesk ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              {/* Setup Guide CTA */}
              <button
                onClick={onOpenSetupGuide}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>View Phone & Paper Mounting Guide</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
