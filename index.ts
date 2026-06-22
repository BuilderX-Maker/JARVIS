// Core shared types for the JARVIS visual shell.

export type RingState = "idle" | "listening" | "thinking" | "speaking"

export type MessageRole = "user" | "jarvis"

export interface ChatMessage {
  id: string
  role: MessageRole
  /** Plain text / markdown content. */
  content: string
  /** Model label shown on jarvis replies, e.g. "Gemini 2.5 Pro". */
  model?: string
  /** Agent label shown on jarvis replies, e.g. "Engineer". */
  agent?: string
}

export interface ModelOption {
  id: string
  name: string
  /** Tailwind text color class for the status dot. */
  dotClass: string
  /** Remaining quota label for demo purposes. */
  remaining?: string
  /** AUTO is a special highlighted option. */
  isAuto?: boolean
}

export type AgentAccent = "default" | "cyan" | "green" | "amber" | "purple" | "blue"

export interface AgentOption {
  id: string
  name: string
  description: string
  accent: AgentAccent
}
