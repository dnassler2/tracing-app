import React, { useState } from 'react';
import { Pencil, Camera, RefreshCw } from 'lucide-react';

interface SimulatedDeskProps {
  onRetryCamera: () => void;
  cameraError: string | null;
}

export const SimulatedDesk: React.FC<SimulatedDeskProps> = ({ onRetryCamera, cameraError }) => {
  const [sketchStrokes, setSketchStrokes] = useState<Array<{ x: number; y: number }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#1e1c18] overflow-hidden flex items-center justify-center select-none"
      onPointerDown={(e) => {
        setIsDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setSketchStrokes((prev) => [
          ...prev,
          { x: e.clientX - rect.left, y: e.clientY - rect.top },
        ]);
      }}
      onPointerMove={(e) => {
        if (!isDrawing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setSketchStrokes((prev) => [
          ...prev,
          { x: e.clientX - rect.left, y: e.clientY - rect.top },
        ]);
      }}
      onPointerUp={() => setIsDrawing(false)}
      onPointerLeave={() => setIsDrawing(false)}
    >
      {/* Wood Desk Grain Texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50px)`,
        }}
      />

      {/* Physical Sketchbook / Drawing Paper Sheet */}
      <div className="relative w-[88vw] h-[82vh] max-w-2xl bg-[#faf6ee] rounded-sm shadow-2xl p-6 sm:p-10 border border-[#e2dacf] flex flex-col justify-between overflow-hidden">
        {/* Paper texture noise & dot grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#5a5347 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Paper Header / Watermark */}
        <div className="relative z-10 flex items-center justify-between text-[#8b8273] text-[11px] font-mono select-none">
          <span>PHYSICAL PAPER SIMULATION (DESK CAM)</span>
          <span>90lb ARCHIVAL VELLUM</span>
        </div>

        {/* Canvas for freehand pencil strokes test on paper */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {sketchStrokes.length > 1 && (
            <polyline
              fill="none"
              stroke="#2c2825"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
              points={sketchStrokes.map((p) => `${p.x},${p.y}`).join(' ')}
            />
          )}
        </svg>

        {/* Center Guide / Paper Tracing Instruction */}
        <div className="relative z-10 my-auto text-center pointer-events-none select-none px-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#eee7d8] border border-[#d6ccb8] text-[#554e42] flex items-center justify-center mb-3 shadow-inner">
            <Pencil className="w-6 h-6 -rotate-45" />
          </div>
          <h3 className="text-sm font-semibold text-[#3b3429] mb-1">
            Physical Drawing Paper Active
          </h3>
          <p className="text-xs text-[#736a59] max-w-sm mx-auto leading-relaxed">
            Drag or sketch with your mouse or stylus here to test drawing under your overlaid reference.
          </p>
        </div>

        {/* Bottom Banner with Camera Status & Retry button */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#e5dcce] text-[11px] text-[#736a59]">
          <span className="truncate max-w-[200px]">
            {cameraError ? 'Camera offline / testing mode' : 'Desk camera mode ready'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetryCamera();
            }}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#e7ded0] hover:bg-[#dcd1c0] text-[#332e26] font-medium transition-colors pointer-events-auto"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Connect Camera</span>
          </button>
        </div>
      </div>
    </div>
  );
};
