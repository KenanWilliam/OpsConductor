"use client"

/**
 * Background Layers — The Awwwards Treatment
 * Three layers, each has a job:
 * 1. Dot matrix — structure
 * 2. Cyan aurora — alive
 * 3. Grain texture — premium
 */
export function BackgroundLayers() {
  return (
    <>
      {/* LAYER 1: Dot matrix */}
      <div className="bg-dots" aria-hidden="true" />
      {/* LAYER 2: Cyan aurora */}
      <div className="bg-aurora" aria-hidden="true" />
      {/* LAYER 3: Grain texture */}
      <div className="bg-grain" aria-hidden="true" />
    </>
  )
}
