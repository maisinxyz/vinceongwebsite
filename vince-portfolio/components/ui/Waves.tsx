'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
    x: number
    y: number
    wave: { x: number; y: number }
    cursor: {
        x: number
        y: number
        vx: number
        vy: number
    }
}

interface WavesProps {
    className?: string
    strokeColor?: string
    backgroundColor?: string
    pointerSize?: number
}

export function Waves({
    className = "",
    strokeColor = "#ffffff",
    backgroundColor = "#000000",
    pointerSize = 0.5
}: WavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const mouseRef = useRef({
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false,
    })
    const linesRef = useRef<Point[][]>([])
    const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
    const rafRef = useRef<number | null>(null)
    const boundingRef = useRef<DOMRect | null>(null)
    const isVisibleRef = useRef(true)
    const lastTickRef = useRef(0)

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return

        ctxRef.current = canvasRef.current.getContext('2d')
        noiseRef.current = createNoise2D()

        setSize()
        setLines()

        window.addEventListener('resize', onResize)
        window.addEventListener('mousemove', onMouseMove)

        const container = containerRef.current
        container.addEventListener('touchmove', onTouchMove, { passive: false })
        
        const observer = new IntersectionObserver(([entry]) => {
            isVisibleRef.current = entry.isIntersecting
        })
        observer.observe(container)

        rafRef.current = requestAnimationFrame(tick)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('mousemove', onMouseMove)
            container?.removeEventListener('touchmove', onTouchMove)
            observer.disconnect()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function setSize() {
        if (!containerRef.current || !canvasRef.current) return

        boundingRef.current = containerRef.current.getBoundingClientRect()
        const { width, height } = boundingRef.current

        canvasRef.current.width = width
        canvasRef.current.height = height
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`
    }

    function setLines() {
        if (!boundingRef.current) return

        const { width, height } = boundingRef.current
        linesRef.current = []

        const xGap = 9.5
        const yGap = 9.5

        const oWidth = width + 200
        const oHeight = height + 30

        const totalLines = Math.ceil(oWidth / xGap)
        const totalPoints = Math.ceil(oHeight / yGap)

        const xStart = (width - xGap * totalLines) / 2
        const yStart = (height - yGap * totalPoints) / 2

        for (let i = 0; i < totalLines; i++) {
            const points: Point[] = []

            for (let j = 0; j < totalPoints; j++) {
                const point: Point = {
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                }

                points.push(point)
            }

            linesRef.current.push(points)
        }
    }

    function onResize() {
        setSize()
        setLines()
    }

    function onMouseMove(e: MouseEvent) {
        updateMousePosition(e.pageX, e.pageY)
    }

    function onTouchMove(e: TouchEvent) {
        e.preventDefault()
        const touch = e.touches[0]
        updateMousePosition(touch.clientX, touch.clientY)
    }

    function updateMousePosition(x: number, y: number) {
        if (!boundingRef.current) return

        const mouse = mouseRef.current
        mouse.x = x - boundingRef.current.left
        mouse.y = y - boundingRef.current.top + window.scrollY

        if (!mouse.set) {
            mouse.sx = mouse.x
            mouse.sy = mouse.y
            mouse.lx = mouse.x
            mouse.ly = mouse.y

            mouse.set = true
        }

        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }
    }

    function movePoints(time: number) {
        const { current: lines } = linesRef
        const { current: mouse } = mouseRef
        const { current: noise } = noiseRef

        if (!noise) return

        const l = Math.max(175, mouse.vs)
        const cosA = Math.cos(mouse.a)
        const sinA = Math.sin(mouse.a)
        const mouseForce = l * mouse.vs * 0.00035
        const vxForce = cosA * mouseForce
        const vyForce = sinA * mouseForce

        lines.forEach((points) => {
            points.forEach((p: Point) => {
                const move = noise(
                    (p.x + time * 0.008) * 0.003,
                    (p.y + time * 0.003) * 0.002
                ) * 8

                p.wave.x = Math.cos(move) * 12
                p.wave.y = Math.sin(move) * 6

                const dx = p.x - mouse.sx
                const dy = p.y - mouse.sy

                // Fast bounding box check
                if (Math.abs(dx) < l && Math.abs(dy) < l) {
                    const d = Math.hypot(dx, dy)
                    if (d < l) {
                        const s = 1 - d / l
                        const f = Math.cos(d * 0.001) * s

                        p.cursor.vx += vxForce * f
                        p.cursor.vy += vyForce * f
                    }
                }

                p.cursor.vx += (0 - p.cursor.x) * 0.01
                p.cursor.vy += (0 - p.cursor.y) * 0.01

                p.cursor.vx *= 0.95
                p.cursor.vy *= 0.95

                p.cursor.x += p.cursor.vx
                p.cursor.y += p.cursor.vy

                p.cursor.x = p.cursor.x > 50 ? 50 : p.cursor.x < -50 ? -50 : p.cursor.x
                p.cursor.y = p.cursor.y > 50 ? 50 : p.cursor.y < -50 ? -50 : p.cursor.y
            })
        })
    }

    function moved(point: Point, withCursorForce = true) {
        const coords = {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        }

        return coords
    }

    function drawLines() {
        const ctx = ctxRef.current
        const { current: lines } = linesRef
        if (!ctx || !canvasRef.current) return

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = 1
        ctx.beginPath()

        lines.forEach((points) => {
            if (points.length < 2) return

            const firstPoint = moved(points[0], false)
            ctx.moveTo(firstPoint.x, firstPoint.y)

            for (let i = 1; i < points.length; i++) {
                const current = moved(points[i])
                ctx.lineTo(current.x, current.y)
            }
        })
        ctx.stroke()
    }

    function tick(time: number) {
        if (!isVisibleRef.current) {
            rafRef.current = requestAnimationFrame(tick)
            return
        }

        // Throttle to roughly 60fps to prevent high refresh rate monitors from dying
        if (time - lastTickRef.current < 16) {
            rafRef.current = requestAnimationFrame(tick)
            return
        }
        lastTickRef.current = time

        const { current: mouse } = mouseRef

        mouse.sx += (mouse.x - mouse.sx) * 0.1
        mouse.sy += (mouse.y - mouse.sy) * 0.1

        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        const d = Math.hypot(dx, dy)

        mouse.v = d
        mouse.vs += (d - mouse.vs) * 0.1
        mouse.vs = Math.min(100, mouse.vs)

        mouse.lx = mouse.x
        mouse.ly = mouse.y

        mouse.a = Math.atan2(dy, dx)

        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }

        movePoints(time)
        drawLines()

        rafRef.current = requestAnimationFrame(tick)
    }

    return (
        <div
            ref={containerRef}
            className={`waves-component relative overflow-hidden ${className}`}
            style={{
                backgroundColor,
                position: 'absolute',
                top: 0,
                left: 0,
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                '--x': '-0.5rem',
                '--y': '50%',
            } as React.CSSProperties}
        >
            <canvas
                ref={canvasRef}
                className="block w-full h-full js-canvas"
            />
            <div
                className="pointer-dot"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${pointerSize}rem`,
                    height: `${pointerSize}rem`,
                    background: strokeColor,
                    borderRadius: '50%',
                    transform: 'translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)',
                    willChange: 'transform',
                }}
            />
        </div>
    )
}
