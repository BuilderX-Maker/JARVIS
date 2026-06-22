"use client"

import { motion } from "framer-motion"
import { Check, Copy, RotateCw, Volume2 } from "lucide-react"
import { useState } from "react"
import type { ChatMessage } from "@/types"

interface MessageBubbleProps {
  message: ChatMessage
  index: number
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.08 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {isUser ? (
        <div className="max-w-[80%] rounded-2xl rounded-br-md border border-sky-400/30 bg-sky-500/15 px-4 py-2.5 text-sm leading-relaxed text-foreground backdrop-blur-md">
          {message.content}
        </div>
      ) : (
        <JarvisCard message={message} />
      )}
    </motion.div>
  )
}

function JarvisCard({ message }: { message: ChatMessage }) {
  const blocks = parseContent(message.content)

  return (
    <div className="max-w-[88%]">
      <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
        <div className="space-y-2 text-sm leading-relaxed text-cyan-100/90">
          {blocks.map((b, i) =>
            b.type === "code" ? (
              <CodeBlock key={i} code={b.content} lang={b.lang} />
            ) : (
              <p key={i} className="whitespace-pre-wrap text-pretty">
                {b.content}
              </p>
            ),
          )}
        </div>

        {(message.model || message.agent) && (
          <div className="mt-2 flex justify-end">
            <span className="text-[10px] tracking-wide text-muted-foreground">
              {[message.model, message.agent].filter(Boolean).join(" · ")}
            </span>
          </div>
        )}
      </div>

      {/* Action buttons — UI only this pass. */}
      <div className="mt-1.5 flex items-center gap-1 pl-1">
        <ActionButton icon={Copy} label="Copy" />
        <ActionButton icon={RotateCw} label="Regenerate" />
        <ActionButton icon={Volume2} label="Read aloud" />
      </div>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
}: {
  icon: typeof Copy
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      // TODO(next pass): wire copy / regenerate / TTS actions.
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-cyan-glow"
    >
      <Icon className="size-3.5" />
    </button>
  )
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-glow/15 bg-black/50">
      <div className="flex items-center justify-between border-b border-cyan-glow/10 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-cyan-glow"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3">
        <code className="font-mono text-[12px] leading-relaxed text-cyan-100/90">
          {code}
        </code>
      </pre>
    </div>
  )
}

// Minimal markdown code-fence parser (``` blocks). UI demo only.
interface Block {
  type: "text" | "code"
  content: string
  lang?: string
}

function parseContent(content: string): Block[] {
  const parts = content.split(/```/)
  const blocks: Block[] = []
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // code segment — first line may be the language
      const firstBreak = part.indexOf("\n")
      const lang = part.slice(0, firstBreak).trim()
      const code = part.slice(firstBreak + 1).replace(/\n$/, "")
      blocks.push({ type: "code", content: code, lang: lang || undefined })
    } else if (part.trim()) {
      blocks.push({ type: "text", content: part.trim() })
    }
  })
  return blocks.length ? blocks : [{ type: "text", content }]
}
