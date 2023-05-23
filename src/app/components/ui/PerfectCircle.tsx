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

  const canvasSize = 600;
  const dotRadius = 10;
  const idealRadius = canvasSize / 2 - dotRadius;
  const tolerance = 20;
  const drawingTimeLimit = 5000;

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
    ctx.fillStyle = theme.value === "dark" ? "white" : "black";
    ctx.fill();

    // Draw the accuracy text
    // ctx.fillStyle = theme.value === "dark" ? "white" : "black";
    // ctx.font = "bold 34px";
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";
    // const accuracyText = circleQuality % 1 === 0 ? `${circleQuality.toFixed(1)}%` : `${circleQuality}%`;

    // Calculate the gradient color based on the percentage
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, theme.value === "dark" ? "white" : "black");
    ctx.fillStyle = gradient;

    // ctx.fillText( centerX, centerY + 40);

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
      setError("Draw something!");
    }
  }, [drawingCoordinates, isDrawing, pathCoordinates, circleQuality, theme]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isDrawing) {
      setTimer(0);

      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 100);
      }, 100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isDrawing]);

  useEffect(() => {
    if (timer >= drawingTimeLimit) {
      setIsDrawing(false);
      setError("Too slow!");
    }
  }, [timer]);

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

      const drawingRadius = Math.sqrt(
        (offsetX - canvasSize / 2) ** 2 + (offsetY - canvasSize / 2) ** 2
      );
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
      (drawingCoordinates.x - canvasSize / 2) ** 2 +
        (drawingCoordinates.y - canvasSize / 2) ** 2
    );

    console.log(drawingRadius, dotRadius ** 2)

    if (drawingRadius - tolerance < dotRadius + 120) {
      setError("Drawing too close to the dot!");
      setCircleQuality(0);
    } else {
      setError("");
    }
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
      <div className="error-message text-2xl lg:text-3xl text-emerald-400 dark:text-rose-200 mt-4 font-bold">
        {error ? <code>{error}</code> : <code>{circleQuality}%</code>}
      </div>
    </div>
  );
}