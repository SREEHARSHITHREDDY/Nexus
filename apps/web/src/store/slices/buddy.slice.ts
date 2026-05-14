import { create } from 'zustand';
import { BuddyMode } from '@nexus/types';

export interface BuddyMessage {
  id:          string;
  role:        'user' | 'buddy';
  content:     string;
  mode?:       BuddyMode;
  timestamp:   Date;
  isStreaming?: boolean;
}

interface BuddyState {
  messages:    BuddyMessage[];
  currentMode: BuddyMode;
  isThinking:  boolean;
  sessionId:   string;

  addMessage:        (msg: Omit<BuddyMessage, 'id' | 'timestamp'>) => void;
  updateLastMessage: (content: string) => void;
  setThinking:       (thinking: boolean) => void;
  setMode:           (mode: BuddyMode) => void;
  clearSession:      () => void;
}

export const useBuddyStore = create<BuddyState>((set) => ({
  messages:    [],
  currentMode: BuddyMode.CAPTURE,
  isThinking:  false,
  sessionId:   crypto.randomUUID(),

  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: new Date() },
      ],
    })),

  updateLastMessage: (content) =>
    set((s) => {
      const msgs = [...s.messages];
      const last = msgs[msgs.length - 1];
      if (last) msgs[msgs.length - 1] = { ...last, content, isStreaming: false };
      return { messages: msgs };
    }),

  setThinking:  (isThinking)  => set({ isThinking }),
  setMode:      (currentMode) => set({ currentMode }),
  clearSession: ()            => set({
    messages:  [],
    sessionId: crypto.randomUUID(),
    isThinking: false,
  }),
}));