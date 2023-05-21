import { useRef } from "react";

export const useOnDraw = (onDraw: any) => {
  const canvasRef = useRef(null as any);

  const isDrawingRef = useRef(false);

  const setCanvasRef = (ref: HTMLCanvasElement) => {
    if (ref) {
      canvasRef.current = ref;
      initMouseMoveListener();
      initMouseDownListener();
      initMouseUpListener();
    }
  };

  function initMouseMoveListener() {
    const mouseMoveListener = (e: MouseEvent) => {
      if (isDrawingRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        const ctx = canvasRef.current.getContext("2d");
        if (onDraw) onDraw(ctx, point);
        console.log(point);
      }
    };
    window.addEventListener("mousemove", mouseMoveListener);
  }

  function computePointInCanvas(clientX: number, clientY: number) {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      return { x, y };
    }
  }

  function initMouseUpListener() {
    const mouseUpListener = () => {
      isDrawingRef.current = false;
    };
    window.addEventListener("mouseup", mouseUpListener);
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;
    const mouseDownListener = () => {
      isDrawingRef.current = true;
    };
    canvasRef.current.addEventListener("mousedown", mouseDownListener);
  }

  return setCanvasRef;
};
