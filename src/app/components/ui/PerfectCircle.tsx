import React, { useState, useRef, useEffect } from "react";

interface Coordinate {
  x: number;
  y: number;
}

export default function PerfectCircle() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingCoordinates, setDrawingCoordinates] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  const [error, setError] = useState<string>("");
  const [circleQuality, setCircleQuality] = useState<number>(100);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [pathCoordinates, setPathCoordinates] = useState<Coordinate[]>([]);

  const canvasSize = 800; // Adjust the canvas size as needed
  const dotRadius = 10; // Adjust the dot radius as needed
  const idealRadius = canvasSize / 2 - dotRadius; // Calculate the ideal radius based on canvas size and dot radius

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the center dot
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    // Draw the user's drawing path
    ctx.beginPath();
    pathCoordinates.forEach(({ x, y }) => {
      ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [pathCoordinates]);

  const handleMouseDown = () => {
    setIsDrawing(true);
    setPathCoordinates([]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setDrawingCoordinates({ x: offsetX, y: offsetY });

    if (isDrawing) {
      setPathCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        { x: offsetX, y: offsetY },
      ]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    const drawingRadius = Math.sqrt(
      (drawingCoordinates.x - canvasSize / 2) ** 2 +
        (drawingCoordinates.y - canvasSize / 2) ** 2
    );

    if (drawingRadius - 100 < dotRadius) {
      setError('Drawing too close to the dot!');
    } else {
      setError('');
    }

    const difference = Math.abs(idealRadius - drawingRadius);
    const qualityPercentage = Math.round(
      ((idealRadius - difference) / idealRadius) * 100
    );
    setCircleQuality(qualityPercentage);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh]">
      <canvas
        className="flex items-center justify-center border-2 rounded-sm border-slate-800 dark:border-slate-100 shadow-lg"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={canvasSize}
        height={canvasSize}
      />
      <div className="error-message">{error}</div>
      <div className="circle-quality">{circleQuality}%</div>
    </div>
  );
}
