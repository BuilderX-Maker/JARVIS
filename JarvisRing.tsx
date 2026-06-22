"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import type { RingState } from "@/types"

interface JarvisRingProps {
  state: RingState
}

const SIZE = 240
const CENTER = SIZE / 2

/**
 * The animated JARVIS core ring. Purely visual — driven by `state`.
 * Four states: idle, listening, thinking, speaking.
 */
export function JarvisRing({ state }: JarvisRingProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
      aria-hidden="true"
    >
      {/* Ambient glow that intensifies with activity */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        animate={{
          opacity:
            state === "idle"
              ? [0.25, 0.4, 0.25]
              : state === "listening"
                ? [0.5, 0.8, 0.5]
                : state === "thinking"
                  ? [0.45, 0.65, 0.45]
                  : [0.6, 0.9, 0.6],
          backgroundColor:
            state === "thinking"
              ? ["#2b8cff", "#00f0ff", "#2b8cff"]
              : ["#00f0ff", "#00f0ff", "#00f0ff"],
        }}
        transition={{
          duration: state === "listening" ? 1.4 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ backgroundColor: "#00f0ff" }}
      />

      {/* Pulsing wrapper for IDLE breathing scale */}
      <motion.div
        className="relative"
        style={{ width: SIZE, height: SIZE }}
        animate={
          state === "idle"
            ? { scale: [1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Static structural rings */}
        <BaseRings />

        {/* Continuous outer rotation for LISTENING */}
        {state === "listening" && <ListeningLayer />}

        {/* Orbiting data-stream arcs for THINKING */}
        {state === "thinking" && <ThinkingLayer />}

        {/* Ripples + waveform for SPEAKING */}
        {state === "speaking" && <SpeakingLayer />}

        {/* Inner waveform for LISTENING */}
        {state === "listening" && <Waveform color="#00f0ff" />}
      </motion.div>
    </div>
  )
}

function BaseRings() {
  return (
    <svg
      className="absolute inset-0"
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={CENTER - 6}
        fill="none"
        stroke="rgba(0,240,255,0.5)"
        strokeWidth={1.5}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={CENTER - 22}
        fill="none"
        stroke="rgba(0,240,255,0.18)"
        strokeWidth={1}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={CENTER - 46}
        fill="none"
        stroke="rgba(0,240,255,0.12)"
        strokeWidth={1}
        strokeDasharray="2 6"
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={CENTER - 70}
        fill="rgba(0,240,255,0.03)"
        stroke="rgba(0,240,255,0.25)"
        strokeWidth={1}
      />
    </svg>
  )
}

function ListeningLayer() {
  const particles = useMemo(
    () => Array.from({ length: 10 }, (_, i) => i),
    [],
  )
  return (
    <>
      {/* Rotating segmented ring */}
      <motion.svg
        className="absolute inset-0"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={CENTER - 12}
          fill="none"
          stroke="#00f0ff"
          strokeWidth={2}
          strokeDasharray="40 18"
          strokeLinecap="round"
          opacity={0.85}
        />
      </motion.svg>

      {/* Orbiting particles */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        {particles.map((i) => {
          const angle = (i / particles.length) * Math.PI * 2
          const radius = CENTER - 2
          const x = CENTER + radius * Math.cos(angle)
          const y = CENTER + radius * Math.sin(angle)
          return (
            <motion.span
              key={i}
              className="absolute size-1.5 rounded-full bg-cyan-glow"
              style={{
                left: x,
                top: y,
                boxShadow: "0 0 8px #00f0ff",
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.12,
              }}
            />
          )
        })}
      </motion.div>
    </>
  )
}

function ThinkingLayer() {
  const arcs = [
    { r: CENTER - 14, dur: 3, dir: 1, dash: "70 200", color: "#00f0ff" },
    { r: CENTER - 30, dur: 4.5, dir: -1, dash: "50 160", color: "#2b8cff" },
    { r: CENTER - 54, dur: 2.4, dir: 1, dash: "30 120", color: "#7fdfff" },
  ]
  return (
    <>
      {arcs.map((arc, i) => (
        <motion.svg
          key={i}
          className="absolute inset-0"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          animate={{ rotate: arc.dir * 360 }}
          transition={{ duration: arc.dur, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={arc.r}
            fill="none"
            stroke={arc.color}
            strokeWidth={2}
            strokeDasharray={arc.dash}
            strokeLinecap="round"
            opacity={0.9}
          />
        </motion.svg>
      ))}
      {/* Independently rotating inner segment */}
      <motion.svg
        className="absolute inset-0"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        animate={{ rotate: -360 }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={CENTER - 70}
          fill="none"
          stroke="#00f0ff"
          strokeWidth={3}
          strokeDasharray="20 220"
          strokeLinecap="round"
        />
      </motion.svg>
    </>
  )
}

function SpeakingLayer() {
  const ripples = [0, 1, 2]
  return (
    <>
      {ripples.map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-cyan-glow/60"
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.66,
            ease: "easeOut",
          }}
        />
      ))}
      <Waveform color="#7fdfff" />
    </>
  )
}

/** Simulated audio waveform bars arranged inside the ring. */
function Waveform({ color }: { color: string }) {
  const [seed, setSeed] = useState(0)
  const bars = useMemo(() => Array.from({ length: 28 }, (_, i) => i), [])

  // Randomize bar heights periodically for a "live audio" feel.
  useEffect(() => {
    const id = setInterval(() => setSeed((s) => s + 1), 140)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="flex items-center justify-center gap-[3px]"
        style={{ width: SIZE - 110, height: 60 }}
      >
        {bars.map((i) => {
          // Deterministic-ish pseudo random based on seed + index.
          const h =
            8 + Math.abs(Math.sin(i * 1.3 + seed * 0.9)) * 44 * (0.4 + ((i % 5) / 5))
          return (
            <span
              key={i}
              className="w-[2px] rounded-full transition-[height] duration-150 ease-out"
              style={{
                height: Math.min(h, 52),
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}`,
                opacity: 0.85,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

/** Title + breathing glow, rendered below the ring by the caller. */
export function JarvisTitle() {
  return (
    <motion.h1
      className="font-heading text-3xl font-bold tracking-[0.5em] text-cyan-glow text-glow"
      style={{ paddingLeft: "0.5em" }}
      animate={{ opacity: [0.78, 1, 0.78] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      JARVIS
    </motion.h1>
  )
}

export { AnimatePresence }
