import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

interface Coordinate {
  x: number;
  y: number;
}

export default function PerfectCircle() {
  const theme = useSelector((state: any) => state.theme);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingCoordinates, setDrawingCoordinates] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  const [error, setError] = useState<string>("");
  const [circleQuality, setCircleQuality] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [pathCoordinates, setPathCoordinates] = useState<Coordinate[]>([]);
  const [timer, setTimer] = useState<number>(0);

  const dotRadius = 10; // Adjust the dot radius as needed
  const tolerance = 20; // Adjust the tolerance for determining closed curve
  const drawingTimeLimit = 5000; // 5 seconds

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate the canvas size based on the available space
    const canvasSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;

    // Update the canvas size
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the center dot
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = theme.value === "dark" ? "white" : "black";
    ctx.fill();

    // Calculate the gradient color based on the percentage
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, theme.value === "dark" ? "white" : "black");

    // Draw the user's drawing path
    ctx.beginPath();
    pathCoordinates.forEach(({ x, y }, index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Set the line color based on the percentage
    const lineColor = gradient;
    ctx.strokeStyle = lineColor;

    ctx.lineWidth = 4;
    ctx.stroke();

    // Check if the user has drawn something
    if (pathCoordinates.length === 0 && !isDrawing) {
      setError("Draw a circle!");
    }
  }, [drawingCoordinates, isDrawing, pathCoordinates, circleQuality, theme]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isDrawing) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 100);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isDrawing]);

  const handleMouseDown = () => {
    setIsDrawing(true);
    setPathCoordinates([]);
    setError("");
    setTimer(0);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setDrawingCoordinates({ x: offsetX, y: offsetY });

    if (isDrawing) {
      setPathCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        { x: offsetX, y: offsetY },
      ]);

      const drawingRadius = Math.sqrt(
        (offsetX - canvasRef.current!.width / 2) ** 2 +
          (offsetY - canvasRef.current!.height / 2) ** 2
      );
      const idealRadius = canvasRef.current!.width / 2 - dotRadius;
      const difference = Math.abs(idealRadius - drawingRadius);
      const accuracyPercentage = Math.round(
        ((idealRadius - difference) / idealRadius) * 1000
      ) / 10; // One decimal point
      setCircleQuality(accuracyPercentage);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    const drawingRadius = Math.sqrt(
      (drawingCoordinates.x - canvasRef.current!.width / 2) ** 2 +
        (drawingCoordinates.y - canvasRef.current!.height / 2) ** 2
    );

    const idealRadius = canvasRef.current!.width / 2 - dotRadius;
    if (drawingRadius - tolerance < dotRadius + 120) {
      setError("Drawing too close to the dot!");
      setCircleQuality(0);
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (timer > drawingTimeLimit) {
      setIsDrawing(false);
      setError("Drawing time exceeded!");
    }
  }, [timer]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div
        className="flex items-center justify-center border-2 rounded-sm border-slate-800 dark:border-slate-100 shadow-lg"
        style={{ position: "relative", width: "90vw", height: "90vw", maxWidth: "600px", maxHeight: "600px" }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <div
          className="error-message text-lg lg:text-3xl text-center text-emerald-400 dark:text-rose-200 mt-4 font-bold"
          style={{ position: "absolute", bottom: "-80px", left: "50%", transform: "translateX(-50%)" }}
        >
          {error ? <code>{error}</code> : <code>{circleQuality}%</code>}
        </div>
      </div>
    </div>
  );
}
