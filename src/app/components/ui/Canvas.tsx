import { useOnDraw } from '@/app/hooks/canvas.hook'

function Canvas() {
  function onDraw (ctx: any, point: {x: number, y: number}) {
    ctx.beginPath()
    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
    ctx.fillStyle = 'red'
    ctx.fill()
  }

  const setCanvasRef = useOnDraw(onDraw)

  return (
    <canvas
      className='w-[600px] h-[600px] border-2 rounded-sm border-slate-800 dark:border-slate-100 shadow-lg'
      ref={setCanvasRef}
      width={600}
      height={600}
    />
  )
}

export default Canvas
