import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isStreaming: boolean;
  facingMode: 'environment' | 'user';
  hasTorch: boolean;
  isTorchOn: boolean;
  isFrozen: boolean;
  frozenFrameUrl: string | null;
  error: string | null;
  permissionGranted: boolean | null;
  simulatedDesk: boolean;
  toggleFacingMode: () => void;
  toggleTorch: () => Promise<void>;
  toggleFreeze: () => void;
  toggleSimulatedDesk: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [frozenFrameUrl, setFrozenFrameUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [simulatedDesk, setSimulatedDesk] = useState(false);

  // Check torch capability
  const checkTorchCapability = useCallback((mediaStream: MediaStream) => {
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      const capabilities = (videoTrack.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean }) || {};
      setHasTorch(Boolean(capabilities.torch));
    } else {
      setHasTorch(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsTorchOn(false);
  }, [stream]);

  const startCamera = useCallback(async () => {
    // If running in browser without getUserMedia or if already streaming
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API is not supported on this browser or platform.');
      setSimulatedDesk(true);
      return;
    }

    try {
      setError(null);
      // Stop any existing tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setPermissionGranted(true);
      checkTorchCapability(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        // iOS Safari requires playsInline and user interaction/play call
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
        } catch {
          // Play was interrupted or waiting for user interaction
        }
      }
      setIsStreaming(true);
      setSimulatedDesk(false);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      console.warn('Camera access could not be established:', errMessage);
      setError('Camera permission needed to show physical paper. Running in desk preview mode.');
      setPermissionGranted(false);
      setSimulatedDesk(true);
      setIsStreaming(false);
    }
  }, [facingMode, stream, checkTorchCapability]);

  // Initial startup
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  // Toggle between Rear and Front camera
  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, []);

  // Toggle hardware flashlight if supported
  const toggleTorch = useCallback(async () => {
    if (!stream || !hasTorch) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !isTorchOn;
        await (track as MediaStreamTrack & {
          applyConstraints: (c: { advanced: Array<{ torch?: boolean }> }) => Promise<void>;
        }).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      } catch (err) {
        console.error('Failed to toggle torch:', err);
      }
    }
  }, [stream, hasTorch, isTorchOn]);

  // Toggle freeze frame
  const toggleFreeze = useCallback(() => {
    if (isFrozen) {
      // Unfreeze
      setIsFrozen(false);
      setFrozenFrameUrl(null);
    } else {
      // Capture current frame to snapshot
      if (videoRef.current && isStreaming) {
        try {
          const video = videoRef.current;
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            setFrozenFrameUrl(dataUrl);
            setIsFrozen(true);
          }
        } catch (err) {
          console.error('Failed to capture freeze frame:', err);
        }
      } else {
        // If simulated desk mode, freeze toggle
        setIsFrozen((prev) => !prev);
      }
    }
  }, [isFrozen, isStreaming]);

  const toggleSimulatedDesk = useCallback(() => {
    setSimulatedDesk((prev) => !prev);
  }, []);

  return {
    videoRef,
    stream,
    isStreaming,
    facingMode,
    hasTorch,
    isTorchOn,
    isFrozen,
    frozenFrameUrl,
    error,
    permissionGranted,
    simulatedDesk,
    toggleFacingMode,
    toggleTorch,
    toggleFreeze,
    toggleSimulatedDesk,
    startCamera,
    stopCamera,
  };
}
