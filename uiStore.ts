"use client"

import { create } from "zustand"
import type { AgentOption, ChatMessage, ModelOption, RingState } from "@/types"

// ---------------------------------------------------------------------------
// Mock data — UI ONLY. No real model/agent calls happen here.
// TODO(next pass): replace with real model registry + quota from backend.
// ---------------------------------------------------------------------------

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "auto", name: "AUTO", dotClass: "text-cyan-300", isAuto: true },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", dotClass: "text-emerald-400", remaining: "25 left today" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", dotClass: "text-sky-400", remaining: "1500 left today" },
  { id: "llama-3.3-70b", name: "Llama 3.3 70B", dotClass: "text-amber-400", remaining: "500 left today" },
  { id: "deepseek-r1", name: "DeepSeek R1", dotClass: "text-fuchsia-400", remaining: "500 left today" },
  { id: "mistral-small", name: "Mistral Small", dotClass: "text-zinc-300", remaining: "33 left today" },
]

export const AGENT_OPTIONS: AgentOption[] = [
  { id: "general", name: "General", description: "Default Jarvis for everything", accent: "default" },
  { id: "engineer", name: "Engineer", description: "Full senior engineering team", accent: "cyan" },
  { id: "teacher", name: "Teacher", description: "Complete personal learning system", accent: "green" },
  { id: "coordinator", name: "Coordinator", description: "Real-world physical action mode", accent: "amber" },
  { id: "advisor", name: "Advisor", description: "Life and career decisions", accent: "purple" },
  { id: "researcher", name: "Researcher", description: "Deep research and analysis", accent: "blue" },
]

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "JARVIS, are you online?",
  },
  {
    id: "m2",
    role: "jarvis",
    content: "Systems nominal. All subsystems online and standing by for your command.",
    model: "Gemini 2.5 Pro",
    agent: "General",
  },
  {
    id: "m3",
    role: "user",
    content: "Show me a quick TypeScript snippet for a debounce function.",
  },
  {
    id: "m4",
    role: "jarvis",
    content:
      "Of course. Here is a compact, fully-typed debounce utility:\n```ts\nfunction debounce<T extends (...args: any[]) => void>(\n  fn: T,\n  delay = 300,\n) {\n  let timer: ReturnType<typeof setTimeout>\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn(...args), delay)\n  }\n}\n```\nCall it once and reuse the returned function across renders.",
    model: "Gemini 2.5 Pro",
    agent: "Engineer",
  },
  {
    id: "m5",
    role: "jarvis",
    content: "Anything else you would like me to prepare, sir?",
    model: "Gemini 2.0 Flash",
    agent: "General",
  },
]

interface UiState {
  ringState: RingState
  selectedModelId: string
  selectedAgentId: string
  messages: ChatMessage[]

  setRingState: (state: RingState) => void
  setModel: (id: string) => void
  setAgent: (id: string) => void
  addUserMessage: (content: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  ringState: "idle",
  selectedModelId: "gemini-2.5-pro",
  selectedAgentId: "general",
  messages: MOCK_MESSAGES,

  setRingState: (ringState) => set({ ringState }),
  setModel: (selectedModelId) => set({ selectedModelId }),
  setAgent: (selectedAgentId) => set({ selectedAgentId }),

  // TODO(next pass): send message to real backend / model and stream reply.
  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `u-${Date.now()}`, role: "user", content },
      ],
    })),
}))

// Convenience selectors for derived data.
export function getModel(id: string): ModelOption {
  return MODEL_OPTIONS.find((m) => m.id === id) ?? MODEL_OPTIONS[1]
}

export function getAgent(id: string): AgentOption {
  return AGENT_OPTIONS.find((a) => a.id === id) ?? AGENT_OPTIONS[0]
}
