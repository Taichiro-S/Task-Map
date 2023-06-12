import { create } from 'zustand'

export type WorkspaceState = {
  updatedFlag: boolean
  toggleUpdate: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  updatedFlag: false,
  toggleUpdate: () => set({ updatedFlag: !get().updatedFlag }),
}))
