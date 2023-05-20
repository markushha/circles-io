import { useOnDraw } from '@/app/hooks/canvas.hook'

function Canvas() {
  const setCanvasRef = useOnDraw()

  return (
    <canvas
      className='w-full h-full border-2 rounded-sm border-slate-800 dark:border-slate-100 shadow-lg'
      ref={setCanvasRef}
    />
  )
}

export default Canvas
