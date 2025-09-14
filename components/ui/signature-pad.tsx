"use client";

import { Button } from "@/components/ui/button";
import { EraserIcon } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const signaturePad = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgba(255,255,255,0)", // transparent background
        penColor: "black",
      });

      signaturePadRef.current = signaturePad;

      // Add event listeners for mouseup and touchend
      const handleEnd = () => {
        if (!signaturePad.isEmpty()) {
          const dataUrl = signaturePad.toDataURL("image/png");
          setTrimmedDataURL(dataUrl);
        }
      };

      canvasRef.current.addEventListener("mouseup", handleEnd);
      canvasRef.current.addEventListener("touchend", handleEnd);
      canvasRef.current.addEventListener("pointerup", handleEnd);

      return () => {
        // Clean up event listeners
        canvasRef.current?.removeEventListener("mouseup", handleEnd);
        canvasRef.current?.removeEventListener("touchend", handleEnd);
        canvasRef.current?.removeEventListener("pointerup", handleEnd);
        signaturePad.off();
      };
    }
  }, [setTrimmedDataURL]);

  useEffect(() => {
    if (canvasRef.current) {
      const signaturePad = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgba(255,255,255,0)", // Transparent background
        penColor: "black", // Pen color
        throttle: 0,
        maxWidth: 2,
        minWidth: 2,
      });

      signaturePadRef.current = signaturePad;

      // Re-draw the saved signature when trimmedDataURL changes
      if (trimmedDataURL) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const image = new Image();
          image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw saved signature
          };
          image.src = trimmedDataURL;
        }
      }

      return () => {
        signaturePad.off(); // Clean up SignaturePad instance
      };
    }
  }, [trimmedDataURL]);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setTrimmedDataURL(undefined);
  };

  const trimSignature = () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) return;
    const dataUrl = signaturePadRef.current.toDataURL("image/png");
    setTrimmedDataURL(dataUrl);
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="z-20 right-0 m-1 absolute flex flex-row gap-2">
        <Button variant="ghost" size="icon" onClick={clearSignature}>
          <EraserIcon></EraserIcon>
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={parentWidth}
        height={350}
        className="border border-neutral-200 rounded-md shadow"
        onClick={trimSignature}
      ></canvas>
    </div>
  );
};

export default SignaturePadComponent;
