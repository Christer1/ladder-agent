// Screen 5 "/liveness": oval frame, live camera, "Verify Face" CTA. Copied from ladder-web and adapted.
//
// Flow: Verify Face → camera permission → live preview → 3-second "hold still" countdown →
// capture one frame → upload → /verifying. A liveness provider SDK will replace the
// single-frame capture; the screen states stay the same.
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/layout/BackButton';
import { Button, Spinner } from '@/components/ui';
import { ROUTES } from '@/config/routes';
import { getMethodRoute, useAssistanceStatus } from '@/features/session';
import { cn } from '@/lib/utils/cn';
import { useCamera } from '../hooks/useCamera';
import { useSubmitLiveness } from '../hooks/useSubmitLiveness';

const COUNTDOWN_SECONDS = 3;

type Phase = 'idle' | 'positioning' | 'countdown' | 'submitting' | 'failed';

function FacePlaceholderIcon() {
  return (
    <svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true">
      <circle cx="43" cy="19" r="19" className="fill-black" />
      <rect x="0" y="48" width="86" height="38" rx="19" className="fill-black" />
    </svg>
  );
}

export function LivenessCamera() {
  const router = useRouter();
  const { data: status } = useAssistanceStatus();
  // Destructured so the React Compiler sees videoRef as the only ref.
  const {
    videoRef,
    status: cameraStatus,
    error: cameraErrorText,
    start: startCamera,
    stop: stopCamera,
    captureFrame,
  } = useCamera();
  const submitLiveness = useSubmitLiveness();
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [failure, setFailure] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => clearTimer, []);

  const fail = (message: string) => {
    clearTimer();
    stopCamera();
    setFailure(message);
    setPhase('failed');
  };

  const captureAndSubmit = async () => {
    setPhase('submitting');
    let selfie: Blob;
    try {
      selfie = await captureFrame();
    } catch {
      fail('We couldn’t take a photo. Please try again.');
      return;
    }
    stopCamera();

    submitLiveness.mutate(
      { selfie },
      {
        onSuccess: () => router.push(ROUTES.VERIFYING),
        onError: (error) => fail(error.message),
      },
    );
  };

  // Starts once the video is actually showing frames (an event, not an effect).
  const startCountdown = () => {
    if (phase !== 'positioning') return;
    setPhase('countdown');
    setSecondsLeft(COUNTDOWN_SECONDS);
    let remaining = COUNTDOWN_SECONDS;
    timerRef.current = window.setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearTimer();
        void captureAndSubmit();
      }
    }, 1000);
  };

  const handleStart = async () => {
    setFailure(null);
    setPhase('positioning');
    await startCamera();
  };

  const isCameraVisible =
    cameraStatus === 'active' && (phase === 'positioning' || phase === 'countdown');
  const cameraError = cameraStatus === 'error' ? cameraErrorText : null;
  const errorMessage = cameraError ?? (phase === 'failed' ? failure : null);
  const showStartButton = phase === 'idle' || Boolean(errorMessage);

  const instruction = errorMessage
    ? null
    : phase === 'positioning'
      ? cameraStatus === 'requesting'
        ? 'Waiting for camera permission…'
        : 'Centre your face in the frame'
      : phase === 'countdown'
        ? `Hold still… ${secondsLeft}`
        : phase === 'submitting'
          ? 'Verifying your face…'
          : null;

  return (
    <div className="flex flex-1 flex-col px-6 pt-5 pb-8 lg:justify-center lg:py-16">
      <BackButton href={getMethodRoute(status?.method ?? null)} />

      <div className="mt-6 text-center lg:mt-4">
        <h1 className="text-[22px] leading-8 font-semibold text-text-heading">Liveness Check</h1>
        <p className="mx-auto mt-1 max-w-[240px] text-[15px] leading-5 text-text-muted">
          Position yourself within the frame and follow the instructions
        </p>
      </div>

      <div
        className={cn(
          'relative mx-auto mt-9 aspect-[250/346] w-full max-w-[250px] overflow-hidden rounded-full',
          isCameraVisible || phase === 'submitting'
            ? 'border-2 border-primary-600 bg-surface'
            : 'bg-face-placeholder',
        )}
      >
        {/* Mounted only while the camera is in use; mirrored so it feels like a mirror. */}
        {cameraStatus === 'active' && (
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            onPlaying={startCountdown}
            aria-label="Your camera preview"
            className="absolute inset-0 size-full -scale-x-100 object-cover"
          />
        )}
        {!isCameraVisible && phase !== 'submitting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FacePlaceholderIcon />
          </div>
        )}
        {phase === 'submitting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80 text-primary-600">
            <Spinner className="[&_svg]:size-10" />
          </div>
        )}
      </div>

      <div aria-live="polite" className="mt-5 min-h-6 text-center">
        {instruction && (
          <p className="text-[15px] leading-6 font-medium text-text-heading">{instruction}</p>
        )}
        {errorMessage && (
          <p role="alert" className="text-sm text-danger">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Pinned to the bottom on mobile (rules.md §5); Cancel replaces it while the camera runs. */}
      <div className="mt-auto pt-6 md:mt-8">
        {showStartButton && (
          <Button onClick={() => void handleStart()}>
            {errorMessage ? 'Try again' : 'Verify Face'}
          </Button>
        )}
        {(phase === 'positioning' || phase === 'countdown') && !errorMessage && (
          <Button
            variant="secondary"
            onClick={() => {
              clearTimer();
              stopCamera();
              setPhase('idle');
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
