import React from 'react';
import { X, Upload, Check } from 'lucide-react';
import { ReferenceImage } from '../types/tracer';
import { SAMPLE_IMAGES } from '../data/sampleImages';

interface SamplePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageId: string;
  onSelectSample: (sample: ReferenceImage) => void;
  onTriggerUpload: () => void;
}

export const SamplePickerModal: React.FC<SamplePickerModalProps> = ({
  isOpen,
  onClose,
  currentImageId,
  onSelectSample,
  onTriggerUpload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">Reference Sketches</h3>
            <p className="text-xs text-slate-400">Choose a starter drawing or upload your own</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Custom CTA */}
        <div className="pt-4 pb-2">
          <button
            onClick={() => {
              onClose();
              onTriggerUpload();
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold text-sm rounded-2xl transition-transform active:scale-[0.98] shadow-lg shadow-cyan-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload From Photo Library / Files</span>
          </button>
        </div>

        {/* Sample Templates Grid */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Starter Line Art Templates
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {SAMPLE_IMAGES.map((sample) => {
              const isSelected = sample.id === currentImageId;
              return (
                <button
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    onClose();
                  }}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-800 shadow-md ring-2 ring-cyan-400/40'
                      : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-[3/4] bg-white p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={sample.url}
                      alt={sample.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200 truncate">{sample.name}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
