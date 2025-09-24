"use client";

import { Button } from "@/components/ui/button";
import { EraserIcon } from "lucide-react";
import React from "react";
import SignaturePad from "signature_pad";

interface SignaturePropTypes {
  parentWidth: number;
  setTrimmedDataURL: (trimmedDataURL: string | undefined) => void;
  trimmedDataURL: string | undefined;
}

const SignaturePadComponent = ({
  parentWidth,
  setTrimmedDataURL,
  trimmedDataURL,
}: SignaturePropTypes) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = React.useRef<SignaturePad | null>(null);

  const height = React.useMemo(() => (parentWidth / 16) * 9, [parentWidth]);

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const pad = signaturePadRef.current;
    if (!canvas || !pad) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    // keep vector data to restore crisp strokes after resize
    const data = pad.toData();

    canvas.width = Math.floor(parentWidth * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);

    pad.clear();
    if (data.length) {
      pad.fromData(data);
    }
  }, [parentWidth, height]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgba(255,255,255,0)",
      penColor: "#111",
      minWidth: 2,
      maxWidth:2,
      throttle: 16, // ~1 frame
    });
    signaturePadRef.current = pad;

    const savePNG = () => {
      if (!pad.isEmpty()) {
        setTrimmedDataURL(pad.toDataURL("image/png"));
      }
    };

    // Prefer modern event API if present
    const anyPad = pad as unknown as {
      addEventListener?: (name: string, fn: () => void) => void;
      removeEventListener?: (name: string, fn: () => void) => void;
      onEnd?: () => void;
    };

    if (anyPad.addEventListener) {
      anyPad.addEventListener("endStroke", savePNG);
    } else if ("onEnd" in anyPad) {
      anyPad.onEnd = savePNG; // legacy fallback
    } else {
      // last resort fallback to pointerup on the canvas
      canvas.addEventListener("pointerup", savePNG, { passive: true });
    }

    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (anyPad.removeEventListener) {
        anyPad.removeEventListener("endStroke", savePNG);
      } else {
        // clear legacy handler if we set it
        if ("onEnd" in anyPad) anyPad.onEnd = undefined;
        canvas.removeEventListener("pointerup", savePNG);
      }
      pad.off();
      signaturePadRef.current = null;
    };
  }, [resizeCanvas, setTrimmedDataURL]);

  React.useEffect(() => {
    if (!trimmedDataURL || !signaturePadRef.current) return;
    try {
      // Use SignaturePad API to keep its internal state in sync
      signaturePadRef.current.fromDataURL(trimmedDataURL, {
        ratio: 1,
        width: parentWidth,
        height,
      });
    } catch {
      // ignore decode errors
    }
  }, [trimmedDataURL, parentWidth, height]);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setTrimmedDataURL(undefined);
  };

  const trimSignature = () => {
    const pad = signaturePadRef.current;
    if (!pad || pad.isEmpty()) return;
    setTrimmedDataURL(pad.toDataURL("image/png"));
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="z-20 right-0 m-1 absolute flex flex-row gap-2">
        <Button variant="ghost" size="icon" onClick={clearSignature} title="Clear">
          <EraserIcon />
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: parentWidth, height }}
        className="border border-input rounded-xl shadow-sm bg-white touch-none select-none"
        onClick={trimSignature}
      />
    </div>
  );
};

export default SignaturePadComponent;
