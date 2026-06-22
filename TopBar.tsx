"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Camera, X } from "lucide-react"
import { useEffect, useState } from "react"

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)

  // Live clock — updates every second. Initialised client-side to avoid
  // hydration mismatch.
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now
    ? now.toLocaleTimeString("en-GB", { hour12: false })
    : "--:--:--"
  const date = now
    ? now
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
        })
        .toUpperCase()
        .replace(",", "")
    : "---"

  return (
    <>
      <header className="safe-top fixed inset-x-0 top-0 z-40 px-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between py-2">
          {/* Left: live clock */}
          <span className="font-heading text-sm tracking-widest text-cyan-glow/90 tabular-nums text-glow-soft">
            {time}
          </span>

          {/* Center: decorative network status */}
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-glow/50" />
            <span className="relative flex size-2 items-center justify-center">
              <motion.span
                className="absolute inline-flex size-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-emerald-400/80">
              ONLINE
            </span>
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-cyan-glow/50" />
          </div>

          {/* Right: date + camera */}
          <div className="flex items-center gap-3">
            <span className="hidden text-xs tracking-widest text-foreground/70 xs:inline sm:inline">
              {date}
            </span>
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              aria-label="Open camera"
              className="glass flex size-9 items-center justify-center rounded-full text-cyan-glow transition-transform active:scale-90"
            >
              <Camera className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Camera placeholder modal — no real camera this pass. */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCameraOpen(false)}
          >
            <motion.div
              className="glass w-full max-w-sm rounded-2xl p-6 text-center"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-cyan-glow/30 bg-cyan-glow/10">
                <Camera className="size-6 text-cyan-glow" />
              </div>
              <h2 className="font-heading text-lg tracking-wider text-cyan-glow text-glow-soft">
                Camera — Coming Online
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {
                  "Visual sensors are not yet wired in. This module will activate in a future pass."
                }
              </p>
              <button
                type="button"
                onClick={() => setCameraOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-5 py-2 text-sm font-medium tracking-wide text-cyan-glow transition-colors hover:bg-cyan-glow/20"
              >
                <X className="size-4" />
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
