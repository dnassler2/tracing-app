import React from 'react';
import { X, Smartphone, Layers, Lock, Eye, Sparkles } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">How Optical Tracing Works</h3>
              <p className="text-xs text-slate-400">Master drawing with camera lucida projection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">1. Position Phone Above Paper</h4>
              <p className="leading-relaxed text-slate-300">
                Rest your phone camera pointing downward over your drawing paper. You can place it on a tall drinking glass, a stack of books, or a phone holder.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">2. Align & Scale Reference</h4>
              <p className="leading-relaxed text-slate-300">
                Pinch with two fingers to resize, or drag with one finger to center your reference image over the paper boundaries.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">3. Lock Position</h4>
              <p className="leading-relaxed text-slate-300">
                Tap the <strong className="text-amber-300">Lock</strong> button in the bottom toolbar. This ensures resting fingers or screen bumps won't displace your alignment!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">4. Adjust Opacity & Trace</h4>
              <p className="leading-relaxed text-slate-300">
                Slide the Opacity control to roughly 50%. Look through your screen to watch your real pencil trace the overlaid lines with 100% accurate proportions!
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
          >
            Got It, Let's Draw
          </button>
        </div>
      </div>
    </div>
  );
};
