"use client"

import { useEffect, useRef } from "react"
import { useUiStore } from "@/store/uiStore"
import { MessageBubble } from "./MessageBubble"

export function ChatArea() {
  const messages = useUiStore((s) => s.messages)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      {messages.map((m, i) => (
        <MessageBubble key={m.id} message={m} index={i} />
      ))}
      <div ref={bottomRef} className="h-1 shrink-0" />
    </div>
  )
}
