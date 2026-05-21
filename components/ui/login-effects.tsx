'use client'

import { useState } from 'react'

interface Props {
  children: React.ReactNode
}

export default function LoginEffects({ children }: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`absolute pointer-events-none w-[500px] h-[500px]
        bg-gradient-to-r from-orange-400/20 via-amber-300/20 to-orange-600/20
        rounded-full blur-3xl transition-opacity duration-300
        ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
          transition: 'transform 0.08s ease-out',
        }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}