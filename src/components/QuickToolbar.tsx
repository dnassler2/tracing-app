import React from 'react';
import {
  Lock,
  Unlock,
  Sliders,
  Grid,
  Eye,
  EyeOff,
  Camera,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { GridType } from '../types/tracer';

interface QuickToolbarProps {
  opacity: number;
  onOpacityChange: (value: number) => void;
  isLocked: boolean;
  onToggleLock: () => void;
  isPanelOpen: boolean;
  onTogglePanel: () => void;
  gridType: GridType;
  onCycleGrid: () => void;
  isReferenceHidden: boolean;
  onToggleReferenceHidden: () => void;
  isFrozen: boolean;
  onToggleFreeze: () => void;
  onResetTransform: () => void;
}

export const QuickToolbar: React.FC<QuickToolbarProps> = ({
  opacity,
  onOpacityChange,
  isLocked,
  onToggleLock,
  isPanelOpen,
  onTogglePanel,
  gridType,
  onCycleGrid,
  isReferenceHidden,
  onToggleReferenceHidden,
  isFrozen,
  onToggleFreeze,
  onResetTransform,
}) => {
  return (
    <div className="fixed bottom-3 left-3 right-3 z-30 flex flex-col items-center gap-2 pointer-events-none pb-safe">
      {/* Position Locked Alert Toast */}
      {isLocked && (
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-medium shadow-lg animate-fade-in">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Position Locked (Drawing Mode)</span>
          <button
            onClick={onToggleLock}
            className="ml-1 underline font-semibold text-amber-200 hover:text-white"
          >
            Unlock
          </button>
        </div>
      )}

      {/* Main floating bar */}
      <div className="pointer-events-auto w-full max-w-lg bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2.5">
        {/* Top row: Opacity Slider */}
        <div className="flex items-center gap-3 px-1">
          <button
            onClick={onToggleReferenceHidden}
            title={isReferenceHidden ? 'Show reference image' : 'Hide reference image'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isReferenceHidden
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/15'
            }`}
          >
            {isReferenceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isReferenceHidden ? 0 : opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-white/20 rounded-lg cursor-pointer"
              aria-label="Adjust reference opacity"
            />
            <span className="text-[11px] font-mono tabular-nums text-cyan-300 w-8 text-right font-medium">
              {Math.round((isReferenceHidden ? 0 : opacity) * 100)}%
            </span>
          </div>
        </div>

        {/* Bottom row: Quick action buttons */}
        <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-white/10">
          {/* 1. Lock/Unlock Button */}
          <button
            onClick={onToggleLock}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              isLocked
                ? 'bg-amber-500/25 border border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-white/5 border border-transparent text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span className="text-[10px] font-medium mt-1 tracking-tight">
              {isLocked ? 'Locked' : 'Lock'}
            </span>
          </button>

          {/* 2. Grid Toggle / Cycle */}
          <button
            onClick={onCycleGrid}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              gridType !== 'none'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                : 'bg-white/5 border border-transparent text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1 tracking-tight truncate max-w-full">
              {gridType === 'none'
                ? 'Grid Off'
                : gridType === 'thirds'
                ? 'Thirds'
                : gridType === 'dense'
                ? 'Dense'
                : 'Diag'}
            </span>
          </button>

          {/* 3. Freeze Camera Frame */}
          <button
            onClick={onToggleFreeze}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              isFrozen
                ? 'bg-purple-500/25 border border-purple-500/50 text-purple-300'
                : 'bg-white/5 border border-transparent text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            title={isFrozen ? 'Resume live camera' : 'Freeze camera feed'}
          >
            {isFrozen ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-[10px] font-medium mt-1 tracking-tight">
              {isFrozen ? 'Resume' : 'Freeze'}
            </span>
          </button>

          {/* 4. Reset Transform */}
          <button
            onClick={onResetTransform}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 border border-transparent text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            title="Reset position and zoom"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1 tracking-tight">Center</span>
          </button>

          {/* 5. More Settings / Full Panel Toggle */}
          <button
            onClick={onTogglePanel}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              isPanelOpen
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1 tracking-tight">
              {isPanelOpen ? 'Close' : 'Adjust'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
