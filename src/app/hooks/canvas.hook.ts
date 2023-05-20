import { useRef } from "react";

export const useOnDraw = () => {
  const canvasRef = useRef(null as any);

  const setCanvasRef = (ref: HTMLCanvasElement) => {
    if (ref) {
      canvasRef.current = ref;
      initMouseMoveListener();
    }
  };

  function initMouseMoveListener() {
    const mouseMoveListener = (e: MouseEvent) => {
      const point = computePointInCanvas(e.clientX, e.clientY);
      console.log(point);
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

  return setCanvasRef;
};
