"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Power } from "lucide-react"
import { useEffect, useState } from "react"
import { AgentSelector } from "@/components/AgentBar/AgentSelector"
import { BottomBar } from "@/components/BottomBar/BottomBar"
import { ChatArea } from "@/components/ChatArea/ChatArea"
import { HudCorners } from "@/components/HudCorners/HudCorners"
import { JarvisRing, JarvisTitle } from "@/components/Ring/JarvisRing"
import { ModelSelector } from "@/components/ModelBar/ModelSelector"
import { StatusText } from "@/components/StatusText/StatusText"
import { TopBar } from "@/components/TopBar/TopBar"
import { useUiStore } from "@/store/uiStore"
import type { RingState } from "@/types"

const RING_CYCLE: RingState[] = ["idle", "listening", "thinking", "speaking"]

export default function Page() {
  const ringState = useUiStore((s) => s.ringState)
  const setRingState = useUiStore((s) => s.setRingState)
  const [booting, setBooting] = useState(true)

  // Auto-cycle ring states every 4s (demo behaviour for this visual pass).
  useEffect(() => {
    const id = setInterval(() => {
      const current = useUiStore.getState().ringState
      const next = RING_CYCLE[(RING_CYCLE.indexOf(current) + 1) % RING_CYCLE.length]
      setRingState(next)
    }, 4000)
    return () => clearInterval(id)
  }, [setRingState])

  // Power-on intro auto-dismisses under 1.5s.
  useEffect(() => {
    const id = setTimeout(() => setBooting(false), 1400)
    return () => clearTimeout(id)
  }, [])

  function cycleDebug() {
    const next =
      RING_CYCLE[(RING_CYCLE.indexOf(ringState) + 1) % RING_CYCLE.length]
    setRingState(next)
  }

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Faint glowing grid overlay */}
      <div className="hud-grid pointer-events-none absolute inset-0 z-0" />

      <HudCorners intro={!booting} />
      <TopBar />

      {/* Core hero: ring, title, status, selectors */}
      <section className="safe-top relative z-20 flex shrink-0 flex-col items-center gap-3 px-4 pb-2 pt-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="scale-[0.78] sm:scale-90">
            <JarvisRing state={ringState} />
          </div>
          <div className="-mt-3 flex flex-col items-center gap-2">
            <JarvisTitle />
            <StatusText state={ringState} />
            <div className="mt-1 flex flex-col items-center gap-1.5">
              <ModelSelector />
              <AgentSelector />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Chat */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <ChatArea />
      </div>

      <BottomBar />

      {/* Debug ring-state cycler */}
      <button
        type="button"
        onClick={cycleDebug}
        aria-label="Cycle ring state (debug)"
        className="glass fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest text-cyan-glow/80 sm:flex"
      >
        <Power className="size-3" />
        {ringState}
      </button>

      {/* Power-on intro overlay */}
      <AnimatePresence>
        {booting && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setBooting(false)}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="font-heading text-2xl tracking-[0.6em] text-cyan-glow text-glow"
                style={{ paddingLeft: "0.6em" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.6, 1] }}
                transition={{ duration: 1.1 }}
              >
                JARVIS
              </motion.div>
              <motion.div
                className="h-px bg-cyan-glow/60"
                initial={{ width: 0 }}
                animate={{ width: 160 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
              <motion.span
                className="text-[10px] uppercase tracking-[0.4em] text-cyan-glow/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Initialising core
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
