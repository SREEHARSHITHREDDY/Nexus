import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen:         boolean;
  commandPaletteOpen:  boolean;
  buddyPanelOpen:      boolean;
  activeModal:         string | null;

  setSidebarOpen:      (open: boolean) => void;
  toggleSidebar:       () => void;
  openCommandPalette:  () => void;
  closeCommandPalette: () => void;
  openBuddyPanel:      () => void;
  closeBuddyPanel:     () => void;
  toggleBuddyPanel:    () => void;
  openModal:           (id: string) => void;
  closeModal:          () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen:        true,
      commandPaletteOpen: false,
      buddyPanelOpen:     false,
      activeModal:        null,

      setSidebarOpen:      (open) => set({ sidebarOpen: open }),
      toggleSidebar:       ()     => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      openCommandPalette:  ()     => set({ commandPaletteOpen: true }),
      closeCommandPalette: ()     => set({ commandPaletteOpen: false }),
      openBuddyPanel:      ()     => set({ buddyPanelOpen: true }),
      closeBuddyPanel:     ()     => set({ buddyPanelOpen: false }),
      toggleBuddyPanel:    ()     => set((s) => ({ buddyPanelOpen: !s.buddyPanelOpen })),
      openModal:           (id)   => set({ activeModal: id }),
      closeModal:          ()     => set({ activeModal: null }),
    }),
    {
      name:       'nexus-ui',
      partialize: (s) => ({ sidebarOpen: s.sidebarOpen }),
    },
  ),
);